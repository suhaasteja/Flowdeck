// Forward kinematics via WASM.
//
// wasm-pack --target bundler: WASM is loaded at module import time by
// vite-plugin-wasm — no explicit init call needed. compute_tcp() is
// callable immediately after the module resolves.

import type { TcpPose } from '../store/robotStore'
import { compute_tcp } from '../wasm/wasm_fk.js'

// No-op kept for API symmetry with main.tsx; actual init happens at import time.
export function initFk(): void {}

const ZERO_TCP: TcpPose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }

export function computeTcp(positions: number[]): TcpPose {
  try {
    const [j0 = 0, j1 = 0, j2 = 0, j3 = 0, j4 = 0, j5 = 0] = positions
    const r = compute_tcp(j0, j1, j2, j3, j4, j5)
    return { x: r[0], y: r[1], z: r[2], rx: r[3], ry: r[4], rz: r[5] }
  } catch {
    return ZERO_TCP
  }
}
