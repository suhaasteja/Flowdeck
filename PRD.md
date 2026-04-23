# PRD: Workcell Operator Console

Version: 1.0
Owner: (me)
Target completion: one weekend (15–20 hrs)

---

## 1. Product Summary

A browser-based Human-Machine Interface (HMI) for a simulated 6-DOF industrial robot arm (UR5) performing a pick-and-place task. The operator sees a live 3D digital twin of the robot, commands skills via a behavior-tree UI, watches real-time telemetry, and gets AI-assisted troubleshooting when faults occur. A Python backend simulates the robot and streams state over WebSocket using Protobuf-encoded messages.

The system is the weekend-scoped analogue of Intrinsic's Flowstate platform. Every feature maps to a bullet in the Intrinsic JD.

---

## 2. Goals & Success Criteria

### Primary goals

1. **Demonstrate every must-have skill from the JD** in a single coherent product.
2. **Ship a running end-to-end demo** — live URL, one-command local run, 30-second GIF.
3. **Produce repo-quality code** — clean architecture, tests, TypeScript throughout, documented decisions.

### Success criteria (binary checks)

- [ ] I can `git clone && npm install && npm run dev` and have the UI up in <2 min
- [ ] I can run the Python backend with one command (`uv run python server.py` or equivalent)
- [ ] Clicking any skill block in the BT sends a command; the 3D robot visibly moves in response
- [ ] Telemetry numbers update at ≥30 Hz in the right panel while robot is moving
- [ ] Injecting a fault triggers a panel; clicking "Diagnose" returns a real LLM-generated response
- [ ] Killing the WebSocket shows a "reconnecting…" banner; app shell still loads offline
- [ ] All tests pass in CI (GitHub Actions)
- [ ] Frontend hits 60 FPS on a MacBook Air with the full scene loaded
- [ ] README includes: architecture diagram, GIF, stack rationale, perf notes

### Non-goals (confirm excluded)

- Real robot hardware support
- Auth / accounts / user management
- Mobile / responsive layout
- Internationalization
- Bazel (use Vite instead — document the "would swap to Bazel at scale" decision in README)

---

## 3. Target User

**"Alex, the cell operator."** Alex is on the factory floor in front of a 27" monitor running Chrome. They're not a programmer. Their job is to watch the robot run, spot problems, and act fast when something goes wrong. They value:

- Speed of information (is it running? where? any faults?)
- Trust (what I see is what the robot is actually doing)
- Recovery (when it breaks, help me fix it)

This isn't a consumer-grade delightful UI. It's a tool Alex uses for 8-hour shifts.

---

## 4. Tech Stack

### Frontend

| Layer | Tech | Why |
|---|---|---|
| Language | **TypeScript (strict mode)** | JD requires TS; strict catches real bugs |
| Framework | **React 18** | JD lists React; widest library support for 3D/testing |
| Build | **Vite** | Fast DX for weekend scope (note re: Bazel in README) |
| 3D engine | **Three.js + React Three Fiber + Drei** | JD explicitly calls out Three.js; R3F makes 3D composable in React |
| URDF loader | **`urdf-loader` (gkjohnson)** | De-facto standard, used by NASA JPL |
| State (UI) | **Zustand** | Simple, no boilerplate, scales well for real-time streams |
| State (server) | **TanStack Query** | For any HTTP/REST calls (fault history, diagnoses) |
| Styling | **Tailwind CSS + CSS variables for theming** | Fast, consistent, easy to refactor |
| Icons | **Lucide React** | Clean, industrial-looking |
| Protobuf | **`protobuf-ts`** | Modern TS-first Protobuf codegen |
| WebSocket | Native `WebSocket` API | No lib needed for a single stream |
| Testing | **Vitest + React Testing Library + Playwright** | Vitest integrates with Vite; RTL for unit, Playwright for E2E |
| Offline | **Vite PWA plugin (Workbox under the hood)** | Standard, low-effort PWA/service worker |

### Backend

| Layer | Tech | Why |
|---|---|---|
| Language | **Python 3.11+** | JD requires "read Python backend code" |
| Framework | **FastAPI** | Built-in WebSocket support, async, clean DX |
| Protobuf | **`protobuf` (official)** | Shared `.proto` schema with frontend |
| Simulation loop | **asyncio task @ 100 Hz** | Simple, enough for visual feedback |
| Package mgr | **uv** | Fast, modern Python tooling |
| Testing | **pytest + pytest-asyncio** | Standard |

