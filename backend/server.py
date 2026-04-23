"""
Flowdeck backend — FastAPI + WebSocket robot simulator.

Run:
    cd backend && uv run python server.py
"""

import asyncio
import json
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from robot_sim import RobotSim
from diagnose import stream_diagnosis
from proto import robot_pb2

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
log = logging.getLogger(__name__)

sim = RobotSim()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    task = asyncio.create_task(sim.run())
    log.info("Robot simulator started")
    yield
    task.cancel()


app = FastAPI(title="Flowdeck Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------ #
#  Dict → ServerMessage binary                                         #
# ------------------------------------------------------------------ #

def _encode_server_msg(msg: dict) -> bytes:
    """Convert the sim's dict payload to a Protobuf-encoded ServerMessage."""
    server_msg = robot_pb2.ServerMessage()
    msg_type = msg.get("type")

    if msg_type == "state":
        payload = msg["payload"]
        j = payload["joints"]

        state = robot_pb2.RobotState(
            status=payload["status"],
            cycle_count=payload["cycleCount"],
            current_skill=payload["currentSkill"],
        )
        state.joints.positions[:] = j["positions"]
        state.joints.velocities[:] = j["velocities"]
        state.joints.efforts[:] = j["efforts"]
        state.joints.gripper_closed = j["gripperClosed"]
        # tcp is intentionally omitted — the browser computes it via WASM FK
        server_msg.state.CopyFrom(state)

    elif msg_type == "fault":
        payload = msg["payload"]
        fault = robot_pb2.Fault(
            id=payload["id"],
            code=payload["code"],
            message=payload["message"],
            joint_index=payload["jointIndex"],
            timestamp=payload["timestamp"],
        )
        server_msg.fault.CopyFrom(fault)

    elif msg_type == "fault_cleared":
        server_msg.fault_cleared.CopyFrom(robot_pb2.FaultCleared())

    return server_msg.SerializeToString()


# ------------------------------------------------------------------ #
#  WebSocket endpoint                                                   #
# ------------------------------------------------------------------ #

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket) -> None:
    await ws.accept()
    log.info("Client connected")

    async def send_fn(msg: dict) -> None:
        await ws.send_bytes(_encode_server_msg(msg))

    sim.add_client(send_fn)
    try:
        async for raw in ws.iter_bytes():
            try:
                client_msg = robot_pb2.ClientMessage()
                client_msg.ParseFromString(raw)
            except Exception:
                continue

            which = client_msg.WhichOneof("payload")

            if which == "skill":
                skill_id = client_msg.skill.skill_id
                log.info("Skill command: %s", skill_id)
                await sim.execute_skill(skill_id)

            elif which == "e_stop":
                log.warning("E-STOP received")
                await sim.e_stop()

            elif which == "reset":
                log.info("Reset received")
                await sim.reset()
                # Notify all clients that fault is cleared
                for fn in list(sim._clients):
                    try:
                        await fn({"type": "fault_cleared"})
                    except Exception:
                        pass

    except WebSocketDisconnect:
        log.info("Client disconnected")
    finally:
        sim.remove_client(send_fn)


# ------------------------------------------------------------------ #
#  Admin / demo endpoints                                              #
# ------------------------------------------------------------------ #

@app.post("/admin/inject-fault")
async def inject_fault(code: str = "JOINT_TORQUE_LIMIT") -> dict:
    fault = await sim.inject_fault(code=code)
    return {"ok": True, "fault": fault}


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "clients": len(sim._clients)}


# ------------------------------------------------------------------ #
#  AI diagnosis endpoint                                               #
# ------------------------------------------------------------------ #

class DiagnoseRequest(BaseModel):
    fault: dict
    recentStates: list[dict] = []


@app.post("/diagnose")
async def diagnose(body: DiagnoseRequest) -> StreamingResponse:
    # Use robot's own state history if frontend sends nothing
    recent = body.recentStates or list(sim.state_history)[-30:]

    async def sse_stream():
        try:
            async for chunk in stream_diagnosis(body.fault, recent):
                data = json.dumps({"chunk": chunk})
                yield f"data: {data}\n\n"
        except Exception as exc:
            log.error("Diagnosis error: %s", exc)
            yield f"data: {json.dumps({'chunk': f'[error: {exc}]'})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        sse_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
