import { create } from 'zustand'

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'
export type RobotStatus = 'IDLE' | 'MOVING' | 'FAULTED' | 'E_STOP'

export interface JointState {
  positions: number[]   // 6 joint angles in radians
  velocities: number[]
  efforts: number[]
  gripperClosed: boolean
}

export interface TcpPose {
  x: number; y: number; z: number
  rx: number; ry: number; rz: number
}

export interface Fault {
  id: string
  code: string
  message: string
  jointIndex: number
  timestamp: number
}

export interface RobotState {
  joints: JointState
  tcp: TcpPose
  status: RobotStatus
  cycleCount: number
  currentSkill: string
}

interface RobotStore {
  connection: ConnectionStatus
  robot: RobotState
  fault: Fault | null
  lastUpdateMs: number

  setConnection: (s: ConnectionStatus) => void
  setRobotState: (s: RobotState) => void
  setFault: (f: Fault | null) => void
}

// Visual home pose — matches the HTML reference (what goes directly into Three.js rotations)
const DEFAULT_JOINTS: JointState = {
  positions: [-0.3, -0.8, 1.4, -0.6, 0.3, 0],
  velocities: [0, 0, 0, 0, 0, 0],
  efforts: [0, 0, 0, 0, 0, 0],
  gripperClosed: false,
}

const DEFAULT_TCP: TcpPose = { x: 0, y: 0.5, z: 0.3, rx: 0, ry: 0, rz: 0 }

const DEFAULT_ROBOT: RobotState = {
  joints: DEFAULT_JOINTS,
  tcp: DEFAULT_TCP,
  status: 'IDLE',
  cycleCount: 0,
  currentSkill: '',
}

export const useRobotStore = create<RobotStore>((set) => ({
  connection: 'disconnected',
  robot: DEFAULT_ROBOT,
  fault: null,
  lastUpdateMs: 0,

  setConnection: (connection) => set({ connection }),
  setRobotState: (robot) => set({ robot, lastUpdateMs: Date.now() }),
  setFault: (fault) => set({ fault }),
}))
