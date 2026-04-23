"""Tests for robot_sim: trajectory interpolation, FK, fault building."""

import math
import time

import pytest

from robot_sim import HOME, RobotSim, MultiPhaseTraj, Phase


# ------------------------------------------------------------------ #
#  MultiPhaseTraj interpolation                                        #
# ------------------------------------------------------------------ #

class TestMultiPhaseTraj:
    def _make(self, start, end, duration=2.0):
        """Helper: single-phase traj from start → end over duration."""
        traj = MultiPhaseTraj(
            phases=[Phase(joints=end, duration=duration)],
            skill_id="test",
        )
        traj.begin(start)
        return traj

    def test_at_t0_returns_start(self):
        start = [0.0] * 6
        traj = self._make(start, [1.0] * 6, duration=2.0)
        positions, _, done = traj.sample(traj._phase_started)
        for v in positions:
            assert abs(v) < 0.01
        assert not done

    def test_at_t1_returns_end(self):
        end = [1.0] * 6
        traj = self._make([0.0] * 6, end, duration=2.0)
        positions, _, done = traj.sample(traj._phase_started + 2.0)
        for v in positions:
            assert abs(v - 1.0) < 0.01
        assert done

    def test_midpoint_is_interpolated(self):
        traj = self._make([0.0] * 6, [2.0] * 6, duration=2.0)
        positions, _, done = traj.sample(traj._phase_started + 1.0)
        # Cubic ease-in/out at t=0.5 → t_ease = 0.5²*(3-2*0.5) = 0.5
        for v in positions:
            assert 0.9 < v < 1.1
        assert not done

    def test_duration_zero_returns_end_immediately(self):
        traj = self._make([0.0] * 6, [1.0] * 6, duration=0.001)
        _, _, done = traj.sample(traj._phase_started + 0.1)
        assert done

    def test_six_joints_all_interpolated(self):
        start = [0.0, 1.0, -1.0, 0.5, -0.5, 0.2]
        end   = [1.0, 0.0,  1.0, 1.5,  0.5, 0.8]
        traj  = self._make(start, end, duration=2.0)
        positions, _, done = traj.sample(traj._phase_started + 2.0)
        assert done
        for got, exp in zip(positions, end):
            assert abs(got - exp) < 0.01

    def test_gripper_change_returned_on_phase_completion(self):
        traj = MultiPhaseTraj(
            phases=[Phase(joints=[1.0] * 6, duration=0.001, gripper_closed=True)],
            skill_id="test",
        )
        traj.begin([0.0] * 6)
        _, gripper, done = traj.sample(traj._phase_started + 0.1)
        assert gripper is True
        assert done

    def test_multi_phase_sequences_correctly(self):
        traj = MultiPhaseTraj(
            phases=[
                Phase(joints=[1.0] * 6, duration=0.001),
                Phase(joints=[2.0] * 6, duration=0.001),
            ],
            skill_id="test",
        )
        traj.begin([0.0] * 6)
        # Complete phase 0
        _, _, done = traj.sample(traj._phase_started + 0.1)
        assert not done  # phase 1 still pending
        # Complete phase 1
        _, _, done = traj.sample(traj._phase_started + 0.1)
        assert done


# ------------------------------------------------------------------ #
#  RobotSim — initial state                                           #
# ------------------------------------------------------------------ #

class TestRobotSimInit:
    def test_starts_at_home(self):
        sim = RobotSim()
        for got, exp in zip(sim.positions, HOME):
            assert abs(got - exp) < 0.001

    def test_starts_idle(self):
        assert RobotSim().status == "IDLE"

    def test_starts_with_zero_cycle_count(self):
        assert RobotSim().cycle_count == 0

    def test_starts_with_empty_skill(self):
        assert RobotSim().current_skill == ""

    def test_starts_gripper_open(self):
        assert RobotSim().gripper_closed is False


# ------------------------------------------------------------------ #
#  RobotSim — fault building                                          #
# ------------------------------------------------------------------ #

class TestFaultBuilding:
    def test_fault_has_required_keys(self):
        sim = RobotSim()
        fault = sim.build_fault()
        assert {"id", "code", "message", "jointIndex", "timestamp"} <= fault.keys()

    def test_fault_code_is_known(self):
        sim = RobotSim()
        known = {"JOINT_TORQUE_LIMIT", "COLLISION_DETECTED", "GRIPPER_SLIP", "WORKSPACE_VIOLATION"}
        fault = sim.build_fault()
        assert fault["code"] in known

    def test_fault_respects_explicit_code(self):
        sim = RobotSim()
        fault = sim.build_fault(code="GRIPPER_SLIP")
        assert fault["code"] == "GRIPPER_SLIP"

    def test_fault_respects_explicit_joint_index(self):
        sim = RobotSim()
        fault = sim.build_fault(joint_index=2)
        assert fault["jointIndex"] == 2

    def test_fault_joint_index_in_range(self):
        sim = RobotSim()
        for _ in range(20):
            fault = sim.build_fault()
            assert 0 <= fault["jointIndex"] <= 5

    def test_fault_timestamp_is_recent(self):
        sim = RobotSim()
        before = time.time()
        fault = sim.build_fault()
        assert fault["timestamp"] >= before


# ------------------------------------------------------------------ #
#  Forward kinematics                                                  #
# ------------------------------------------------------------------ #

class TestComputeTcp:
    def test_home_tcp_is_dict_with_keys(self):
        sim = RobotSim()
        tcp = sim._compute_tcp()
        assert {"x", "y", "z", "rx", "ry", "rz"} <= tcp.keys()

    def test_home_tcp_y_is_a_number(self):
        sim = RobotSim()
        tcp = sim._compute_tcp()
        assert isinstance(tcp["y"], float)

    def test_tcp_wrist_angles_match_joints(self):
        # rx = sum of joints 1+2+3 (wrist tilt), ry = joint 4, rz = joint 5
        sim = RobotSim()
        sim.positions[1] = 0.0
        sim.positions[2] = 0.0
        sim.positions[3] = 0.42
        sim.positions[4] = -0.77
        sim.positions[5] = 0.0
        tcp = sim._compute_tcp()
        assert abs(tcp["rx"] - 0.42) < 0.001   # tilt = 0+0+0.42
        assert abs(tcp["ry"] - (-0.77)) < 0.001


# ------------------------------------------------------------------ #
#  State payload shape                                                 #
# ------------------------------------------------------------------ #

class TestStatePayload:
    def test_payload_has_all_top_level_keys(self):
        sim = RobotSim()
        payload = sim.get_state_payload()
        assert {"joints", "tcp", "status", "cycleCount", "currentSkill"} <= payload.keys()

    def test_joints_has_six_positions(self):
        sim = RobotSim()
        payload = sim.get_state_payload()
        assert len(payload["joints"]["positions"]) == 6

    def test_status_is_string(self):
        sim = RobotSim()
        assert isinstance(sim.get_state_payload()["status"], str)
