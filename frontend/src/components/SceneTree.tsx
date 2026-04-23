import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface TreeNode {
  id: string
  label: string
  icon: string
  children?: TreeNode[]
  defaultOpen?: boolean
}

const SCENE_TREE: TreeNode[] = [
  {
    id: 'scene',
    label: 'Scene',
    icon: '📁',
    defaultOpen: true,
    children: [
      { id: 'workcell', label: 'workcell', icon: '📦' },
      {
        id: 'robot',
        label: 'robot',
        icon: '🤖',
        defaultOpen: true,
        children: [
          {
            id: 'flange',
            label: 'flange',
            icon: '🔗',
            defaultOpen: true,
            children: [
              {
                id: 'tool_mount',
                label: 'tool_0_frame_mount',
                icon: '⚙',
                children: [
                  { id: 'camera_mount', label: 'camera_mount', icon: '📷' },
                  { id: 'base_link',    label: 'base_link',    icon: '🔗' },
                ],
              },
              {
                id: 'flange_inner',
                label: 'flange',
                icon: '⚙',
                children: [
                  {
                    id: 'gripper',
                    label: 'robotiq_gripper',
                    icon: '🦾',
                    children: [
                      { id: 'tool', label: 'tool', icon: '⚙' },
                    ],
                  },
                ],
              },
            ],
          },
          { id: 'sensor', label: 'sensor', icon: '📡' },
          { id: 'led',    label: 'led',    icon: '💡' },
        ],
      },
    ],
  },
]

function TreeNodeRow({
  node,
  depth,
  selected,
  onSelect,
}: {
  node: TreeNode
  depth: number
  selected: string
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState(node.defaultOpen ?? false)
  const hasChildren = node.children && node.children.length > 0

  return (
    <>
      <div
        className={[
          'flex items-center gap-1 py-[3px] pr-3.5 text-[12px] cursor-pointer select-none',
          selected === node.id ? 'bg-bt-active-bg' : 'hover:bg-bt-block-bg',
        ].join(' ')}
        style={{ paddingLeft: `${14 + depth * 16}px` }}
        onClick={() => {
          onSelect(node.id)
          if (hasChildren) setOpen((o) => !o)
        }}
      >
        <span className="w-3 text-[9px] text-muted shrink-0">
          {hasChildren ? (open ? <ChevronDown size={9} /> : <ChevronRight size={9} />) : null}
        </span>
        <span className="text-[11px] mr-1">{node.icon}</span>
        <span className="truncate">{node.label}</span>
      </div>
      {open && node.children?.map((child) => (
        <TreeNodeRow
          key={child.id}
          node={child}
          depth={depth + 1}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

const ASSETS = [
  'Hardware Drivers',
  'Skills',
  'Scene Objects',
  'Services',
  'Products',
]

export function SceneTree() {
  const [selected, setSelected] = useState('robot')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Search */}
      <div className="px-3.5 py-2">
        <input
          type="text"
          placeholder="Search…"
          className="w-full px-2.5 py-1.5 border border-border rounded-[5px] text-[12px] outline-none focus:border-accent"
        />
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {SCENE_TREE.map((node) => (
          <TreeNodeRow
            key={node.id}
            node={node}
            depth={0}
            selected={selected}
            onSelect={setSelected}
          />
        ))}

        {/* Installed Assets section */}
        <div className="border-t border-border-subtle mt-2 pt-2 px-3.5 pb-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-fg uppercase tracking-wide py-1">
            <span>Installed Assets</span>
            <button className="text-accent font-medium normal-case tracking-normal">+ Install</button>
          </div>
          {ASSETS.map((a) => (
            <div key={a} className="flex items-center gap-2 py-[5px] text-[12px] cursor-pointer hover:bg-bt-block-bg rounded">
              <div className="w-4 h-4 bg-topbar-active rounded-[3px] shrink-0" />
              {a}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
