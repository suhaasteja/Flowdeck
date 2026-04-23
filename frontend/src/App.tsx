import { createContext, useContext } from 'react'
import { TopBar } from './components/TopBar'
import { BehaviorTreePanel } from './components/BehaviorTreePanel'
import { Viewer3D } from './components/Viewer3D'
import { RightPanel } from './components/RightPanel'
import { ConnectionBanner } from './components/ConnectionBanner'
import { FaultPanel } from './components/FaultPanel'
import { useRobotStream } from './hooks/useRobotStream'
import type { WsMessage } from './lib/ws'

// Shared send function so any component can dispatch commands to the backend
const SendContext = createContext<(msg: WsMessage) => void>(() => {})
export const useSend = () => useContext(SendContext)

export default function App() {
  const { send } = useRobotStream()

  return (
    <SendContext.Provider value={send}>
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar />
        <div className="flex flex-1 overflow-hidden relative">
          <BehaviorTreePanel />
          <Viewer3D />
          <RightPanel />
          <ConnectionBanner />
          <FaultPanel />
        </div>
      </div>
    </SendContext.Provider>
  )
}
