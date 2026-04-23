# Flowdeck — Build Plan

Each stage ends with a testable checkpoint. **You evaluate each stage before I move to the next.**

---

## Stage 1 — Scaffold + Layout Shell
**Goal:** Repo structure exists, frontend runs, the 3-panel layout matches the visual reference.

**What to run:**
```bash
npm install
npm run dev   # frontend only, no backend yet
```

**What you should see:**
- Browser opens at `localhost:5173`
- Top bar with "Flowdeck" title, Build/Execute tabs, center status pill (grey — no connection yet), settings/notification icon stubs
- Left panel (~260px): "Behavior Tree" header, hardcoded skill blocks visible (no interactivity yet)
- Center: dark gradient background (empty — no 3D yet), viewer toolbar stubs top-left, Build/Execute tabs top-center, axis gizmo bottom-center
- Right panel (~280px): Scene / Telemetry tabs, hardcoded scene tree visible
- No errors in browser console

**Tech delivered:** Vite + React 18 + TypeScript strict + Tailwind CSS + Lucide icons, monorepo root with npm workspaces skeleton.

---

## Stage 2 — 3D Viewer + URDF Robot
**Goal:** The UR5 robot arm renders in 3D in the center panel. You can orbit around it.

**What to run:**
```bash
./scripts/download-urdf.sh   # one-time: pulls UR5 URDF into frontend/public/urdf/
npm run dev
```

**What you should see:**
- The UR5 robot arm rendered in the center panel (grey/metallic mesh, 6 joints visible)
- Dark workcell table under the arm, grid floor
- Two purple camera frustum cones (decorative vision sensors)
- A small target "part" on the table
- Click-and-drag to orbit, scroll to zoom, right-click to pan
- Robot is static (no movement yet — joints frozen at home position)

**Tech delivered:** React Three Fiber + Three.js canvas, `urdf-loader` integration, `OrbitControls`, WorkcellScene (table, grid, frustums).

---

## Stage 3 — Python Backend + Live Telemetry
**Goal:** Python backend streams fake robot state; telemetry panel shows live numbers.

**What to run:**
```bash
# Terminal 1
npm run dev

# Terminal 2
cd backend && uv sync && uv run python server.py
```

**What you should see:**
- Top bar status pill turns **green** with "Executing on Simulation" text
- Right panel → Telemetry tab: 6 joint angle values updating in real time (numbers changing, monospace font)
- TCP pose (x/y/z, rx/ry/rz) updating
- Status reads "IDLE", cycle count incrementing slowly
- **Robot arm moves** — joint angles from the stream drive the URDF, so the arm gently oscillates or holds a pose
- If you kill the backend (Ctrl+C), the pill turns **amber** and a "Reconnecting…" banner appears; numbers freeze with a stale indicator

**Tech delivered:** FastAPI + asyncio WebSocket, Protobuf schema + codegen for both sides, fake 30 Hz robot sim, `useRobotStream` hook, Zustand store, reconnect logic with exponential backoff.

---

## Stage 4 — Behavior Tree Commands + Trajectories
**Goal:** Clicking a skill block sends a command; the robot visibly executes a motion.

**What to run:** Same two terminals as Stage 3.

**What you should see:**
- Click any skill block in the left panel (e.g. "Pick stock", "Approach CNC")
- The clicked block highlights (blue border/background) while executing
- The robot arm moves through a pre-baked trajectory for that skill (smooth motion, ~2–4 seconds)
- Telemetry status changes from `IDLE` → `MOVING` → `IDLE`
- Telemetry joint angles update rapidly during motion
- Block returns to normal state when motion completes
- Clicking another block while one is running: either queues or replaces (your call — document it)

**Tech delivered:** `SkillCommand` → WebSocket send, trajectory YAML/dict per skill, asyncio trajectory playback at 100 Hz interpolation, BT panel active-state highlighting.

---

## Stage 5 — Fault Panel + AI Diagnosis
**Goal:** Faults appear as a panel; clicking Diagnose returns a real Claude-generated response.

**What to run:**
```bash
# Same two terminals as before, plus set env var:
export ANTHROPIC_API_KEY=sk-...
cd backend && uv run python server.py
```

**What you should see:**
- Every ~30 seconds (or via `curl -X POST localhost:8000/admin/inject-fault`) a fault panel slides up from the bottom
- Panel shows: fault code (e.g. `JOINT_TORQUE_LIMIT`), message, timestamp, affected joint highlighted **red** in the 3D view
- Click **"Diagnose"**: modal opens, loading skeleton appears
- Within a few seconds: structured AI response streams in — "Likely causes" bullets, "Recommended actions" bullets, confidence level
- Click **"Acknowledge & Reset"**: fault panel dismisses, robot returns to IDLE, red highlight clears

**Tech delivered:** Fault injector (random + manual endpoint), FaultPanel component, DiagnosisModal, `/diagnose` POST endpoint, Anthropic SDK streaming, SSE response to frontend.

---

## Stage 6 — Offline / PWA + Polish
**Goal:** App shell loads even with no backend. UI is polished and matches the visual reference exactly.

**What to run:**
```bash
npm run build && npm run preview   # test the built app
# Kill backend — reload the page
```

