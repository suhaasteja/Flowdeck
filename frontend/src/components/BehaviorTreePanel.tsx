import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useRobotStore } from '../store/robotStore'
import { useSend } from '../App'

interface SkillBlock {
  id: string
  title: string
  sub: string
}

interface BTGroup {
  label: string
  blocks: SkillBlock[]
}

interface BTSection {
  id: string
  label: string
  groups?: BTGroup[]
  blocks?: SkillBlock[]
}

const TREE: BTSection[] = [
  {
    id: 'initialize',
    label: 'Initialize',
    blocks: [
      { id: 'estimate_update', title: 'estimate_and_update_…', sub: 'pc_estimate_and_update' },
      { id: 'set_drop_pose',   title: 'set drop pose',        sub: 'pc_update_world' },
    ],
  },
  {
    id: 'place_stock',
    label: 'Place stock in vice',
    groups: [
      {
        label: 'Pick stock',
        blocks: [
          { id: 'plan_grasp',   title: 'Plan grasp (pick)',        sub: 'pc_plan_grasp' },
          { id: 'move_to_pick', title: 'Move to pick',             sub: 'pc_move_robot' },
          { id: 'attach',       title: 'Attach object to gripper', sub: 'pc_attach_object_to_robot' },
          { id: 'wait',         title: 'Wait for 0.25s',           sub: 'pc_sleep_for' },
          { id: 'retract_pick', title: 'Retract (0.5m)',           sub: 'pc_move_robot' },
        ],
      },
    ],
  },
  {
    id: 'approach',
    label: 'Approach',
    blocks: [
      { id: 'approach_cnc', title: 'Approach CNC Machine', sub: 'pc_move_robot' },
      { id: 'align_stock',  title: 'Align stock in vice',  sub: 'pc_move_robot' },
    ],
  },
  {
    id: 'pre_insert',
    label: 'Pre-insert grasp',
    blocks: [
      { id: 'pre_insert',       title: 'Pre-insert',           sub: 'pc_move_robot' },
      { id: 'sensor_control',   title: 'Sensor-based control', sub: 'pc_move_to_contact' },
      { id: 'insert_contact',   title: 'Insert to contact',    sub: 'pc_move_to_contact' },
      { id: 'detach',           title: 'Detach object',        sub: 'pc_detach_object' },
      { id: 'retract_5cm',      title: 'Retract 5cm',          sub: 'pc_move_robot' },
      { id: 'move_idle',        title: 'Move idle',            sub: 'pc_move_robot' },
    ],
  },
]

function Block({ block, active, onClick }: { block: SkillBlock; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left rounded-[5px] border px-2.5 py-[7px] text-[11px] cursor-pointer transition-all relative overflow-hidden',
        active
          ? 'bg-accent border-accent text-white shadow-sm'
          : 'bg-bt-block-bg border-bt-block-border hover:bg-bt-block-hover-bg hover:border-accent-border',
      ].join(' ')}
    >
      {/* Pulsing left accent bar when active */}
      {active && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-white/40 animate-pulse rounded-l-[4px]" />
      )}
      <div className={`font-medium ${active ? 'text-white' : 'text-[#1a1a1a]'}`}>
        {active ? '▶' : '▸'} {block.title}
      </div>
      <div className={`font-mono text-[10px] mt-0.5 ${active ? 'text-white/70' : 'text-muted'}`}>
        {block.sub}
      </div>
    </button>
  )
}

function CollapsibleSection({ section, activeSkillId, onBlockClick }: {
  section: BTSection
  activeSkillId: string | null
  onBlockClick: (id: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-border-subtle py-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] text-muted font-medium hover:text-[#1a1a1a] transition-colors"
      >
        {open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        {section.label}
      </button>

      {open && (
        <>
          {/* Flat blocks */}
          {section.blocks && (
            <div className="px-3.5 flex flex-col gap-1">
              {section.blocks.map((block) => (
                <Block
                  key={block.id}
                  block={block}
                  active={activeSkillId === block.id}
                  onClick={() => onBlockClick(block.id)}
                />
              ))}
            </div>
          )}

          {/* Groups */}
          {section.groups?.map((group) => (
            <CollapsibleGroup key={group.label} group={group} activeSkillId={activeSkillId} onBlockClick={onBlockClick} />
          ))}
        </>
      )}
    </div>
  )
}

function CollapsibleGroup({ group, activeSkillId, onBlockClick }: {
  group: BTGroup
  activeSkillId: string | null
  onBlockClick: (id: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="px-3.5 mt-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-1.5 text-[12px] font-medium py-1 hover:text-accent transition-colors"
      >
        {open ? <ChevronDown size={9} className="text-muted" /> : <ChevronRight size={9} className="text-muted" />}
        {group.label}
      </button>
      {open && (
        <div className="ml-3.5 flex flex-col gap-1">
          {group.blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              active={activeSkillId === block.id}
              onClick={() => onBlockClick(block.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function BehaviorTreePanel() {
  // currentSkill comes from the backend state stream — it's the authoritative active block
  const currentSkill = useRobotStore((s) => s.robot.currentSkill)
  const robotStatus  = useRobotStore((s) => s.robot.status)
  const connection   = useRobotStore((s) => s.connection)
  const send = useSend()

  function handleClick(id: string) {
    if (connection !== 'connected') return
    // Send skill command; backend starts trajectory and echoes currentSkill back in state stream
    send({ type: 'skill', payload: { skillId: id } })
  }

  const moving = robotStatus === 'MOVING'

  return (
    <aside className="w-[260px] bg-surface border-r border-border flex flex-col overflow-hidden shrink-0">
      <div className="px-3.5 py-2.5 border-b border-border-subtle flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-fg uppercase tracking-wide">
          Behavior Tree
        </span>
        {moving && (
          <span className="text-[10px] text-status-amber font-mono animate-pulse">MOVING</span>
        )}
      </div>

      <div className={`flex-1 overflow-y-auto scrollbar-thin ${moving ? 'opacity-80' : ''}`}>
        {TREE.map((section) => (
          <CollapsibleSection
            key={section.id}
            section={section}
            activeSkillId={currentSkill}
            onBlockClick={handleClick}
          />
        ))}
      </div>
    </aside>
  )
}
