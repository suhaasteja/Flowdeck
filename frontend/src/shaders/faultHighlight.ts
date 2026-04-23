import * as THREE from 'three'

// Vertex shader: pass world-space normal and view direction for rim lighting
const vert = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - worldPos.xyz);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader: pulsing red glow (~4 Hz) + rim highlight at glancing angles
const frag = /* glsl */`
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // 4 Hz pulse: 2π × 4 ≈ 25.13
    float pulse = 0.5 + 0.5 * sin(uTime * 25.133);

    // Rim factor: brightest at edges (glancing view angle)
    float rim = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
    rim = pow(rim, 2.5);

    float base = mix(0.35, 1.0, pulse);
    float intensity = base + rim * 0.8;

    // Red channel full, green/blue dimmed and further suppressed on the rim
    float g = 0.23 * intensity * (1.0 - rim * 0.5);
    float b = 0.19 * intensity * (1.0 - rim * 0.5);
    gl_FragColor = vec4(intensity, g, b, 1.0);
  }
`

export const faultShader = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0.0 },
  },
  vertexShader: vert,
  fragmentShader: frag,
  side: THREE.FrontSide,
})