**What you should see:**
- With backend dead and app reloaded: app shell still loads (HTML/JS/CSS served from service worker cache)
- "Offline — no robot connection" banner visible
- URDF meshes load from cache (no network needed after first visit)
- UI polish: fonts, spacing, colors match `flowstate-clone.html` reference exactly
- `?debug=1` query param shows FPS overlay (stats.js)
- All TypeScript errors resolved, no console warnings

**Tech delivered:** Vite PWA plugin (Workbox), URDF precaching, final CSS/UX pass.

---

## Stage 7 — Tests + CI + README
**Goal:** All tests pass, GitHub Actions CI is green, README tells the full story.

**What to run:**
```bash
npm run test         # vitest unit + integration
npm run test:e2e     # playwright
cd backend && uv run pytest
```

**What you should see:**
- All tests green locally
- Push to GitHub → Actions workflow runs lint + typecheck + test + build — all green
- README has: architecture diagram, quickstart (4 commands), tech stack table with JD rationale, feature screenshots, perf notes, "what I'd build next"

**Tech delivered:** Vitest unit tests (store, WS parser, skill builder), RTL integration test (App with mock WS), Playwright E2E (happy path, fault path, disconnect path), pytest backend tests, GitHub Actions `.yml`.

---

## Stage 8 — Inverse Kinematics Pick-and-Place
**Goal:** Skills become real robot motions — the arm reaches to actual 3D positions using IK, closes the gripper, lifts the part, and places it. No more hand-tuned joint angle guesses.

**What to run:** Same two terminals as Stage 7.

**What you should see:**
- Click "Pick stock" — arm swings out, reaches down to the part on the table, gripper closes, arm lifts back up
- Click "Place in vice" — arm moves to the vice position, gripper opens, part is placed
- Click "Return home" — arm returns to neutral pose
- Telemetry status cycles `IDLE` → `MOVING` → `IDLE` through each phase
- Gripper state in telemetry panel toggles open/closed in sync with the motion
- Motion looks natural — smooth interpolation through approach, grasp, lift, move, place waypoints

**Tech delivered:** `roboticstoolbox-python` UR5 model + IK solver, skill definitions as Cartesian target poses (not joint angles), multi-phase trajectory playback (approach → grasp → lift → move → place), gripper state synced through `RobotState`.

---

## Stage 9 — Protobuf Binary Transport
**Goal:** Replace JSON WebSocket messages with real Protobuf binary frames. App behavior stays identical — this is a wire-format upgrade that closes the gRPC/Protobuf gap in the JD.

**What to run:**
```bash
./scripts/gen-proto.sh   # generates TS + Python classes from proto/robot.proto
npm run dev
cd backend && uv run python server.py
```

**What you should see:**
- App looks and works exactly the same as Stage 7 — no visible change to the operator
- In browser DevTools → Network → WS: messages are now binary frames (not readable JSON strings)
- All telemetry, skill commands, and fault messages flow correctly through Protobuf encoding
- `npm run test` and `pytest` still pass — test fixtures updated to use binary frames

**Tech delivered:** `proto/robot.proto` schema, `scripts/gen-proto.sh` codegen (protobuf-ts for frontend, grpcio-tools for backend), binary WebSocket send/receive in `server.py` and `useRobotStream.ts`, updated tests.

---

## Stage 10 — Rust/WASM Forward Kinematics
**Goal:** Move TCP pose computation from Python backend into the browser via a Rust function compiled to WebAssembly. The browser calculates the arm's end-effector position locally — no network round-trip needed.

**What to run:**
```bash
./scripts/build-wasm.sh   # compiles Rust → .wasm + TS bindings into frontend/public/wasm/
npm run dev
cd backend && uv run python server.py
```

**What you should see:**
- Telemetry panel TCP pose (x/y/z, rx/ry/rz) still updates at 30 Hz — but it's now computed in the browser, not sent from the backend
- Backend WebSocket messages no longer include a `tcp` field — only raw joint angles
- Open browser console: `FK compute time: 0.08ms` logged each frame (or similar)
- App still works fully offline (WASM module is cached by the service worker)

**Tech delivered:** `wasm-fk/` Rust crate with UR5 DH-parameter FK math, `wasm-bindgen` JS bindings, `wasm-pack` build script, `frontend/src/lib/fk.ts` wrapper, `useFrame` integration, CI step caching Cargo registry.

---

## Stage 11 — GLSL Fault Highlight Shader
**Goal:** Replace the plain red color swap on fault with a custom GPU shader — a pulsing glow effect written in GLSL that runs entirely on the GPU.

**What to run:** Same two terminals as Stage 9.

**What you should see:**
- Trigger a fault (`curl -X POST localhost:8000/admin/inject-fault`)
- The faulted joint now pulses with a breathing red glow (brightens and dims ~4× per second) instead of a static color change
- Edges of the faulted joint are rim-lit — they glow brighter when viewed at a glancing angle
- All other joints look completely normal
- Clicking "Acknowledge & Reset" clears the shader and returns the joint to its default appearance
- FPS stays at 60 — shader runs on GPU with zero CPU overhead

**Tech delivered:** `frontend/src/shaders/faultHighlight.glsl` (vertex + fragment shaders), `<shaderMaterial>` in R3F with `uTime` and `uFaulted` uniforms, `useFrame` uniform tick via direct ref (no React state), README GPU pipeline section.

---

## Stretch (post-weekend, if time)
- Scene tree node → 3D highlight link
- "Ask follow-up" in Diagnosis Modal
- Deploy: Vercel (frontend) + Fly.io (backend)
