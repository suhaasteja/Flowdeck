import { Settings, Bell, Clock } from 'lucide-react'
import { useRobotStore, type ConnectionStatus } from '../store/robotStore'

function StatusPill({ status }: { status: ConnectionStatus }) {
  const dotColor =
    status === 'connected' ? 'bg-status-green' :
    status === 'connecting' ? 'bg-status-amber' :
    'bg-gray-400'

  const label =
    status === 'connected' ? 'Executing on Simulation' :
    status === 'connecting' ? 'Reconnecting…' :
    'Disconnected'

  return (
    <div className="flex items-center gap-2 bg-topbar-active rounded-full px-4 py-1 text-[12px]">
      <span className={`w-2 h-2 rounded-full ${dotColor} ${status === 'connecting' ? 'animate-pulse' : ''}`} />
      <span className="text-gray-600">Executing on</span>
      <strong className="text-gray-900">{status === 'connected' ? 'Simulation ▾' : label}</strong>
    </div>
  )
}

export function TopBar() {
  const connection = useRobotStore((s) => s.connection)

  return (
    <header className="h-11 bg-surface border-b border-border flex items-center px-4 gap-4 shrink-0 z-20">
      {/* Left: title + tabs */}
      <div className="flex items-center gap-6">
        <span className="font-semibold text-[13px]">Flowdeck</span>
        <nav className="flex gap-1">
          <button className="px-3.5 py-1.5 rounded-md bg-topbar-active text-[12px] font-medium">
            Build
          </button>
          <button className="px-3.5 py-1.5 rounded-md text-[12px] text-gray-500 hover:bg-topbar-active transition-colors">
            Execute
          </button>
        </nav>
      </div>

      {/* Center: status pill */}
      <div className="flex-1 flex justify-center">
        <StatusPill status={connection} />
      </div>

      {/* Right: icon stubs */}
      <div className="flex items-center gap-1">
        <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-topbar-active transition-colors">
          <Clock size={14} />
        </button>
        <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-topbar-active transition-colors">
          <Bell size={14} />
        </button>
        <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-topbar-active transition-colors">
          <Settings size={14} />
        </button>
      </div>
    </header>
  )
}
