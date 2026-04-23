import { describe, it, expect, beforeEach } from 'vitest'
import { useRobotStore } from '../store/robotStore'
import type { Fault, RobotState } from '../store/robotStore'

const DEFAULT_STATE = {
  connection: 'disconnected' as const,
  fault: null,
  lastUpdateMs: 0,
}

const MOCK_FAULT: Fault = {
  id: 'test-1',
  code: 'JOINT_TORQUE_LIMIT',
  message: 'Joint 3 exceeded 50 Nm',
  jointIndex: 3,
  timestamp: 1234567890,
}

const MOCK_ROBOT_STATE: RobotState = {
  joints: {
    positions: [0.1, -0.8, 1.4, -0.5, 0.3, 0.0],
    velocities: [0, 0, 0, 0, 0, 0],
    efforts: [0, 0, 0, 0, 0, 0],
    gripperClosed: true,
  },
  tcp: { x: 0.3, y: 0.5, z: 0.1, rx: 0, ry: 0, rz: 0 },
  status: 'MOVING',
  cycleCount: 7,
  currentSkill: 'move_to_pick',
}

beforeEach(() => {
  useRobotStore.setState(DEFAULT_STATE, false)
})

describe('connection state', () => {
  it('starts as disconnected', () => {
    expect(useRobotStore.getState().connection).toBe('disconnected')
  })

  it('setConnection transitions to connected', () => {
    useRobotStore.getState().setConnection('connected')
    expect(useRobotStore.getState().connection).toBe('connected')
  })

  it('setConnection transitions to connecting', () => {
    useRobotStore.getState().setConnection('connecting')
    expect(useRobotStore.getState().connection).toBe('connecting')
  })
})

describe('fault state', () => {
  it('starts with no fault', () => {
    expect(useRobotStore.getState().fault).toBeNull()
  })

  it('setFault stores the fault', () => {
    useRobotStore.getState().setFault(MOCK_FAULT)
    expect(useRobotStore.getState().fault).toEqual(MOCK_FAULT)
  })

  it('setFault(null) clears the fault', () => {
    useRobotStore.getState().setFault(MOCK_FAULT)
    useRobotStore.getState().setFault(null)
    expect(useRobotStore.getState().fault).toBeNull()
  })

  it('fault stores correct jointIndex', () => {
    useRobotStore.getState().setFault(MOCK_FAULT)
    expect(useRobotStore.getState().fault?.jointIndex).toBe(3)
  })
})

describe('robot state', () => {
  it('setRobotState updates status', () => {
    useRobotStore.getState().setRobotState(MOCK_ROBOT_STATE)
    expect(useRobotStore.getState().robot.status).toBe('MOVING')
  })

  it('setRobotState updates joint positions', () => {
    useRobotStore.getState().setRobotState(MOCK_ROBOT_STATE)
    expect(useRobotStore.getState().robot.joints.positions[0]).toBeCloseTo(0.1)
  })

  it('setRobotState updates currentSkill', () => {
    useRobotStore.getState().setRobotState(MOCK_ROBOT_STATE)
    expect(useRobotStore.getState().robot.currentSkill).toBe('move_to_pick')
  })

  it('setRobotState updates cycleCount', () => {
    useRobotStore.getState().setRobotState(MOCK_ROBOT_STATE)
    expect(useRobotStore.getState().robot.cycleCount).toBe(7)
  })

  it('setRobotState records lastUpdateMs', () => {
    const before = Date.now()
    useRobotStore.getState().setRobotState(MOCK_ROBOT_STATE)
    expect(useRobotStore.getState().lastUpdateMs).toBeGreaterThanOrEqual(before)
  })

  it('setRobotState tracks gripper state', () => {
    useRobotStore.getState().setRobotState(MOCK_ROBOT_STATE)
    expect(useRobotStore.getState().robot.joints.gripperClosed).toBe(true)
  })
})
