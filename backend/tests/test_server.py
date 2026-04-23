"""Tests for the FastAPI server endpoints."""

import pytest
from fastapi.testclient import TestClient

from server import app

client = TestClient(app)


class TestHealthEndpoint:
    def test_returns_200(self):
        res = client.get("/health")
        assert res.status_code == 200

    def test_returns_ok_status(self):
        res = client.get("/health")
        assert res.json()["status"] == "ok"

    def test_returns_client_count(self):
        res = client.get("/health")
        assert "clients" in res.json()
        assert isinstance(res.json()["clients"], int)


class TestInjectFaultEndpoint:
    def test_returns_200(self):
        res = client.post("/admin/inject-fault?code=COLLISION_DETECTED")
        assert res.status_code == 200

    def test_returns_ok_true(self):
        res = client.post("/admin/inject-fault?code=GRIPPER_SLIP")
        assert res.json()["ok"] is True

    def test_fault_has_correct_code(self):
        res = client.post("/admin/inject-fault?code=WORKSPACE_VIOLATION")
        assert res.json()["fault"]["code"] == "WORKSPACE_VIOLATION"

    def test_fault_has_id_and_timestamp(self):
        res = client.post("/admin/inject-fault")
        fault = res.json()["fault"]
        assert "id" in fault
        assert "timestamp" in fault

    def test_default_code_is_joint_torque_limit(self):
        res = client.post("/admin/inject-fault")
        # Default code is JOINT_TORQUE_LIMIT
        fault = res.json()["fault"]
        assert fault["code"] in {
            "JOINT_TORQUE_LIMIT", "COLLISION_DETECTED",
            "GRIPPER_SLIP", "WORKSPACE_VIOLATION",
        }


class TestDiagnoseEndpoint:
    FAULT = {
        "id": "test-1",
        "code": "JOINT_TORQUE_LIMIT",
        "message": "Joint 3 exceeded 50 Nm",
        "jointIndex": 3,
        "timestamp": 1234567890.0,
    }

    def test_returns_200_without_api_key(self):
        res = client.post("/diagnose", json={"fault": self.FAULT, "recentStates": []})
        assert res.status_code == 200

    def test_response_is_event_stream(self):
        res = client.post("/diagnose", json={"fault": self.FAULT, "recentStates": []})
        assert "text/event-stream" in res.headers["content-type"]

    def test_response_contains_data_lines(self):
        res = client.post("/diagnose", json={"fault": self.FAULT, "recentStates": []})
        assert b"data:" in res.content

    def test_response_ends_with_done(self):
        res = client.post("/diagnose", json={"fault": self.FAULT, "recentStates": []})
        assert b"[DONE]" in res.content
