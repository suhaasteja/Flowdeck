import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRobotStore } from '../store/robotStore'

// Shared materials — created once, never re-allocated
const armWhite  = new THREE.MeshStandardMaterial({ color: 0xf0f0f2, roughness: 0.35, metalness: 0.1 })
const armJoint  = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.4 })
const armFault  = new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 0.4, roughness: 0.4 })

// Axis mapping for each joint (which local rotation axis each UR5 joint drives)
// J0: pan   → Y  |  J1: lift  → X  |  J2: elbow → X
// J3: wrist1 → X  |  J4: wrist2 → Y  |  J5: wrist3 → Y
type Axis = 'x' | 'y' | 'z'
const JOINT_AXES: Axis[] = ['y', 'x', 'x', 'x', 'y', 'y']

export function RobotArm() {
  const jointRefs = [
    useRef<THREE.Group>(null), // J0 shoulder pan
    useRef<THREE.Group>(null), // J1 shoulder lift
    useRef<THREE.Group>(null), // J2 elbow
    useRef<THREE.Group>(null), // J3 wrist 1
    useRef<THREE.Group>(null), // J4 wrist 2
    useRef<THREE.Group>(null), // J5 wrist 3 / flange
  ]

  // Refs to the dark joint disc meshes so we can swap their material for fault highlight
  const discRefs = [
    useRef<THREE.Mesh>(null), // J0 base
    useRef<THREE.Mesh>(null), // J1 shoulder disc
    useRef<THREE.Mesh>(null), // J2 elbow disc
    useRef<THREE.Mesh>(null), // J3 wrist1 disc
    useRef<THREE.Mesh>(null), // J4 wrist2 disc
    useRef<THREE.Mesh>(null), // J5 flange disc
  ]

  // Drive joints + fault highlight directly from store — no React re-renders at 30 Hz
  useFrame(() => {
    const { robot, fault } = useRobotStore.getState()
    const positions = robot.joints.positions
    const faultedJoint = fault?.jointIndex ?? -1

    jointRefs.forEach((ref, i) => {
      if (ref.current) ref.current.rotation[JOINT_AXES[i]] = positions[i] ?? 0
    })
    discRefs.forEach((ref, i) => {
      if (ref.current) ref.current.material = faultedJoint === i ? armFault : armJoint
    })
  })

  return (
    // Positioned on the table surface, right-of-center like the reference
    <group position={[0.7, 0.55, 0]}>

      {/* Base disc — discRef[0] */}
      <mesh ref={discRefs[0]} material={armJoint} position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.10, 0.08, 24]} />
      </mesh>

      {/* J0 — shoulder pan (rotation Y) */}
      <group ref={jointRefs[0]} position={[0, 0.08, 0]}>

        {/* Shoulder disc — discRef[1] */}
        <mesh ref={discRefs[1]} material={armWhite} position={[0, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.12, 24]} />
        </mesh>

        {/* J1 — shoulder lift (rotation X) */}
        <group ref={jointRefs[1]} position={[0, 0.05, 0]}>

          {/* Upper arm */}
          <mesh material={armWhite} position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.45, 20]} />
          </mesh>

          {/* J2 — elbow (rotation X) */}
          <group ref={jointRefs[2]} position={[0, 0.45, 0]}>

            {/* Elbow disc — discRef[2] */}
            <mesh ref={discRefs[2]} material={armJoint} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.11, 20]} />
            </mesh>

            {/* J3 — wrist 1 (rotation X) — attached to elbow, houses forearm */}
            <group ref={jointRefs[3]}>

              {/* Forearm */}
              <mesh material={armWhite} position={[0, 0.19, 0]} castShadow>
                <cylinderGeometry args={[0.048, 0.048, 0.38, 20]} />
              </mesh>

              {/* Wrist 1 joint — discRef[3] */}
              <group position={[0, 0.38, 0]}>
                <mesh ref={discRefs[3]} material={armJoint} rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.045, 0.045, 0.09, 18]} />
                </mesh>

                {/* J4 — wrist 2 (rotation Y) */}
                <group ref={jointRefs[4]} position={[0, 0.05, 0]}>
                  {/* Wrist 2 disc — discRef[4] */}
                  <mesh ref={discRefs[4]} material={armWhite} castShadow>
                    <cylinderGeometry args={[0.04, 0.04, 0.08, 18]} />
                  </mesh>

                  {/* J5 — wrist 3 / flange (rotation Y) */}
                  <group ref={jointRefs[5]} position={[0, 0.08, 0]}>
                    {/* Flange disc — discRef[5] */}
                    <mesh ref={discRefs[5]} material={armJoint} castShadow>
                      <cylinderGeometry args={[0.035, 0.035, 0.05, 18]} />
                    </mesh>

                    {/* Gripper base */}
                    <mesh material={armJoint} position={[0, 0.05, 0]} castShadow>
                      <boxGeometry args={[0.08, 0.06, 0.08]} />
                    </mesh>

                    {/* Fingers */}
                    <mesh material={armJoint} position={[0.035, 0.11, 0]} castShadow>
                      <boxGeometry args={[0.015, 0.08, 0.04]} />
                    </mesh>
                    <mesh material={armJoint} position={[-0.035, 0.11, 0]} castShadow>
                      <boxGeometry args={[0.015, 0.08, 0.04]} />
                    </mesh>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
