// WebSocket client with exponential-backoff reconnect
// Delays: 1s → 2s → 4s → 8s → 16s → 30s (max)
//
// Wire format: Protobuf binary frames (ServerMessage / ClientMessage).
// The internal WsMessage type is the same discriminated shape as before —
// all encoding/decoding is contained in this module.

import { robot } from '../proto/robot.js'

export type WsMessage = Record<string, unknown>

export type WsCallbacks = {
  onMessage: (msg: WsMessage) => void
  onOpen: () => void
  onClose: () => void
}

export class RobotWsClient {
  private ws: WebSocket | null = null
  private attempt = 0
  private stopped = false
  private retryTimer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly url: string, private readonly cb: WsCallbacks) {}

  connect() {
    if (this.stopped) return
    this.ws = new WebSocket(this.url)
    this.ws.binaryType = 'arraybuffer'

    this.ws.onopen = () => {
      this.attempt = 0
      this.cb.onOpen()
    }

    this.ws.onmessage = (ev: MessageEvent<ArrayBuffer>) => {
      try {
        const bytes = new Uint8Array(ev.data)
        const decoded = robot.ServerMessage.decode(bytes)

        switch (decoded.payload) {
          case 'state':
            this.cb.onMessage({ type: 'state', payload: decoded.state })
            break
          case 'fault':
            this.cb.onMessage({ type: 'fault', payload: decoded.fault })
            break
          case 'faultCleared':
            this.cb.onMessage({ type: 'fault_cleared' })
            break
          // unknown payload — ignore
        }
      } catch {
        // malformed frame — ignore
      }
    }

    this.ws.onclose = () => {
      if (this.stopped) return
      this.cb.onClose()
      const delay = Math.min(1000 * 2 ** this.attempt, 30_000)
      this.attempt++
      this.retryTimer = setTimeout(() => this.connect(), delay)
    }

    this.ws.onerror = () => {
      // onclose fires right after onerror — let onclose handle reconnect
    }
  }

  send(msg: WsMessage) {
    if (this.ws?.readyState !== WebSocket.OPEN) return

    const type = msg['type'] as string
    let props: robot.IClientMessage

    if (type === 'skill') {
      const payload = msg['payload'] as { skillId: string }
      props = { skill: { skillId: payload.skillId } }
    } else if (type === 'e_stop') {
      props = { eStop: {} }
    } else {
      // 'reset' and any other client messages
      props = { reset: {} }
    }

    const bytes = robot.ClientMessage.encode(
      robot.ClientMessage.create(props)
    ).finish()
    this.ws.send(bytes)
  }

  close() {
    this.stopped = true
    if (this.retryTimer) clearTimeout(this.retryTimer)
    this.ws?.close()
  }
}
