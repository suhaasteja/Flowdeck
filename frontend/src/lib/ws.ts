// WebSocket client with exponential-backoff reconnect
// Delays: 1s → 2s → 4s → 8s → 16s → 30s (max)

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

    this.ws.onopen = () => {
      this.attempt = 0
      this.cb.onOpen()
    }

    this.ws.onmessage = (ev: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(ev.data) as WsMessage
        this.cb.onMessage(msg)
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
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg))
    }
  }

  close() {
    this.stopped = true
    if (this.retryTimer) clearTimeout(this.retryTimer)
    this.ws?.close()
  }
}
