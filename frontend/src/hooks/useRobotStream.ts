import { useEffect, useRef } from 'react'
import { RobotWsClient, type WsMessage } from '../lib/ws'
import { useRobotStore, type RobotState, type Fault } from '../store/robotStore'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws'

function handleMessage(msg: WsMessage) {
  const { setRobotState, setFault } = useRobotStore.getState()

  if (msg.type === 'state') {
    setRobotState(msg.payload as RobotState)
  } else if (msg.type === 'fault') {
    setFault(msg.payload as Fault)
  } else if (msg.type === 'fault_cleared') {
    setFault(null)
  }
}

export function useRobotStream() {
  const clientRef = useRef<RobotWsClient | null>(null)
  const { setConnection } = useRobotStore.getState()

  useEffect(() => {
    const client = new RobotWsClient(WS_URL, {
      onOpen:    () => setConnection('connected'),
      onClose:   () => setConnection('connecting'),
      onMessage: handleMessage,
    })

    clientRef.current = client
    setConnection('connecting')
    client.connect()

    return () => {
      client.close()
      setConnection('disconnected')
    }
  }, [setConnection])

  // Expose send so components can dispatch commands
  return {
    send: (msg: WsMessage) => clientRef.current?.send(msg),
  }
}
