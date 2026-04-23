import * as THREE from 'three'

const tableMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: 0.6, metalness: 0.2 })
const legMat   = new THREE.MeshStandardMaterial({ color: 0x1c1c20, roughness: 0.5 })
const frameMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, transparent: true, opacity: 0.15, roughness: 0.3 })
const floorMat = new THREE.MeshStandardMaterial({ color: 0xdde2ec, roughness: 0.9 })
const partMat  = new THREE.MeshStandardMaterial({ color: 0x4a7a5a, roughness: 0.5 })
const frustumMat = new THREE.MeshBasicMaterial({ color: 0xb080e0, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
const frustumEdgeMat = new THREE.LineBasicMaterial({ color: 0x9060c0, transparent: true, opacity: 0.5 })
const monitorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
const standMat   = new THREE.MeshStandardMaterial({ color: 0x888888 })
const kbMat      = new THREE.MeshStandardMaterial({ color: 0x2a2a2a })

const LEG_POSITIONS: [number, number][] = [[-1.05, -0.65], [1.05, -0.65], [-1.05, 0.65], [1.05, 0.65]]

function CameraFrustum({ position, target }: { position: [number, number, number]; target: [number, number, number] }) {
  const geom = new THREE.ConeGeometry(0.35, 0.7, 4, 1, true)
  const from = new THREE.Vector3(...position)
  const to   = new THREE.Vector3(...target)

  // Orient cone toward target: cone points down by default (−Y), rotate to face target
  const dir = new THREE.Vector3().subVectors(to, from).normalize()
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir)

  return (
    <group position={position} quaternion={quaternion}>
      <mesh geometry={geom} material={frustumMat} />
      <lineSegments material={frustumEdgeMat}>
        <edgesGeometry args={[geom]} />
      </lineSegments>
    </group>
  )
}

export function WorkcellScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color={0xaaccff} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={floorMat}>
        <planeGeometry args={[20, 20]} />
      </mesh>

      {/* Grid */}
      <gridHelper args={[20, 40, 0xbbc3d1, 0xd5dae3]} position={[0, 0.001, 0]} />

      {/* Table top */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow material={tableMat}>
        <boxGeometry args={[2.2, 0.1, 1.4]} />
      </mesh>

      {/* Table legs */}
      {LEG_POSITIONS.map(([x, z]) => (
        <mesh key={`leg-${x}-${z}`} position={[x, 0.25, z]} castShadow material={legMat}>
          <boxGeometry args={[0.06, 0.5, 0.06]} />
        </mesh>
      ))}

      {/* Transparent enclosure uprights */}
      {LEG_POSITIONS.map(([x, z]) => (
        <mesh key={`frame-${x}-${z}`} position={[x, 1.45, z]} material={frameMat}>
          <boxGeometry args={[0.04, 1.8, 0.04]} />
        </mesh>
      ))}

      {/* Pick-and-place target part */}
      <mesh position={[-0.2, 0.56, 0]} castShadow receiveShadow material={partMat}>
        <boxGeometry args={[0.18, 0.015, 0.14]} />
      </mesh>

      {/* Camera frustums (decorative vision sensors) */}
      <CameraFrustum position={[0.4, 1.3, 0.1]}  target={[-0.2, 0.56, 0]} />
      <CameraFrustum position={[-0.5, 1.2, 0.3]} target={[-0.2, 0.56, 0]} />

      {/* Monitor */}
      <mesh position={[-0.8, 0.63, -0.4]} castShadow material={standMat}>
        <boxGeometry args={[0.04, 0.15, 0.04]} />
      </mesh>
      <mesh position={[-0.8, 0.82, -0.4]} rotation={[0, 0.3, 0]} castShadow material={monitorMat}>
        <boxGeometry args={[0.4, 0.25, 0.02]} />
      </mesh>
      <mesh position={[-0.8, 0.56, -0.25]} castShadow material={kbMat}>
        <boxGeometry args={[0.28, 0.015, 0.1]} />
      </mesh>
    </>
  )
}
