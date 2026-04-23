"""
Fake UR5 robot simulator with multi-phase IK-based skill trajectories.

Forward kinematics (_fk_tip) is derived from the Three.js arm geometry in
RobotArm.tsx — link lengths and joint axes match the visual model exactly, so
IK-solved joint angles produce visually accurate motion.

IK is solved numerically once at startup (gradient descent on position error)
from Cartesian targets defined in world space. The solved angles become the
waypoints for each skill's multi-phase trajectory.

Joint axis mapping (matches JOINT_AXES in RobotArm.tsx):
  J0  shoulder pan    → Y
  J1  shoulder lift   → X
  J2  elbow           → X
  J3  wrist 1         → X
  J4  wrist 2         → Y
  J5  wrist 3/flange  → Y

Robot base at world [0.7, 0.55, 0].  J0 pivot at world [0.7, 0.63, 0].
Part (stock) at world [-0.2, 0.5675, 0].
"""

import asyncio
import math
import random
import time
import uuid
from collections import deque
from dataclasses import dataclass, field
from typing import Callable, Optional

SIM_HZ       = 100
BROADCAST_HZ = 30

HOME = [-0.30, -0.80, 1.40, -0.60, 0.30, 0.00]

IDLE_AMP  = [0.12, 0.08, 0.08, 0.10, 0.15, 0.05]
IDLE_FREQ = [0.20, 0.14, 0.18, 0.22, 0.26, 0.10]

FAULT_TYPES = [
    {"code": "JOINT_TORQUE_LIMIT",  "message": "Joint {j} exceeded torque limit (measured {v:.0f} Nm, limit 50 Nm)"},
    {"code": "COLLISION_DETECTED",  "message": "Unexpected contact force on joint {j} — possible collision"},
    {"code": "GRIPPER_SLIP",        "message": "Gripper encoder mismatch on joint {j} — payload may have slipped"},
    {"code": "WORKSPACE_VIOLATION", "message": "Joint {j} approached singularity boundary — motion aborted"},
]

RANDOM_FAULT_INTERVAL = 45


# ─────────────────────────────────────────────────────────────────────────────
# Pure-Python 3×3 matrix helpers  (no numpy dependency)
# ─────────────────────────────────────────────────────────────────────────────

def _Ry(t: float) -> list:
    c, s = math.cos(t), math.sin(t)
    return [[c, 0, s], [0, 1, 0], [-s, 0, c]]

def _Rx(t: float) -> list:
    c, s = math.cos(t), math.sin(t)
    return [[1, 0, 0], [0, c, -s], [0, s, c]]

def _mm(A: list, B: list) -> list:
    """3×3 matrix multiply."""
    return [[sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)] for i in range(3)]

def _mv(M: list, v: list) -> list:
    """3×3 matrix × 3-vector."""
    return [sum(M[i][j] * v[j] for j in range(3)) for i in range(3)]

def _vadd(a: list, b: list) -> list:
    return [a[i] + b[i] for i in range(3)]


# ─────────────────────────────────────────────────────────────────────────────
# Forward kinematics — gripper tip world position
# ─────────────────────────────────────────────────────────────────────────────

def _fk_tip(joints: list[float]) -> list[float]:
    """
    Returns [x, y, z] world-space position of the gripper tip.

    Chain matches RobotArm.tsx exactly:
      robot_base  [0.7, 0.55, 0]
      J0 pivot    +[0, 0.08, 0]  → [0.7, 0.63, 0]
      J1 pivot    +[0, 0.05, 0] in J0 frame
      J2 pivot    +[0, 0.45, 0] in J1 frame   (upper arm length)
      J3 at J2    (no positional offset in J2 group)
      wrist base  +[0, 0.38, 0] in J3 frame   (forearm length)
      J4 pivot    +[0, 0.05, 0] in J3 frame
      J5 pivot    +[0, 0.08, 0] in J4 frame
      gripper tip +[0, 0.15, 0] in J5 frame   (gripper base + fingers)
    """
    j0, j1, j2, j3, j4, j5 = joints

    p = [0.7, 0.63, 0.0]          # J0 pivot in world
    R = _Ry(j0)

    p = _vadd(p, _mv(R, [0, 0.05, 0]))   # → J1 pivot
    R = _mm(R, _Rx(j1))

    p = _vadd(p, _mv(R, [0, 0.45, 0]))   # → J2 pivot (upper arm)
    R = _mm(R, _Rx(j2))

    R = _mm(R, _Rx(j3))                   # J3 in-place rotation

    p = _vadd(p, _mv(R, [0, 0.43, 0]))   # forearm (0.38) + J4 offset (0.05)
    R = _mm(R, _Ry(j4))

    p = _vadd(p, _mv(R, [0, 0.08, 0]))   # → J5 pivot
    R = _mm(R, _Ry(j5))

    p = _vadd(p, _mv(R, [0, 0.15, 0]))   # → gripper tip
    return p


