import { useState } from 'react'
import { SceneTree } from './SceneTree'
import { TelemetryPanel } from './TelemetryPanel'

type Tab = 'scene' | 'telemetry'

export function RightPanel() {
  const [tab, setTab] = useState<Tab>('scene')

  return (
    <aside className="w-[280px] bg-surface border-l border-border flex flex-col overflow-hidden shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        {(['scene', 'telemetry'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex-1 py-2.5 text-[12px] text-center capitalize transition-colors',
              tab === t
                ? 'text-[#1a1a1a] font-medium border-b-2 border-[#1a1a1a] -mb-px'
                : 'text-muted hover:text-[#1a1a1a]',
            ].join(' ')}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {tab === 'scene' ? <SceneTree /> : <TelemetryPanel />}
      </div>
    </aside>
  )
}
