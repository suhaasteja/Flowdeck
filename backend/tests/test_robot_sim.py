"""Tests for robot_sim: trajectory interpolation, FK, fault building."""

import math
import time

import pytest

from robot_sim import HOME, RobotSim, Trajectory


# ------------------------------------------------------------------ #
#  Trajectory interpolation                                            #
# ------------------------------------------------------------------ #

class TestTrajectory:
    def test_at_t0_returns_start(self):
        traj = Trajectory(start=[0.0] * 6, end=[1.0] * 6, duration=2.0)
        traj.started_at = time.monotonic()
        pos, done = traj.sample(traj.started_at)
        for v in pos:
            assert abs(v) < 0.01
        assert not done

    def test_at_t1_returns_end(self):
        traj = Trajectory(start=[0.0] * 6, end=[1.0] * 6, duration=2.0)
        traj.started_at = time.monotonic() - 2.0  # already finished
        pos, done = traj.sample(time.monotonic())
        for v in pos:
            assert abs(v - 1.0) < 0.01
        assert done

    def test_midpoint_is_interpolated(self):
        traj = Trajectory(start=[0.0] * 6, end=[2.0] * 6, duration=2.0)
        traj.started_at = time.monotonic() - 1.0  # halfway
        pos, done = traj.sample(time.monotonic())
        # Ease-in-out: midpoint is exactly 0.5 * 2.0 = 1.0
        for v in pos:
            assert 0.9 < v < 1.1
        assert not done

    def test_duration_zero_returns_end_immediately(self):
        traj = Trajectory(start=[0.0] * 6, end=[1.0] * 6, duration=0.001)
        traj.started_at = time.monotonic() - 0.1
        _, done = traj.sample(time.monotonic())
        assert done

    def test_six_joints_all_interpolated(self):
        start = [0.0, 1.0, -1.0, 0.5, -0.5, 0.2]
        end   = [1.0, 0.0,  1.0, 1.5,  0.5, 0.8]
        traj  = Trajectory(start=start, end=end, duration=2.0)
        traj.started_at = time.monotonic() - 2.0
        pos, done = traj.sample(time.monotonic())
        assert done
        for got, exp in zip(pos, end):
            assert abs(got - exp) < 0.01


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
#  Approximate FK                                                     #
# ------------------------------------------------------------------ #

class TestApproxFK:
    def test_home_tcp_is_dict_with_keys(self):
        sim = RobotSim()
        tcp = sim._approx_tcp()
        assert {"x", "y", "z", "rx", "ry", "rz"} <= tcp.keys()

    def test_home_tcp_y_is_a_number(self):
        """FK returns a numeric Y (approximate — uses visual angles not real UR5 DH)."""
        sim = RobotSim()
        tcp = sim._approx_tcp()
        assert isinstance(tcp["y"], float)

    def test_tcp_wrist_angles_match_joints(self):
        sim = RobotSim()
        sim.positions[3] = 0.42
        sim.positions[4] = -0.77
        tcp = sim._approx_tcp()
        assert abs(tcp["rx"] - 0.42) < 0.001
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