### AI Agent

| Layer | Tech | Why |
|---|---|---|
| LLM | **Anthropic API (Claude)** | Best-in-class reasoning for diagnosis |
| Integration | Backend → Anthropic (keeps API key server-side) | Security |

### Infra

| Layer | Tech | Why |
|---|---|---|
| Monorepo | npm workspaces (frontend + shared proto package) | Simple |
| CI | GitHub Actions | Free, standard |
| Frontend host | **Vercel** | Free tier, fast, auto-deploy from main |
| Backend host | **Fly.io** or **Railway** | Free/cheap tier, WebSocket support |

---

## 5. Architecture

### High-level data flow

```
┌──────────────────────┐        WebSocket          ┌──────────────────────┐
│  Browser (React)     │◄─── joint states ────────│  Python FastAPI      │
│                      │    (Protobuf, 30 Hz)      │                      │
│  - Three.js / R3F    │                           │  - Fake robot sim    │
│  - URDF viewer       │─── skill commands ───────►│  - Fault injector    │
│  - BT panel          │    (Protobuf)             │  - Trajectory player │
│  - Telemetry panel   │                           │                      │
│  - Fault panel       │                           └──────────┬───────────┘
│  - Diagnose button   │                                      │
└──────────┬───────────┘                                      │  HTTPS
           │ HTTPS                                            ▼
           └────────── /diagnose (fault ctx) ─────► Anthropic API (Claude)
```

### Repo structure

```
workcell-console/
├── README.md
├── CONTEXT.md                    (this convo context)
├── PRD.md                        (this file)
├── package.json                  (npm workspaces root)
├── .github/workflows/ci.yml
├── proto/
│   └── robot.proto               (shared schema: JointState, Command, Fault, etc.)
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── TopBar.tsx
│   │   │   ├── BehaviorTreePanel.tsx
│   │   │   ├── Viewer3D.tsx            (R3F canvas)
│   │   │   ├── RobotModel.tsx          (URDF loader)
│   │   │   ├── WorkcellScene.tsx       (table, frustums, part)
│   │   │   ├── TelemetryPanel.tsx
│   │   │   ├── SceneTree.tsx
│   │   │   ├── FaultPanel.tsx
│   │   │   ├── DiagnosisModal.tsx
│   │   │   └── ConnectionStatus.tsx
│   │   ├── hooks/
│   │   │   ├── useRobotStream.ts       (WebSocket → Zustand)
│   │   │   └── useCommand.ts
│   │   ├── store/
│   │   │   └── robotStore.ts           (Zustand: joints, pose, status, faults)
│   │   ├── proto/                      (generated TS from robot.proto)
│   │   ├── lib/
│   │   │   ├── ws.ts                   (WebSocket client wrapper)
│   │   │   └── perfHud.ts
│   │   └── tests/
│   ├── public/
│   │   └── urdf/ur5/                   (UR5 URDF + meshes)
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── server.py                       (FastAPI entry)
│   ├── robot_sim.py                    (fake UR5 kinematics + trajectories)
│   ├── fault_injector.py
│   ├── diagnose.py                     (Anthropic API caller)
│   ├── proto/                          (generated Python from robot.proto)
│   ├── tests/
│   └── pyproject.toml
└── scripts/
    ├── gen-proto.sh                    (codegen for TS + Python)
    └── download-urdf.sh                (pull UR5 URDF into frontend/public)
```

### Protobuf schema (sketch)

```proto
syntax = "proto3";

message JointState {
  double timestamp = 1;
  repeated double positions = 2;    // 6 joint angles (rad)
  repeated double velocities = 3;
  repeated double efforts = 4;      // torques (Nm)
  bool gripper_closed = 5;
}

message TcpPose {
  double x = 1; double y = 2; double z = 3;   // meters
  double rx = 4; double ry = 5; double rz = 6; // euler, rad
}

message RobotState {
  JointState joints = 1;
  TcpPose tcp = 2;
  enum Status { IDLE = 0; MOVING = 1; FAULTED = 2; E_STOP = 3; }
  Status status = 3;
  int32 cycle_count = 4;
  string current_skill = 5;
}

message SkillCommand {
  string skill_id = 1;       // "pick_stock", "approach_cnc", etc.
  map<string, string> params = 2;
}

message Fault {
  string id = 1;
  string code = 2;           // "JOINT_TORQUE_LIMIT", "COLLISION_DETECTED", etc.
  string message = 3;
  int32 joint_index = 4;     // -1 if not joint-specific
  double timestamp = 5;
}

// Server → Client stream
message ServerMessage {
  oneof payload {
    RobotState state = 1;
    Fault fault = 2;
  }
}

// Client → Server stream
message ClientMessage {
  oneof payload {
    SkillCommand skill = 1;
    bool e_stop = 2;
    bool reset = 3;
  }
}
```