# ─────────────────────────────────────────────────────────────────────────────
# Numerical IK — gradient descent on gripper-tip position error
# ─────────────────────────────────────────────────────────────────────────────

def _det3(M: list) -> float:
    return (M[0][0] * (M[1][1]*M[2][2] - M[1][2]*M[2][1])
          - M[0][1] * (M[1][0]*M[2][2] - M[1][2]*M[2][0])
          + M[0][2] * (M[1][0]*M[2][1] - M[1][1]*M[2][0]))

def _solve3(A: list, b: list) -> list | None:
    """Solve 3×3 system A @ x = b via Cramer's rule."""
    d = _det3(A)
    if abs(d) < 1e-12:
        return None
    result = []
    for j in range(3):
        M = [row[:] for row in A]
        for i in range(3):
            M[i][j] = b[i]
        result.append(_det3(M) / d)
    return result


_J_LIM = math.pi   # clamp each optimised joint to [-π, π]


def _ik(
    target: list[float],
    hint: list[float] | None = None,
    fix_j4: float = 0.30,
    fix_j5: float = 0.00,
    max_iter: int = 400,
    tol: float = 0.005,
    damping: float = 0.06,
) -> list[float]:
    """
    Solve IK for gripper tip at `target` [x, y, z] world space.

    Uses damped least-squares (Levenberg–Marquardt style):
        Δq = Jᵀ (J Jᵀ + λ²I)⁻¹ Δx

    Optimises j0–j3 only; j4 and j5 are held fixed.
    Joint angles are clamped to [-π, π] each step to avoid multi-revolution
    solutions that would make the arm spin wildly in the Three.js animation.
    """
    joints = list(hint or HOME)
    joints[4] = fix_j4
    joints[5] = fix_j5
    lam2 = damping * damping

    for _ in range(max_iter):
        tip = _fk_tip(joints)
        dx  = [target[k] - tip[k] for k in range(3)]
        if sum(e * e for e in dx) < tol * tol:
            break

        # Jacobian  J[k][i] = ∂tip[k]/∂joints[i]  for k∈{0,1,2}, i∈{0..3}
        h   = 1e-4
        Jac = [[0.0] * 4 for _ in range(3)]
        for i in range(4):
            jh       = joints[:]
            jh[i]   += h
            th       = _fk_tip(jh)
            for k in range(3):
                Jac[k][i] = (th[k] - tip[k]) / h

        # A = J Jᵀ + λ²I  (3×3)
        A = [
            [sum(Jac[r][i] * Jac[c][i] for i in range(4)) + (lam2 if r == c else 0.0)
             for c in range(3)]
            for r in range(3)
        ]
        y = _solve3(A, dx)
        if y is None:
            break

        # Δq = Jᵀ y  — then clamp to [-π, π]
        for i in range(4):
            joints[i] += sum(Jac[k][i] * y[k] for k in range(3))
            joints[i]  = max(-_J_LIM, min(_J_LIM, joints[i]))

    joints[4] = fix_j4
    joints[5] = fix_j5
    return joints


# ─────────────────────────────────────────────────────────────────────────────
# Cartesian targets  (world space)
# ─────────────────────────────────────────────────────────────────────────────
#
# Part ("stock"):  world [-0.2, 0.5675, 0.0]   (table surface + part thickness)
# CNC vice:        world [ 0.45, 0.72, -0.35]  (right side, elevated)
#
# Gripper-tip targets are set a few cm above contact to leave room for the
# gripper body; the descend phase then moves down to the actual contact point.

_STOCK_APPROACH = [-0.20,  0.74, 0.00]   # 17 cm above stock — clear approach
_STOCK_PICK     = [-0.20,  0.59, 0.00]   # just at stock surface
_STOCK_LIFTED   = [-0.20,  0.88, 0.00]   # lifted clear of table

