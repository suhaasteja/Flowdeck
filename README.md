# Flowdeck — Workcell Operator Console

> A browser-based Human-Machine Interface for a simulated UR5 robot arm — built as a portfolio artifact demonstrating the full Intrinsic Flowstate engineering stack.

![Flowdeck demo](docs/demo.gif)
<!-- Record a 30s GIF: open app → click skill → robot moves → inject fault → diagnose -->

## What this is

Intrinsic (Google's AI robotics group) builds **Flowstate** — a web-based IDE and digital twin for industrial robots. Their frontend role requires TypeScript, React, Three.js, real-time state management, gRPC/Protobuf, and offline-first PWA architecture.

**Flowdeck** is a compressed, weekend-scoped implementation of the operator-facing HMI layer: a live 3D digital twin of a UR5 arm on the factory floor, where an operator can watch the robot run, dispatch skill commands, and get AI-assisted fault diagnosis — all in the browser.

Every feature maps directly to a bullet in the JD:

| JD requirement | Where it lives |
|---|---|
| TypeScript + React | `frontend/src/` — strict mode throughout |
| Three.js / WebGL | `Viewer3D.tsx`, `RobotArm.tsx`, `WorkcellScene.tsx` |
| Real-time state management | Zustand store + direct `THREE.Object3D` mutation at 30 Hz |
| WebSocket + Protobuf | FastAPI WS + JSON (same schema as proto sketch in PRD) |
| Service workers / offline-first | Vite PWA plugin (Workbox), `?debug=1` FPS overlay |
| AI agent integration | Claude API streaming diagnosis modal |
| Python backend | FastAPI + asyncio robot simulator |

---

## Architecture

```
┌──────────────────────┐        WebSocket          ┌──────────────────────┐
│  Browser (React)     │◄─── joint states ─────────│  Python FastAPI      │
│                      │    (JSON, 30 Hz)           │                      │
│  Three.js / R3F      │                            │  asyncio robot sim   │
│  Behavior tree UI    │──── skill commands ───────►│  trajectory player   │
│  Telemetry panel     │                            │  fault injector      │
│  Fault panel         │                            └──────────┬───────────┘
│  Diagnosis modal     │◄────── SSE stream ──────────────────┘
│  Service worker      │    /diagnose endpoint        Anthropic API (Claude)
└──────────────────────┘
```

**Key architectural decisions:**

- **Direct `THREE.Object3D` mutation in `useFrame`** (not React state) for joint updates — avoids React reconciler overhead at 30 Hz. The Zustand store is read via `getState()` (not `useStore()`) inside `useFrame` to prevent re-renders.
- **Raw WebSocket + JSON** over gRPC-Web — simpler for a single stream; in production I'd swap to gRPC-Web (closer to the JD) and document the tradeoff.
- **Vite over Bazel** — right-sized for weekend scope. A production Intrinsic deployment would use Bazel for hermetic builds and remote caching across a monorepo.

---

## Tech stack

| Layer | Tech | Why |
|---|---|---|
| Language | TypeScript (strict) | JD requires TS; strict mode catches real bugs at the boundary |
| Framework | React 18 | JD lists React; widest ecosystem for 3D + testing |
| Build | Vite | Fast DX; Bazel migration path documented above |
| 3D engine | Three.js + React Three Fiber | JD calls out Three.js; R3F makes 3D composable in React |
| State | Zustand | Minimal boilerplate; `getState()` pattern avoids render overhead at 30 Hz |
| Styling | Tailwind CSS | Fast iteration; consistent design tokens |
| Icons | Lucide React | Clean, industrial aesthetic |
| Offline | Vite PWA (Workbox) | JD: "service workers / offline-first architecture" |
| Testing | Vitest + RTL | Co-located with Vite; no separate Jest config |
| Backend | FastAPI + asyncio | JD: "read Python backend code"; built-in WebSocket; async sim loop |
| AI | Anthropic Claude | Best-in-class reasoning for fault diagnosis; SSE streaming |
| Package mgr | uv | Fast, modern Python tooling |

---

## Quickstart

```bash
# Clone and install
git clone https://github.com/suhaasteja/Flowdeck.git && cd Flowdeck
npm install && cd backend && uv sync && cd ..

# Terminal 1 — frontend
npm run dev

# Terminal 2 — backend
cd backend && uv run python server.py
```

Open **http://localhost:5173**

**Optional:** set `ANTHROPIC_API_KEY` before starting the backend for real AI diagnosis. Without it, a structured mock response is returned.

---

## Features

### Live 3D digital twin
The UR5 arm is driven entirely by WebSocket state — no local animation. Joint angles from the backend are applied directly to `THREE.Group` rotations in `useFrame`, bypassing React for zero-overhead 30 Hz updates.

### Behavior tree command dispatch
Clicking a skill block sends a `SkillCommand` over WebSocket. The backend interpolates a pre-baked trajectory at 100 Hz and streams the motion back. The active block highlights until the trajectory completes.

### Real-time telemetry
Six joint angles (rad + °), TCP pose (x/y/z + rx/ry/rz), gripper state, cycle count — all updating at 30 Hz via direct Zustand store writes without triggering React re-renders in unrelated components.

### AI fault diagnosis
When a fault fires (randomly every ~45s, or via `curl -X POST localhost:8000/admin/inject-fault`):
- The affected joint turns red in the 3D view
- A fault panel slides up with code, message, and timestamp
- Clicking **Diagnose** streams a structured Claude response (likely causes → recommended actions → confidence)
- **Acknowledge & Reset** clears the fault and returns the arm to home

### Offline-first PWA
The app shell, JS chunks, and CSS are precached via Workbox on first load. Killing the backend or going offline: the app still loads from cache with an appropriate banner. The robot's last known state remains visible.

### FPS debug overlay
Add `?debug=1` to the URL to show a live FPS counter driven by `useFrame` via direct DOM mutation — no React re-renders.

---

## Performance

Measured on MacBook Air M2 (Chrome 124):

| Metric | Value |
|---|---|
| Steady-state FPS | 60 FPS |
| WebSocket message rate | 30 Hz |
| JS bundle (gzipped) | 275 KB app + 175 KB Three.js |
| WS parse + store write latency | < 1 ms per frame |
| Cold load time (preview build) | ~1.2s |

The Three.js chunk (683 KB uncompressed) is the main bundle cost — unavoidable for a WebGL app. In production: LOD meshes, Draco-compressed URDF geometry, and URDF mesh precaching would bring perceived load time down significantly.

---

## Running tests

```bash
# Frontend (21 tests)
cd frontend && npx vitest run

# Backend (34 tests)
cd backend && uv run pytest tests/ -v
```

CI runs on every push via GitHub Actions (`.github/workflows/ci.yml`): typecheck → unit tests → build (frontend) and ruff → pytest (backend).

---

## What I'd build next

| Feature | Why |
|---|---|
| **gRPC-Web transport** | Closer to the JD; typed contracts, bidirectional streaming, browser-compatible |
| **Real UR5 URDF + STL meshes** | `urdf-loader` integration is scaffolded; `scripts/download-urdf.sh` fetches and expands the ROS URDF |
| **Rust/WASM FK solver** | Replace the rough Python FK approximation with a deterministic solver compiled to WASM — runs in the browser at native speed |
| **Bazel migration** | Hermetic builds, remote caching, shared `proto/` package across frontend and backend without scripts |
| **ROS 2 driver** | Swap the Python sim for a real `ros2_control` interface — the WebSocket protocol stays identical |
| **Scene tree → 3D highlight** | Clicking a node in the right panel selects the corresponding `THREE.Object3D` |

---

## Acknowledgments

- [gkjohnson/urdf-loaders](https://github.com/gkjohnson/urdf-loaders) — de-facto standard for URDF in Three.js (used by NASA JPL)
- [Foxglove Studio](https://github.com/foxglove/studio) — architectural reference for real-time robotics HMI in the browser
- [ros-industrial/universal_robot](https://github.com/ros-industrial/universal_robot) — UR5 URDF and kinematic parameters
- [Intrinsic Flowstate](https://intrinsic.ai/flowstate) — the product this is inspired by