---

## 6. Feature Spec

### 6.1 Top Bar
- Title: "Challenge" (or project name)
- Tabs: Build | Execute (visual only for v1)
- Center pill: green dot + "Executing on Simulation" (dot goes amber on reconnecting, red on disconnected — tied to WS state)
- Right icons: settings, notifications (stubs)

### 6.2 Behavior Tree Panel (left, ~260px)
- Collapsible sections mirror the Flowstate screenshot: Initialize, Place stock in vice, Approach, Pre-insert grasp
- Each skill block has a title + a monospace sub-label (e.g. `pc_move_robot`)
- **Click behavior**: sends `SkillCommand` to backend over WebSocket; block shows active highlight while executing; reverts on completion/fault
- Non-goal: drag-to-reorder, editing the tree — read-only for v1

### 6.3 3D Viewer (center, flex)
- R3F `<Canvas>` filling available space
- Real UR5 URDF loaded from `/urdf/ur5/` via `urdf-loader`
- Dark workcell table under the arm, grid floor, transparent enclosure uprights
- 2 purple camera frustum cones (decorative — represent vision sensors)
- A simple target "part" on the table for pick-and-place
- OrbitControls for navigation
- Joint angles driven **entirely by WebSocket state** — no local animation. Robot only moves when backend sends new state.
- Perf overlay (stats.js) toggleable via `?debug=1` query param
- Viewer toolbar top-left: select/move/rotate/scale/camera (visual stubs for v1)
- Top center: Build/Execute tabs (visual stubs)
- Bottom center: XYZ axis gizmo

### 6.4 Right Panel — Scene Tree + Telemetry (~300px)
- Top tabs: **Scene** | **Telemetry**
- **Scene tab**: hierarchical tree of workcell/robot/sensors (mostly visual — matches screenshot). Expandable nodes. Clicking a node highlights it in 3D (stretch goal).
- **Telemetry tab**: live numeric readouts:
  - Current skill (text)
  - Status (IDLE / MOVING / FAULTED)
  - 6 joint angles (rad + deg), monospace, color-coded on limits
  - TCP pose (x/y/z + rx/ry/rz)
  - Gripper state (open/closed)
  - Cycle count
  - Uptime
- Numbers must update at 30+ Hz without causing React re-renders of unrelated components (use selectors or direct refs).

### 6.5 Fault Panel (overlay, bottom)
- Hidden until a fault is received from backend
- Slides up from bottom with:
  - Fault code (e.g., `JOINT_TORQUE_LIMIT`)
  - Message (e.g., "Joint 3 exceeded 50 Nm (measured 67 Nm)")
  - Timestamp
  - Affected joint visually highlighted red in 3D view
  - **"Diagnose" button** → opens Diagnosis Modal
  - "Acknowledge & reset" button → sends `reset` command

### 6.6 Diagnosis Modal (AI agent)
- On click "Diagnose":
  1. Frontend POSTs fault + last 5 seconds of joint state history to `/diagnose` on backend
  2. Backend assembles prompt including: fault context, joint trajectory, robot config summary
  3. Backend calls Anthropic API (Claude) with structured prompt requesting: likely causes (ranked), recommended next steps, risk assessment
  4. Response streams back to the modal (use SSE or chunked response)
- Modal shows:
  - Loading state with skeleton
  - Structured response: "Likely causes" (bulleted), "Recommended actions" (bulleted), "Confidence: high/medium/low"
  - "Ask a follow-up" text box (stretch goal)

### 6.7 Connection Status
- Top bar pill reflects WS state
- On disconnect: toast + persistent banner "Reconnecting to robot…"
- Exponential backoff reconnect (1s, 2s, 4s, 8s, max 30s)
- Last-known state remains on screen with a "stale" visual indicator

### 6.8 Offline Behavior (service worker)
- App shell (HTML/JS/CSS/URDF) cached via Vite PWA plugin
- URDF meshes precached on first load
- If user reloads while offline: app shell loads, shows "Offline — no robot connection" banner
- Not required: persistent action queuing, background sync (stretch goal)