_VICE_ABOVE     = [ 0.45,  0.85, -0.35]  # above CNC vice
_VICE_INSERT    = [ 0.45,  0.70, -0.35]  # at vice jaw level

_RETRACT_MID    = [ 0.10,  0.82, -0.10]  # neutral mid-air


def _solve() -> dict[str, list[float]]:
    """
    Pre-solve IK for key Cartesian targets at startup (~10 ms).

    Stock poses use numerical IK — the arm genuinely swings 90° around J0 and
    extends toward the part at world [-0.2, y, 0].

    Vice and retract poses are hand-tuned: the vice workspace region sits close
    to the arm's kinematic singularity boundary, so numerical IK converges to
    extreme elbow-down configurations.  Hand-tuned values produce cleaner motion.
    """
    # Hint: arm already panned toward -X world direction (j0 = π/2)
    HINT_STOCK = [math.pi / 2, -1.05, 0.55, -0.70, 0.30, 0.00]

    poses: dict[str, list[float]] = {}

    # IK-solved: arm swings to pick stock from table
    poses["stock_approach"] = _ik(_STOCK_APPROACH, hint=HINT_STOCK)
    poses["stock_pick"]     = _ik(_STOCK_PICK,     hint=poses["stock_approach"])
    poses["stock_lifted"]   = _ik(_STOCK_LIFTED,   hint=poses["stock_approach"])

    # Hand-tuned: arm reaches toward CNC vice on opposite side of workcell
    poses["vice_above"]  = [0.55, -1.00, 1.55, -0.65, 0.30, 0.00]
    poses["vice_insert"] = [0.55, -1.20, 1.72, -0.72, 0.30, 0.00]

    # Hand-tuned: safe mid-air retract between stock and home
    poses["retract_mid"] = [-0.10, -0.78, 1.32, -0.60, 0.30, 0.00]

    return poses


# Solved once at module load (takes ~10 ms)
_SOLVED = _solve()


# ─────────────────────────────────────────────────────────────────────────────
# Multi-phase trajectory
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class Phase:
    joints:         list[float]
    duration:       float
    gripper_closed: Optional[bool] = None   # applied at end of phase; None = no change
    label:          str = ""


@dataclass
class MultiPhaseTraj:
    """Executes a list of Phases in sequence with smooth ease-in/out interpolation."""
    phases:   list[Phase]
    skill_id: str
    _start_joints:   list[float] = field(default_factory=list, init=False)
    _phase_idx:      int         = field(default=0, init=False)
    _phase_started:  float       = field(default_factory=time.monotonic, init=False)

    def begin(self, current_joints: list[float]) -> None:
        self._start_joints  = current_joints[:]
        self._phase_idx     = 0
        self._phase_started = time.monotonic()

    def sample(self, now: float) -> tuple[list[float], Optional[bool], bool]:
        """Returns (positions, gripper_change | None, done)."""
        if self._phase_idx >= len(self.phases):
            return self.phases[-1].joints[:], None, True

        phase   = self.phases[self._phase_idx]
        elapsed = now - self._phase_started
        t       = min(elapsed / max(phase.duration, 1e-6), 1.0)
        t_ease  = t * t * (3 - 2 * t)                          # cubic ease-in/out

        positions = [
            s + (e - s) * t_ease
            for s, e in zip(self._start_joints, phase.joints)
        ]

        if t >= 1.0:
            gripper_change      = phase.gripper_closed
            positions           = phase.joints[:]
            self._phase_idx    += 1
            self._phase_started = time.monotonic()
            self._start_joints  = positions[:]
            done = self._phase_idx >= len(self.phases)
            return positions, gripper_change, done

        return positions, None, False


# ─────────────────────────────────────────────────────────────────────────────
# Skill definitions
# ─────────────────────────────────────────────────────────────────────────────

