import { WifiOff } from 'lucide-react'
import { useRobotStore } from '../store/robotStore'

export function ConnectionBanner() {
  const connection = useRobotStore((s) => s.connection)

  if (connection === 'connected') return null

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-2 bg-status-amber/10 border-t border-status-amber/30 py-2 px-4 text-[12px]">
      <WifiOff size={13} className="text-status-amber shrink-0" />
      <span className="text-[#7a5a00]">
        {connection === 'connecting'
          ? 'Reconnecting to robot… last known state shown'
          : 'No robot connection — start the backend to connect'}
      </span>
    </div>
  )
}