---

## 7. Python Backend Behavior

### Fake robot simulator
- Holds state: 6 joint angles, velocities, current skill
- On `SkillCommand` received: looks up a pre-baked trajectory (waypoints → interpolated positions), plays it at 100 Hz
- Trajectories defined in a simple YAML or Python dict keyed by skill_id
- Broadcasts `RobotState` over WebSocket at 30 Hz
- Computes TCP pose via forward kinematics (use `roboticstoolbox-python` or hand-rolled DH params for UR5)

### Fault injector
- `/admin/inject-fault` endpoint for demo purposes (plus randomized faults every N cycles for flavor)
- Types: `JOINT_TORQUE_LIMIT`, `COLLISION_DETECTED`, `GRIPPER_SLIP`, `WORKSPACE_VIOLATION`

### Diagnose endpoint
- `POST /diagnose` with `{fault, recent_states}`
- Builds prompt from fault + kinematic context
- Calls Claude via Anthropic SDK
- Returns structured JSON (causes, actions, confidence)
- Uses streaming response for good UX

---

## 8. Testing Strategy

### Unit tests
- **Frontend**: Zustand store logic, WebSocket parser, skill command builder, joint limit helpers
- **Backend**: FK math, trajectory interpolation, fault injector, Protobuf encode/decode

### Integration tests
- **Frontend**: render `<App>` with mock WS, send fake state, assert telemetry panel updates
- **Backend**: FastAPI TestClient — connect WS, send command, assert state stream

### E2E (Playwright)
- Happy path: load app → click skill → see 3D robot move → see telemetry update
- Fault path: inject fault → fault panel appears → click diagnose → assertion on modal content (mocked LLM)
- Disconnect path: kill backend → banner appears → restart backend → banner clears

### Performance tests
- Lighthouse audit in CI (target: performance score ≥ 90)
- Manual FPS check documented in README with hardware specs

---

## 9. Build & Deploy

### Local dev
```bash
# One-time setup
git clone ...
./scripts/download-urdf.sh
npm install
cd backend && uv sync

# Run (two terminals)
npm run dev           # frontend on :5173
cd backend && uv run python server.py  # backend on :8000
```

### Protobuf codegen
```bash
./scripts/gen-proto.sh    # generates frontend/src/proto and backend/proto
```

### CI (GitHub Actions)
- Lint (eslint + ruff)
- Typecheck (tsc + mypy)
- Test (vitest + pytest)
- Build (frontend)
- Playwright on PR

### Deploy
- Frontend → Vercel (auto-deploy on main)
- Backend → Fly.io with WebSocket support
- `ANTHROPIC_API_KEY` as secret in Fly.io

---

## 10. README Requirements

The README is the single most important deliverable. It must include:

1. **Hero**: project name, one-liner, live demo link, 30-second GIF showing full flow
2. **What / Why**: paragraph connecting this to the Intrinsic JD (without being cringe about it)
3. **Architecture diagram** (the ASCII one from section 5 or a prettier Mermaid version)
4. **Tech stack table** with the **why** for each choice, tied to JD skills
5. **Quickstart**: 4 commands max
6. **Features** with screenshots/GIFs of each
7. **Performance notes**: actual measured FPS, message rates, bundle size, with hardware
8. **What I'd build next**: Bazel migration, real ROS driver, gRPC-Web (instead of raw WS), Rust/WASM FK solver — shows awareness of production patterns
9. **Acknowledgments**: urdf-loader, Foxglove, ROS Industrial

---

## 11. Risks & Open Questions

| Risk | Mitigation |
|---|---|
| URDF meshes slow to load | Precompress with Draco, cache aggressively |
| Protobuf codegen tooling pain | Fall back to JSON over WS if it blocks progress (document in README) |
| WebSocket latency on Fly.io | Deploy to nearest region; acceptable for demo |
| Anthropic API rate limits | Cache recent diagnoses by fault signature |
| UR5 URDF uses xacro | Pre-expand once with ros2 xacro, commit expanded URDF |
| 60 FPS on low-end hardware | LOD, instanced meshes where possible, throttle React state updates |

**Open questions for implementer**:
- Use gRPC-Web or raw WebSocket + Protobuf? (Raw WS is simpler; gRPC-Web is closer to JD wording — suggest raw WS + document the trade-off)
- Use React Three Fiber's `useFrame` or direct THREE.Object3D mutation for joint updates? (Direct mutation is faster at high update rates — default to that)
- Host Protobuf files where? (Monorepo `proto/` dir, generated into both sides via script)