def _skill_phases() -> dict[str, list[Phase]]:
    S = _SOLVED          # shorthand

    return {
        # ── Initialize ──────────────────────────────────────────────────────
        "estimate_update": [
            Phase(joints=[-0.10, -0.70, 1.20, -0.55, 0.40, 0.00], duration=1.8, label="scan_workspace"),
        ],
        "set_drop_pose": [
            Phase(joints=[-0.50, -0.90, 1.50, -0.65, 0.20, 0.10], duration=1.5, label="set_pose"),
        ],

        # ── Pick stock ───────────────────────────────────────────────────────
        # plan_grasp: swing arm to approach position and open gripper
        "plan_grasp": [
            Phase(joints=S["stock_approach"], duration=2.2,
                  gripper_closed=False, label="approach_stock"),
        ],

        # move_to_pick: full pick sequence — approach → descend → grasp → lift
        "move_to_pick": [
            Phase(joints=S["stock_approach"], duration=1.8, label="approach"),
            Phase(joints=S["stock_pick"],     duration=1.0, label="descend_to_stock"),
            Phase(joints=S["stock_pick"],     duration=0.5,
                  gripper_closed=True, label="grasp"),
            Phase(joints=S["stock_lifted"],   duration=1.0, label="lift"),
        ],

        "attach": [
            Phase(joints=S["stock_lifted"], duration=0.4,
                  gripper_closed=True, label="confirm_grasp"),
        ],
        "wait": [
            Phase(joints=S["stock_lifted"], duration=0.5, label="hold"),
        ],
        "retract_pick": [
            Phase(joints=S["retract_mid"], duration=1.5, label="retract"),
        ],

        # ── Approach CNC ─────────────────────────────────────────────────────
        "approach_cnc": [
            Phase(joints=S["vice_above"], duration=2.2, label="move_to_cnc"),
        ],
        "align_stock": [
            Phase(joints=[
                S["vice_above"][0] - 0.05,
                S["vice_above"][1] - 0.05,
                S["vice_above"][2] + 0.04,
                S["vice_above"][3] - 0.03,
                0.30, 0.00,
            ], duration=1.2, label="align"),
        ],

        # ── Pre-insert grasp ──────────────────────────────────────────────────
        "pre_insert": [
            Phase(joints=S["vice_insert"], duration=1.2, label="pre_insert"),
        ],
        "sensor_control": [
            Phase(joints=S["vice_insert"], duration=1.5, label="sensor_approach"),
        ],
        "insert_contact": [
            Phase(joints=S["vice_insert"], duration=0.8, label="insert"),
        ],

        # detach: release grip then retract
        "detach": [
            Phase(joints=S["vice_insert"], duration=0.4,
                  gripper_closed=False, label="release"),
            Phase(joints=S["vice_above"],  duration=1.0, label="retract_from_vice"),
        ],
        "retract_5cm": [
            Phase(joints=S["retract_mid"], duration=0.8, label="retract_5cm"),
        ],

        # Return home and open gripper
        "move_idle": [
            Phase(joints=HOME[:], duration=2.0,
                  gripper_closed=False, label="return_home"),
        ],
    }


SKILL_PHASES: dict[str, list[Phase]] = _skill_phases()


# ─────────────────────────────────────────────────────────────────────────────
# Robot simulator
# ─────────────────────────────────────────────────────────────────────────────

