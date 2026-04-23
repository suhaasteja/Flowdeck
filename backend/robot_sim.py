"""
Fake UR5 robot simulator.

Runs an asyncio loop at SIM_HZ, broadcasts RobotState to WebSocket clients at BROADCAST_HZ.
Joint positions are the raw Three.js rotation values the frontend uses directly.

Home pose (matching the HTML reference visual):
  J0 pan   = -0.30 rad   (rotation.y)
  J1 lift  = -0.80 rad   (rotation.x)
  J2 elbow =  1.40 rad   (rotation.x)
  J3 wrist1= -0.60 rad   (rotation.x)
  J4 wrist2=  0.30 rad   (rotation.y)
  J5 wrist3=  0.00 rad   (rotation.y)
"""

import asyncio
import math
import random
import time
import uuid
from collections import deque
from dataclasses import dataclass, field
from typing import Callable

SIM_HZ       = 100   # simulation tick rate
BROADCAST_HZ = 30    # WebSocket publish rate

HOME = [-0.30, -0.80, 1.40, -0.60, 0.30, 0.00]

# Idle oscillation amplitudes and frequencies per joint
IDLE_AMP  = [0.12, 0.08, 0.08, 0.10, 0.15, 0.05]
IDLE_FREQ = [0.20, 0.14, 0.18, 0.22, 0.26, 0.10]


@dataclass
class Trajectory:
    """Linear interpolation between two joint poses."""
    start: list[float]
    end:   list[float]
    duration: float          # seconds
    started_at: float = field(default_factory=time.monotonic)
    skill_id: str = ""

    def sample(self, now: float) -> tuple[list[float], bool]:
        t = min((now - self.started_at) / self.duration, 1.0)
        # Ease in-out cubic
        t = t * t * (3 - 2 * t)
        pos = [s + (e - s) * t for s, e in zip(self.start, self.end)]
        done = (now - self.started_at) >= self.duration
        return pos, done


# Pre-baked skill trajectories (target joint poses, relative to HOME)
SKILL_TARGETS: dict[str, list[float]] = {
    "estimate_update": [-0.10, -0.70, 1.20, -0.55, 0.40,  0.00],
    "set_drop_pose":   [-0.50, -0.90, 1.50, -0.65, 0.20,  0.10],
    "plan_grasp":      [ 0.20, -0.60, 1.10, -0.50, 0.45, -0.10],
    "move_to_pick":    [ 0.30, -0.50, 1.00, -0.45, 0.55, -0.20],
    "attach":          [ 0.30, -0.50, 1.00, -0.45, 0.55, -0.20],
    "wait":            [ 0.30, -0.50, 1.00, -0.45, 0.55, -0.20],
    "retract_pick":    [-0.10, -0.75, 1.35, -0.55, 0.30,  0.00],
    "approach_cnc":    [-0.60, -0.85, 1.45, -0.60, 0.15,  0.05],
    "align_stock":     [-0.65, -0.88, 1.48, -0.62, 0.12,  0.08],
    "pre_insert":      [-0.70, -0.92, 1.52, -0.64, 0.10,  0.10],
    "sensor_control":  [-0.72, -0.94, 1.54, -0.66, 0.08,  0.12],
    "insert_contact":  [-0.74, -0.96, 1.56, -0.68, 0.06,  0.14],
    "detach":          [-0.60, -0.85, 1.45, -0.60, 0.15,  0.05],
    "retract_5cm":     [-0.40, -0.80, 1.40, -0.60, 0.25,  0.02],
    "move_idle":       HOME[:],
}


FAULT_TYPES = [
    {"code": "JOINT_TORQUE_LIMIT",   "message": "Joint {j} exceeded torque limit (measured {v:.0f} Nm, limit 50 Nm)"},
    {"code": "COLLISION_DETECTED",   "message": "Unexpected contact force on joint {j} — possible collision"},
    {"code": "GRIPPER_SLIP",         "message": "Gripper encoder mismatch on joint {j} — payload may have slipped"},
    {"code": "WORKSPACE_VIOLATION",  "message": "Joint {j} approached singularity boundary — motion aborted"},
]

RANDOM_FAULT_INTERVAL = 45   # seconds between random fault injections (0 to disable)


