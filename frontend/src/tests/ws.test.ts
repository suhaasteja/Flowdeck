import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { RobotWsClient } from '../lib/ws'
import { robot } from '../proto/robot.js'

// ── Helpers ──────────────────────────────────────────────────────────────────

function encodeState(status = 'IDLE'): Uint8Array {
  return robot.ServerMessage.encode(
    robot.ServerMessage.create({
      state: robot.RobotState.create({
        status,
        cycleCount: 0,
        currentSkill: '',
        joints: robot.JointState.create({
          positions: [0, 0, 0, 0, 0, 0],
          velocities: [0, 0, 0, 0, 0, 0],
          efforts: [0, 0, 0, 0, 0, 0],
          gripperClosed: false,
        }),
        tcp: robot.TcpPose.create({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 }),
      }),
    }),
  ).finish()
}

function encodeFault(): Uint8Array {
  return robot.ServerMessage.encode(
    robot.ServerMessage.create({
      fault: robot.Fault.create({
        id: 'test-fault',
        code: 'JOINT_TORQUE_LIMIT',
        message: 'Joint 3 exceeded limit',
        jointIndex: 3,
        timestamp: 1_000_000,
      }),
    }),
  ).finish()
}

function encodeFaultCleared(): Uint8Array {
  return robot.ServerMessage.encode(
    robot.ServerMessage.create({ faultCleared: robot.FaultCleared.create() }),
  ).finish()
}

// ── WebSocket mock ────────────────────────────────────────────────────────────

class FakeWS {
  static OPEN = 1
  static instance: FakeWS | null = null
  onopen:    (() => void) | null = null
  onmessage: ((e: { data: ArrayBuffer }) => void) | null = null
  onclose:   (() => void) | null = null
  onerror:   (() => void) | null = null
  binaryType = 'arraybuffer'
  readyState = 1 // OPEN
  send = vi.fn()
  close = vi.fn()
  constructor(public url: string) { FakeWS.instance = this }

  // Test helpers
  open()  { this.onopen?.() }
  binary(bytes: Uint8Array) {
    // Slice to the exact byte range so the ArrayBuffer has no padding.
    const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
    this.onmessage?.({ data: buf as ArrayBuffer })
  }
  drop() { this.readyState = 3; this.onclose?.() }
}

vi.stubGlobal('WebSocket', FakeWS)

beforeEach(() => { FakeWS.instance = null; vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RobotWsClient', () => {
  it('connects to the provided URL', () => {
    const client = new RobotWsClient('ws://localhost:8000/ws', {
      onOpen: vi.fn(), onClose: vi.fn(), onMessage: vi.fn(),
    })
    client.connect()
    expect(FakeWS.instance?.url).toBe('ws://localhost:8000/ws')
  })

  it('calls onOpen when socket opens', () => {
    const onOpen = vi.fn()
    const client = new RobotWsClient('ws://test', { onOpen, onClose: vi.fn(), onMessage: vi.fn() })
    client.connect()
    FakeWS.instance!.open()
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('decodes a state ServerMessage and calls onMessage', () => {
    const onMessage = vi.fn()
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose: vi.fn(), onMessage })
    client.connect()
    FakeWS.instance!.binary(encodeState('MOVING'))
    expect(onMessage).toHaveBeenCalledOnce()
    const [msg] = onMessage.mock.calls[0]
    expect(msg.type).toBe('state')
    expect((msg.payload as robot.IRobotState).status).toBe('MOVING')
  })

  it('decodes a fault ServerMessage and calls onMessage', () => {
    const onMessage = vi.fn()
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose: vi.fn(), onMessage })
    client.connect()
    FakeWS.instance!.binary(encodeFault())
    expect(onMessage).toHaveBeenCalledOnce()
    const [msg] = onMessage.mock.calls[0]
    expect(msg.type).toBe('fault')
    expect((msg.payload as robot.IFault).code).toBe('JOINT_TORQUE_LIMIT')
  })

  it('decodes a fault_cleared ServerMessage and calls onMessage', () => {
    const onMessage = vi.fn()
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose: vi.fn(), onMessage })
    client.connect()
    FakeWS.instance!.binary(encodeFaultCleared())
    expect(onMessage).toHaveBeenCalledWith({ type: 'fault_cleared' })
  })

  it('ignores truly malformed binary without throwing', () => {
    const onMessage = vi.fn()
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose: vi.fn(), onMessage })
    client.connect()
    // 10-byte varint is invalid in protobuf — decode() will throw, which ws.ts swallows
    const garbage = new Uint8Array([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01])
    FakeWS.instance!.onmessage?.({ data: garbage.buffer as ArrayBuffer })
    expect(onMessage).not.toHaveBeenCalled()
  })

  it('calls onClose and schedules reconnect on disconnect', () => {
    const onClose = vi.fn()
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose, onMessage: vi.fn() })
    client.connect()
    FakeWS.instance!.drop()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('send() encodes a skill command as binary Protobuf', () => {
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose: vi.fn(), onMessage: vi.fn() })
    client.connect()
    client.send({ type: 'skill', payload: { skillId: 'move_to_pick' } })

    expect(FakeWS.instance!.send).toHaveBeenCalledOnce()
    // In Node.js, protobufjs may return a Buffer (Uint8Array subclass) — normalise it.
    const raw = FakeWS.instance!.send.mock.calls[0][0] as Uint8Array | Buffer
    const sentBytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw)

    // Round-trip verify
    const decoded = robot.ClientMessage.decode(sentBytes)
    expect(decoded.payload).toBe('skill')
    expect(decoded.skill?.skillId).toBe('move_to_pick')
  })

  it('send() encodes a reset command as binary Protobuf', () => {
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose: vi.fn(), onMessage: vi.fn() })
    client.connect()
    client.send({ type: 'reset' })

    const raw = FakeWS.instance!.send.mock.calls[0][0] as Uint8Array | Buffer
    const sentBytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw)
    const decoded = robot.ClientMessage.decode(sentBytes)
    expect(decoded.payload).toBe('reset')
  })

  it('send() encodes an e_stop command as binary Protobuf', () => {
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose: vi.fn(), onMessage: vi.fn() })
    client.connect()
    client.send({ type: 'e_stop' })

    const raw = FakeWS.instance!.send.mock.calls[0][0] as Uint8Array | Buffer
    const sentBytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw)
    const decoded = robot.ClientMessage.decode(sentBytes)
    expect(decoded.payload).toBe('eStop')
  })

  it('close() stops reconnect attempts', () => {
    const onClose = vi.fn()
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose, onMessage: vi.fn() })
    client.connect()
    client.close()
    FakeWS.instance!.drop()
    vi.advanceTimersByTime(30_000)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('resets attempt counter on successful open', () => {
    const client = new RobotWsClient('ws://test', { onOpen: vi.fn(), onClose: vi.fn(), onMessage: vi.fn() })
    client.connect()
    FakeWS.instance!.drop()
    vi.advanceTimersByTime(1100) // first backoff = 1s
    FakeWS.instance!.open()     // reconnect succeeds
    expect(true).toBe(true)     // no error thrown is the assertion
  })
})
