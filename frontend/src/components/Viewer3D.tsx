import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MousePointer2, Move, RotateCcw, Maximize2, Camera } from 'lucide-react'
import { WorkcellScene } from './WorkcellScene'
import { RobotArm } from './RobotArm'

const TOOLBAR_BUTTONS = [
  { Icon: MousePointer2, label: 'Select' },
  { Icon: Move,          label: 'Move' },
  { Icon: RotateCcw,     label: 'Rotate' },
  { Icon: Maximize2,     label: 'Scale' },
  { Icon: Camera,        label: 'Camera' },
]

const debugMode = new URLSearchParams(window.location.search).has('debug')

/** Measures FPS in useFrame and writes directly to a DOM span — zero React re-renders. */
function FpsMeter({ spanRef }: { spanRef: React.RefObject<HTMLSpanElement> }) {
  const frames = useRef(0)
  const last   = useRef(performance.now())

  useFrame(() => {
    frames.current++
    const now = performance.now()
    if (now - last.current >= 500) {
      const fps = Math.round(frames.current * 1000 / (now - last.current))
      if (spanRef.current) spanRef.current.textContent = `${fps} FPS`
      frames.current = 0
      last.current = now
    }
  })

  return null  // renders nothing into the canvas
}

export function Viewer3D() {
  const fpsSpanRef = useRef<HTMLSpanElement>(null)

  return (
    <div className="flex-1 relative overflow-hidden">

      {/* Toolbar — top left */}
      <div className="absolute top-2.5 left-5 z-10 bg-white rounded-lg shadow-sm flex p-1 gap-0.5">
        {TOOLBAR_BUTTONS.map(({ Icon, label }) => (
          <button
            key={label}
            title={label}
            className="w-[26px] h-[26px] rounded-md flex items-center justify-center text-gray-500 hover:bg-topbar-active transition-colors"
          >
            <Icon size={12} />
          </button>
        ))}
      </div>

      {/* Build / Execute tabs — top center */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 bg-white rounded-lg shadow-sm flex p-[3px]">
        <button className="px-4 py-[5px] text-[12px] rounded-md bg-[#1a1a1a] text-white">
          Build
        </button>
        <button className="px-4 py-[5px] text-[12px] rounded-md text-gray-600 hover:bg-topbar-active transition-colors">
          Execute
        </button>
      </div>

      {/* FPS overlay — only when ?debug=1 */}
      {debugMode && (
        <div className="absolute top-2.5 right-5 z-10 bg-black/70 rounded-md px-2.5 py-1 pointer-events-none">
          <span ref={fpsSpanRef} className="font-mono text-[11px] text-green-400">-- FPS</span>
        </div>
      )}

      {/* R3F Canvas */}
      <Canvas
        shadows
        camera={{ position: [2.5, 2.0, 3.0], fov: 45 }}
        style={{ background: 'linear-gradient(to bottom, #fafbfe 0%, #eef0f5 100%)' }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <WorkcellScene />
          <RobotArm />
          {debugMode && <FpsMeter spanRef={fpsSpanRef} />}
          <OrbitControls
            target={[0, 0.7, 0]}
            enableDamping
            dampingFactor={0.1}
            minDistance={1.5}
            maxDistance={8}
          />
        </Suspense>
      </Canvas>

      {/* Axis gizmo — bottom center */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-[60px] h-[60px] bg-white rounded-full shadow-md flex items-center justify-center pointer-events-none">
        <span className="text-[10px] text-gray-400 font-mono">XYZ</span>
      </div>
    </div>
  )
}