class RobotSim:
    def __init__(self) -> None:
        self.positions: list[float] = HOME[:]
        self.velocities: list[float] = [0.0] * 6
        self.gripper_closed: bool = False
        self.status: str = "IDLE"
        self.cycle_count: int = 0
        self.current_skill: str = ""
        self._t: float = 0.0
        self._traj: Trajectory | None = None
        self._clients: set[Callable] = set()
        self._lock = asyncio.Lock()
        # Rolling 5-second state history at 30 Hz = 150 samples
        self.state_history: deque[dict] = deque(maxlen=150)
        self._last_fault_time: float = time.monotonic()

    # ------------------------------------------------------------------ #
    #  Client management                                                    #
    # ------------------------------------------------------------------ #

    def add_client(self, send_fn: Callable) -> None:
        self._clients.add(send_fn)

    def remove_client(self, send_fn: Callable) -> None:
        self._clients.discard(send_fn)

    # ------------------------------------------------------------------ #
    #  Public command API                                                   #
    # ------------------------------------------------------------------ #

    async def execute_skill(self, skill_id: str) -> None:
        async with self._lock:
            if skill_id not in SKILL_TARGETS:
                return
            self._traj = Trajectory(
                start=self.positions[:],
                end=SKILL_TARGETS[skill_id],
                duration=2.5,
                skill_id=skill_id,
            )
            self.status = "MOVING"
            self.current_skill = skill_id

    async def e_stop(self) -> None:
        async with self._lock:
            self._traj = None
            self.status = "E_STOP"
            self.current_skill = ""

    async def reset(self) -> None:
        async with self._lock:
            self._traj = Trajectory(
                start=self.positions[:],
                end=HOME[:],
                duration=1.5,
                skill_id="reset",
            )
            self.status = "MOVING"
            self.current_skill = "reset"

    # ------------------------------------------------------------------ #
    #  State snapshot (for /diagnose and WebSocket publish)               #
    # ------------------------------------------------------------------ #

    def get_state_payload(self) -> dict:
        # Approximate TCP position from joint angles (rough FK for display)
        tcp = self._approx_tcp()
        return {
            "joints": {
                "positions": self.positions,
                "velocities": self.velocities,
                "efforts": [0.0] * 6,
                "gripperClosed": self.gripper_closed,
            },
            "tcp": tcp,
            "status": self.status,
            "cycleCount": self.cycle_count,
            "currentSkill": self.current_skill,
        }

    # ------------------------------------------------------------------ #
    #  Main asyncio loop                                                    #
    # ------------------------------------------------------------------ #

    async def run(self) -> None:
        sim_interval = 1.0 / SIM_HZ
        broadcast_interval = 1.0 / BROADCAST_HZ
        last_broadcast = 0.0

        while True:
            now = time.monotonic()
            self._t += sim_interval

            async with self._lock:
                if self._traj is not None:
                    pos, done = self._traj.sample(now)
                    prev = self.positions[:]
                    self.positions = pos
                    self.velocities = [(p - q) / sim_interval for p, q in zip(pos, prev)]
                    if done:
                        if self._traj.skill_id not in ("reset", "e_stop"):
                            self.cycle_count += 1
                        self._traj = None
                        self.status = "IDLE"
                        self.current_skill = ""
                        self.velocities = [0.0] * 6
                else:
                    # Gentle idle oscillation so the arm visibly moves
                    for i in range(6):
                        self.positions[i] = HOME[i] + IDLE_AMP[i] * math.sin(
                            2 * math.pi * IDLE_FREQ[i] * self._t
                        )
                    self.velocities = [0.0] * 6

            # Broadcast at 30 Hz
            if now - last_broadcast >= broadcast_interval:
                last_broadcast = now
                payload = self.get_state_payload()
                self.state_history.append(payload)
                msg = {"type": "state", "payload": payload}
                dead: set[Callable] = set()
                for send_fn in list(self._clients):
                    try:
                        await send_fn(msg)
                    except Exception:
                        dead.add(send_fn)
                self._clients -= dead

                # Random fault injection for demo realism
                if (
                    RANDOM_FAULT_INTERVAL > 0
                    and self.status == "IDLE"
                    and now - self._last_fault_time > RANDOM_FAULT_INTERVAL
                    and self._clients  # only if someone is watching
                ):
                    self._last_fault_time = now
                    await self._emit_random_fault()

            await asyncio.sleep(sim_interval)

    # ------------------------------------------------------------------ #
    #  Fault injection                                                      #
    # ------------------------------------------------------------------ #

    def build_fault(self, code: str | None = None, joint_index: int | None = None) -> dict:
        ft = next((f for f in FAULT_TYPES if f["code"] == code), None) or random.choice(FAULT_TYPES)
        j = joint_index if joint_index is not None else random.randint(0, 5)
        v = random.uniform(55, 80)
        return {
            "id": str(uuid.uuid4()),
            "code": ft["code"],
            "message": ft["message"].format(j=j, v=v),
            "jointIndex": j,
            "timestamp": time.time(),
        }

    async def inject_fault(self, code: str | None = None, joint_index: int | None = None) -> dict:
        fault = self.build_fault(code, joint_index)
        async with self._lock:
            self.status = "FAULTED"
            self._last_fault_time = time.monotonic()  # reset timer so next random fault waits 45s
        msg = {"type": "fault", "payload": fault}
        for send_fn in list(self._clients):
            try:
                await send_fn(msg)
            except Exception:
                pass
        return fault

    async def _emit_random_fault(self) -> None:
        await self.inject_fault()

    # ------------------------------------------------------------------ #
    #  Approximate TCP (very rough — for display only)                    #
    # ------------------------------------------------------------------ #

    def _approx_tcp(self) -> dict:
        # UR5 link lengths (meters)
        L1, L2, L3 = 0.425, 0.3922, 0.1823
        j0, j1, j2 = self.positions[0], self.positions[1], self.positions[2]
        x = math.cos(j0) * (L2 * math.cos(j1) + L3 * math.cos(j1 + j2))
        y = 0.089 + L2 * math.sin(j1) + L3 * math.sin(j1 + j2)
        z = math.sin(j0) * (L2 * math.cos(j1) + L3 * math.cos(j1 + j2))
        return {
            "x": round(x, 4), "y": round(y, 4), "z": round(z, 4),
            "rx": round(self.positions[3], 4),
            "ry": round(self.positions[4], 4),
            "rz": round(self.positions[5], 4),
        }
