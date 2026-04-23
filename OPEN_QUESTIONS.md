# Open Questions — To Review with Expert

Notes from implementing Stage 8 (IK pick-and-place). Three areas worth going deeper on with someone who has robotics/systems experience.

---

## 1. Why we didn't use the real UR5 URDF

**What happened:** The PRD planned to load the real UR5 URDF in Three.js via `urdf-loader` (same library used by NASA JPL). The script `scripts/download-urdf.sh` was supposed to fetch it. Instead we hand-drew a simplified arm in `RobotArm.tsx` with approximate geometry.

**Why:** The UR5 URDF from `ros-industrial/universal_robot` uses `xacro` — a ROS macro preprocessor. You can't load a `.xacro` file directly in the browser. It needs to be pre-expanded with `ros2 xacro` first, which requires a ROS installation. That's a non-trivial one-time setup that got skipped during the weekend build.

**What to ask:**
- What's the standard workflow for getting a URDF into a browser-based visualizer without a full ROS install?
- Is there a pre-expanded UR5 URDF somewhere that's browser-ready?
- Tools like `xacro` standalone (without ROS) — do they exist?
- How does Foxglove handle this? They load URDFs in the browser.

---

## 2. UR5 DH Parameters — where to get the authoritative config

**Context:** For IK to work correctly, the FK model used for solving must match the visual model being rendered. Right now they're different (IK uses link lengths extracted from `RobotArm.tsx` geometry; the visual model is simplified). The fix is a shared kinematics config derived from the real UR5 DH parameters.

**The numbers (from UR documentation and ROS `universal_robot` repo):**

| Link | a (m)  | d (m) | α (rad) |
|------|--------|-------|---------|
| 1    | 0      | 0.089 | π/2     |
| 2    | -0.425 | 0     | 0       |
| 3    | -0.392 | 0     | 0       |
| 4    | 0      | 0.109 | π/2     |
| 5    | 0      | 0.095 | -π/2    |
| 6    | 0      | 0.082 | 0       |

**What to ask:**
- Are these the modified or standard DH parameters? (There are two conventions — important for implementation.)
- Where is the canonical source? (UR publishes a "Script Manual" and "Kinematics" document — worth getting the official PDF.)
- `roboticstoolbox-python` has a built-in UR5 model — does it use the same parameters? Can we trust it directly?
- If we load the real URDF, do we still need to implement FK separately or does the URDF loader handle that?

---

## 3. How to keep scene object positions in sync between backend and frontend

**The problem:** The part ("stock") position is hardcoded in `WorkcellScene.tsx` as `[-0.2, 0.5675, 0.0]`. The robot base position is hardcoded in `RobotArm.tsx` as `[0.7, 0.55, 0.0]`. The backend IK solver needs these same numbers but has no way to read them — they're buried in React components.

**What to ask:**
- How do production robotics HMIs solve this? (e.g. Foxglove, Intrinsic Flowstate, RViz)

**Known approaches:**

1. **Backend owns the scene (Flowstate/ROS approach):** The backend publishes the full scene graph over the same data channel as telemetry — object positions, the robot model, coordinate frames — as structured messages. The frontend just renders what it receives. Nothing is hardcoded in the frontend. This is what ROS's TF (transform) system does and what Foxglove's `SceneUpdate` messages implement.

2. **Shared config file:** A single `scene.config.ts` or `scene.json` with all world-space positions, imported by both the React scene components and any planning/IK code. Simple for a single-robot fixed scene.

3. **URDF + scene SDF:** In ROS, the robot is described by URDF and the environment by a separate SDF/world file. Both are loaded by the simulator and the visualizer from the same source. No hardcoding anywhere.

**What to research:**
- How does Foxglove's `SceneUpdate` protocol work? That's probably the closest analogue to what Flowstate does.
- ROS TF2 — how does it propagate coordinate frames between nodes? Is that relevant here?
- For a non-ROS browser-based system like ours, what's the minimal version of "backend owns the scene graph"?

---

## Related reading
- [gkjohnson/urdf-loaders](https://github.com/gkjohnson/urdf-loaders) — how URDF loading works in Three.js
- [ros-industrial/universal_robot](https://github.com/ros-industrial/universal_robot) — UR5 URDF source
- [Foxglove MCAP / SceneUpdate](https://foxglove.dev/docs) — how Foxglove handles scene description
- Universal Robots Script Manual (official PDF) — has the DH parameter table