class RobotSim:
    def __init__(self) -> None:
        self.positions:     list[float] = HOME[:]
        self.velocities:    list[float] = [0.0] * 6
        self.gripper_closed: bool       = False
        self.status:        str         = "IDLE"
        self.cycle_count:   int         = 0
        self.current_skill: str         = ""
        self._t:            float       = 0.0
        self._traj:         Optional[MultiPhaseTraj] = None
        self._clients:      set[Callable] = set()
        self._lock                      = asyncio.Lock()
        self.state_history: deque[dict] = deque(maxlen=150)
        self._last_fault_time: float    = time.monotonic()

    # ── Client management ────────────────────────────────────────────────────

    def add_client(self, send_fn: Callable) -> None:
        self._clients.add(send_fn)

    def remove_client(self, send_fn: Callable) -> None:
        self._clients.discard(send_fn)

    # ── Command API ──────────────────────────────────────────────────────────

    async def execute_skill(self, skill_id: str) -> None:
        async with self._lock:
            phases = SKILL_PHASES.get(skill_id)
            if not phases:
                return
            traj = MultiPhaseTraj(phases=phases, skill_id=skill_id)
            traj.begin(self.positions[:])
            self._traj          = traj
            self.status         = "MOVING"
            self.current_skill  = skill_id

    async def e_stop(self) -> None:
        async with self._lock:
            self._traj          = None
            self.status         = "E_STOP"
            self.current_skill  = ""

    async def reset(self) -> None:
        async with self._lock:
            traj = MultiPhaseTraj(
                phases=[Phase(joints=HOME[:], duration=1.5,
                              gripper_closed=False, label="reset")],
                skill_id="reset",
            )
            traj.begin(self.positions[:])
            self._traj          = traj
            self.status         = "MOVING"
            self.current_skill  = "reset"

    # ── State snapshot ───────────────────────────────────────────────────────

    def get_state_payload(self) -> dict:
        tcp = self._compute_tcp()
        return {
            "joints": {
                "positions":    self.positions,
                "velocities":   self.velocities,
                "efforts":      [0.0] * 6,
                "gripperClosed": self.gripper_closed,
            },
            "tcp":          tcp,
            "status":       self.status,
            "cycleCount":   self.cycle_count,
            "currentSkill": self.current_skill,
        }

    # ── Main loop ────────────────────────────────────────────────────────────

    async def run(self) -> None:
        sim_interval       = 1.0 / SIM_HZ
        broadcast_interval = 1.0 / BROADCAST_HZ
        last_broadcast     = 0.0

        while True:
            now   = time.monotonic()
            self._t += sim_interval

            async with self._lock:
                if self._traj is not None:
                    prev = self.positions[:]
                    pos, gripper_change, done = self._traj.sample(now)
                    self.positions  = pos
                    self.velocities = [(p - q) / sim_interval for p, q in zip(pos, prev)]

                    if gripper_change is not None:
                        self.gripper_closed = gripper_change

                    if done:
                        if self._traj.skill_id not in ("reset", "e_stop"):
                            self.cycle_count += 1
                        self._traj         = None
                        self.status        = "IDLE"
                        self.current_skill = ""
                        self.velocities    = [0.0] * 6
                else:
                    for i in range(6):
                        self.positions[i] = HOME[i] + IDLE_AMP[i] * math.sin(
                            2 * math.pi * IDLE_FREQ[i] * self._t
                        )
                    self.velocities = [0.0] * 6

            if now - last_broadcast >= broadcast_interval:
                last_broadcast = now
                payload        = self.get_state_payload()
                self.state_history.append(payload)
                msg  = {"type": "state", "payload": payload}
                dead: set[Callable] = set()
                for send_fn in list(self._clients):
                    try:
                        await send_fn(msg)
                    except Exception:
                        dead.add(send_fn)
                self._clients -= dead

                if (
                    RANDOM_FAULT_INTERVAL > 0
                    and self.status == "IDLE"
                    and now - self._last_fault_time > RANDOM_FAULT_INTERVAL
                    and self._clients
                ):
                    self._last_fault_time = now
                    await self._emit_random_fault()

            await asyncio.sleep(sim_interval)

    # ── Fault injection ──────────────────────────────────────────────────────

    def build_fault(self, code: str | None = None, joint_index: int | None = None) -> dict:
        ft = next((f for f in FAULT_TYPES if f["code"] == code), None) or random.choice(FAULT_TYPES)
        j  = joint_index if joint_index is not None else random.randint(0, 5)
        v  = random.uniform(55, 80)
        return {
            "id":         str(uuid.uuid4()),
            "code":       ft["code"],
            "message":    ft["message"].format(j=j, v=v),
            "jointIndex": j,
            "timestamp":  time.time(),
        }

    async def inject_fault(self, code: str | None = None, joint_index: int | None = None) -> dict:
        fault = self.build_fault(code, joint_index)
        async with self._lock:
            self.status               = "FAULTED"
            self._last_fault_time     = time.monotonic()
        msg = {"type": "fault", "payload": fault}
        for send_fn in list(self._clients):
            try:
                await send_fn(msg)
            except Exception:
                pass
        return fault

    async def _emit_random_fault(self) -> None:
        await self.inject_fault()

    # ── TCP pose ─────────────────────────────────────────────────────────────

    def _compute_tcp(self) -> dict:
        """TCP pose via the same FK used for IK — accurate to the visual model."""
        x, y, z = _fk_tip(self.positions)
        # Wrist orientation: sum of X-axis rotations determines gripper tilt
        tilt = self.positions[1] + self.positions[2] + self.positions[3]
        return {
            "x":  round(x, 4),
            "y":  round(y, 4),
            "z":  round(z, 4),
            "rx": round(tilt, 4),
            "ry": round(self.positions[4], 4),
            "rz": round(self.positions[5], 4),
        }