---

## 12. Milestones

### Saturday morning (4h) — Foundation
- Repo scaffolded, Vite + React + TS + Tailwind set up
- UR5 URDF downloaded, rendering via R3F in empty canvas
- OrbitControls working
- Basic 3-panel layout (no content yet)

### Saturday afternoon (4h) — Backend + streaming
- Python FastAPI with WebSocket echo
- Protobuf schema defined, codegen scripts working for both sides
- Fake robot sim streaming joint states at 30 Hz
- Frontend consuming stream, driving URDF joints
- Telemetry panel showing live numbers

### Sunday morning (4h) — Command flow + faults
- BT panel wired up, clicking block sends SkillCommand
- Backend plays pre-baked trajectory on command
- Fault injector + fault panel
- Connection status UI, reconnect logic

### Sunday afternoon (4h) — AI agent + polish
- `/diagnose` endpoint calling Anthropic API
- Diagnosis modal with streaming response
- Service worker / PWA setup
- README + GIF + deploy to Vercel/Fly.io

### Stretch (if time): perf HUD polish, scene tree click→highlight, Rust/WASM FK module (saved for post-weekend)

---

### Stage 8 — Inverse kinematics pick-and-place

- Skills are defined as Cartesian target poses (x/y/z position in the workcell) rather than hardcoded joint angles
- `roboticstoolbox-python` UR5 model solves IK — given a target position, it computes the correct joint angles automatically
- Each skill plays a multi-phase trajectory: approach → grasp → lift → move → place, with gripper open/close timed to each phase
- Arm visibly reaches to the part on the table, closes the gripper, lifts, moves to the target, and places
- Gripper state synced in `RobotState` — telemetry panel shows open/closed in real time
- If the part position changes in the scene, the arm follows — motion is data-driven, not scripted

### Stage 9 (3h) — Protobuf binary transport

- `proto/robot.proto` defines all message types: `JointState`, `TcpPose`, `RobotState`, `SkillCommand`, `Fault`, `ServerMessage`, `ClientMessage`
- `scripts/gen-proto.sh` generates TypeScript classes into `frontend/src/proto/` and Python classes into `backend/proto/`
- Backend sends binary WebSocket frames (Protobuf-encoded) instead of JSON strings
- Frontend parses binary frames via `protobuf-ts` — same Zustand store, same UI, zero visible change to the operator
- Skill commands sent from browser to backend are also Protobuf-encoded
- All existing tests updated to use binary Protobuf frames; wire format confirmed correct in CI
- README architecture diagram updated: "Protobuf binary, 30 Hz"

### Stage 10 (4h) — Rust/WASM forward kinematics

- `wasm-fk/` Rust crate implements UR5 forward kinematics using DH parameters — takes 6 joint angles, returns TCP pose (x/y/z + rx/ry/rz)
- `wasm-pack build` compiles the crate to a `.wasm` binary + auto-generated TypeScript bindings
- Browser loads the WASM module once on startup; `computeTcp()` is called inside `useFrame` every frame — no network round-trip, no Python involved
- TCP pose in the telemetry panel is now computed locally in the browser in <0.1 ms
- Backend no longer sends TCP pose in WebSocket messages — only raw joint angles
- `scripts/build-wasm.sh` automates the build; CI caches the Cargo registry between runs

### Stage 11 (2h) — GLSL fault highlight shader

- When a fault fires, the affected joint no longer just turns red — it pulses with a breathing glow effect written in GLSL (a fragment shader running on the GPU)
- Shader reads a `uTime` uniform ticked every frame via `useFrame` and a `uFaulted` uniform driven by the Zustand fault store
- Rim-lighting effect highlights the edges of the faulted joint using the surface normal vs. camera angle
- All other joints keep the default Three.js material; shader is swapped back on fault clear
- No React state involved in the animation — uniform updates happen via direct ref mutation at 60 Hz

---

## 13. Definition of Done

A person who has never seen this project can:
1. Click the live demo link
2. Watch the robot move in 3D
3. Click a skill block, see the robot respond
4. Wait for a fault, click Diagnose, read an LLM response
5. Close their laptop lid, reopen, see the app shell still load
6. Read the README and understand every architectural choice
7. Clone the repo and have it running in <2 minutes

If all 7 work: done. Ship it.
