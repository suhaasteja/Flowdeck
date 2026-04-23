/**
 * Compute TCP pose from 6 joint angles (radians).
 *
 * Returns `[x, y, z, rx, ry, rz]` where:
 *   - x/y/z — gripper-tip world position (metres)
 *   - rx     — wrist tilt (j1 + j2 + j3, radians)
 *   - ry     — wrist 2 angle (j4, radians)
 *   - rz     — flange angle (j5, radians)
 *
 * Called from useFrame inside RobotArm.tsx at up to 60 Hz.
 * Typical compute time on modern hardware: < 0.05 ms.
 * @param {number} j0
 * @param {number} j1
 * @param {number} j2
 * @param {number} j3
 * @param {number} j4
 * @param {number} j5
 * @returns {Float64Array}
 */
export function compute_tcp(j0, j1, j2, j3, j4, j5) {
    const ret = wasm.compute_tcp(j0, j1, j2, j3, j4, j5);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}
export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
}
function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}


let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}
