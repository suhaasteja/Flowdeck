//! UR5 forward kinematics compiled to WebAssembly.
//!
//! The kinematic chain is derived directly from RobotArm.tsx and matches
//! _fk_tip() in robot_sim.py exactly — same link lengths, same joint axes,
//! same base offset — so computed TCP always agrees with the 3-D visual.
//!
//! Joint axis mapping (matches JOINT_AXES in RobotArm.tsx):
//!   J0  shoulder pan    → Y
//!   J1  shoulder lift   → X
//!   J2  elbow           → X
//!   J3  wrist 1         → X
//!   J4  wrist 2         → Y
//!   J5  wrist 3/flange  → Y
//!
//! Robot base at world [0.7, 0.55, 0].  J0 pivot at world [0.7, 0.63, 0].

use wasm_bindgen::prelude::*;

// ── 3-D rotation helpers ─────────────────────────────────────────────────────

type Mat3 = [[f64; 3]; 3];
type Vec3 = [f64; 3];

fn ry(t: f64) -> Mat3 {
    let (s, c) = t.sin_cos();
    [[c, 0.0, s], [0.0, 1.0, 0.0], [-s, 0.0, c]]
}

fn rx(t: f64) -> Mat3 {
    let (s, c) = t.sin_cos();
    [[1.0, 0.0, 0.0], [0.0, c, -s], [0.0, s, c]]
}

fn mm(a: &Mat3, b: &Mat3) -> Mat3 {
    let mut r = [[0.0; 3]; 3];
    for i in 0..3 {
        for j in 0..3 {
            for k in 0..3 {
                r[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    r
}

fn mv(m: &Mat3, v: Vec3) -> Vec3 {
    [
        m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
        m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
        m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
    ]
}

fn vadd(a: Vec3, b: Vec3) -> Vec3 {
    [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

// ── Public FK function ────────────────────────────────────────────────────────

/// Compute TCP pose from 6 joint angles (radians).
///
/// Returns `[x, y, z, rx, ry, rz]` where:
///   - x/y/z — gripper-tip world position (metres)
///   - rx     — wrist tilt (j1 + j2 + j3, radians)
///   - ry     — wrist 2 angle (j4, radians)
///   - rz     — flange angle (j5, radians)
///
/// Called from useFrame inside RobotArm.tsx at up to 60 Hz.
/// Typical compute time on modern hardware: < 0.05 ms.
#[wasm_bindgen]
pub fn compute_tcp(j0: f64, j1: f64, j2: f64, j3: f64, j4: f64, j5: f64) -> Vec<f64> {
    // Chain identical to _fk_tip() in robot_sim.py.
    let mut p: Vec3 = [0.7, 0.63, 0.0]; // J0 pivot in world

    let mut r = ry(j0);
    p = vadd(p, mv(&r, [0.0, 0.05, 0.0])); // → J1 pivot
    r = mm(&r, &rx(j1));

    p = vadd(p, mv(&r, [0.0, 0.45, 0.0])); // → J2 pivot (upper arm)
    r = mm(&r, &rx(j2));

    r = mm(&r, &rx(j3)); // J3 — in-place rotation, no translation

    p = vadd(p, mv(&r, [0.0, 0.43, 0.0])); // forearm (0.38) + J4 offset (0.05)
    r = mm(&r, &ry(j4));

    p = vadd(p, mv(&r, [0.0, 0.08, 0.0])); // → J5 pivot
    r = mm(&r, &ry(j5));

    p = vadd(p, mv(&r, [0.0, 0.15, 0.0])); // → gripper tip

    // Orientation — matches _compute_tcp() in robot_sim.py
    let rx_val = j1 + j2 + j3; // wrist tilt
    let ry_val = j4;
    let rz_val = j5;

    vec![
        (p[0] * 10000.0).round() / 10000.0,
        (p[1] * 10000.0).round() / 10000.0,
        (p[2] * 10000.0).round() / 10000.0,
        (rx_val * 10000.0).round() / 10000.0,
        (ry_val * 10000.0).round() / 10000.0,
        (rz_val * 10000.0).round() / 10000.0,
    ]
}

// ── Tests ─────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn home_position_x_near_base() {
        // At HOME = [-0.30, -0.80, 1.40, -0.60, 0.30, 0.00]
        // J0 pans slightly left — tip X should be near the base X (0.7) ± 0.4
        let r = compute_tcp(-0.30, -0.80, 1.40, -0.60, 0.30, 0.00);
        assert!((r[0] - 0.7_f64).abs() < 0.5, "x={}", r[0]);
    }

    #[test]
    fn all_zeros_tip_above_base() {
        // With all joints at 0 the arm points straight up.
        // x stays at base world X = 0.7 (J0=0 means no pan)
        // y = J0_pivot(0.63) + 0.05 + 0.45 + 0.43 + 0.08 + 0.15 = 1.79
        let r = compute_tcp(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        assert!((r[0] - 0.7).abs() < 0.01, "x={}", r[0]);
        assert!((r[1] - 1.79).abs() < 0.01, "y={}", r[1]);
        assert!(r[2].abs() < 0.01, "z={}", r[2]);
    }

    #[test]
    fn orientation_matches_python() {
        let j1 = -0.80_f64;
        let j2 =  1.40_f64;
        let j3 = -0.60_f64;
        let j4 =  0.30_f64;
        let j5 =  0.00_f64;
        let r = compute_tcp(-0.30, j1, j2, j3, j4, j5);
        let expected_rx = j1 + j2 + j3;
        assert!((r[3] - expected_rx).abs() < 0.001, "rx={}", r[3]);
        assert!((r[4] - j4).abs() < 0.001, "ry={}", r[4]);
        assert!((r[5] - j5).abs() < 0.001, "rz={}", r[5]);
    }

    #[test]
    fn output_length_is_six() {
        let r = compute_tcp(0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        assert_eq!(r.len(), 6);
    }
}
