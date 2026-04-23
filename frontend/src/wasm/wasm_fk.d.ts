/* tslint:disable */
/* eslint-disable */

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
 */
export function compute_tcp(j0: number, j1: number, j2: number, j3: number, j4: number, j5: number): Float64Array;
