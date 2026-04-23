import { useRobotStore } from '../store/robotStore'

function rad2deg(r: number) {
  return ((r * 180) / Math.PI).toFixed(1)
}

function fmt(n: number, decimals = 3) {
  return n.toFixed(decimals)
}

const JOINT_NAMES = ['Base', 'Shoulder', 'Elbow', 'Wrist 1', 'Wrist 2', 'Wrist 3']

export function TelemetryPanel() {
  const robot = useRobotStore((s) => s.robot)
  const connection = useRobotStore((s) => s.connection)

  const stale = connection !== 'connected'

  return (
    <div className={`flex flex-col flex-1 overflow-y-auto scrollbar-thin px-3.5 py-2 gap-3 ${stale ? 'opacity-60' : ''}`}>
      {/* Status */}
      <div>
        <div className="text-[10px] font-semibold text-muted-fg uppercase tracking-wide mb-1">Status</div>
        <div className="flex gap-3 font-mono text-[12px]">
          <span
            className={
              robot.status === 'MOVING'  ? 'text-status-amber' :
              robot.status === 'FAULTED' ? 'text-status-red' :
              robot.status === 'E_STOP'  ? 'text-status-red' :
              'text-status-green'
            }
          >
            {robot.status}
          </span>
          <span className="text-muted">cycle #{robot.cycleCount}</span>
        </div>
        {robot.currentSkill && (
          <div className="font-mono text-[11px] text-muted mt-0.5 truncate">{robot.currentSkill}</div>
        )}
      </div>

      {/* Joint angles */}
      <div>
        <div className="text-[10px] font-semibold text-muted-fg uppercase tracking-wide mb-1">Joints (rad / °)</div>
        <div className="flex flex-col gap-[3px]">
          {JOINT_NAMES.map((name, i) => {
            const pos = robot.joints.positions[i] ?? 0
            return (
              <div key={name} className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-muted w-16 shrink-0">{name}</span>
                <span className="text-[#1a1a1a]">{fmt(pos)}</span>
                <span className="text-muted ml-2">{rad2deg(pos)}°</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* TCP Pose */}
      <div>
        <div className="text-[10px] font-semibold text-muted-fg uppercase tracking-wide mb-1">TCP Pose</div>
        <div className="flex flex-col gap-[3px] font-mono text-[11px]">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis} className="flex items-center justify-between">
              <span className="text-muted uppercase w-5">{axis}</span>
              <span>{fmt(robot.tcp[axis])} m</span>
            </div>
          ))}
          {(['rx', 'ry', 'rz'] as const).map((axis) => (
            <div key={axis} className="flex items-center justify-between">
              <span className="text-muted uppercase w-5">{axis}</span>
              <span>{fmt(robot.tcp[axis])} rad</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gripper */}
      <div>
        <div className="text-[10px] font-semibold text-muted-fg uppercase tracking-wide mb-1">Gripper</div>
        <span className={`font-mono text-[12px] ${robot.joints.gripperClosed ? 'text-status-amber' : 'text-status-green'}`}>
          {robot.joints.gripperClosed ? 'CLOSED' : 'OPEN'}
        </span>
      </div>
    </div>
  )
}
