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
#  WebSocket endpoint                                                   #
# ------------------------------------------------------------------ #

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket) -> None:
    await ws.accept()
    log.info("Client connected")

    async def send_fn(msg: dict) -> None:
        await ws.send_text(json.dumps(msg))

    sim.add_client(send_fn)
    try:
        async for raw in ws.iter_text():
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                continue

            mtype = msg.get("type")
            payload = msg.get("payload", {})

            if mtype == "skill":
                skill_id = payload.get("skillId", "")
                log.info("Skill command: %s", skill_id)
                await sim.execute_skill(skill_id)

            elif mtype == "e_stop":
                log.warning("E-STOP received")
                await sim.e_stop()

            elif mtype == "reset":
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
