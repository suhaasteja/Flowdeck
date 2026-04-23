import { useEffect, useRef, useState } from 'react'
import { X, Bot } from 'lucide-react'
import type { Fault } from '../store/robotStore'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

type Phase = 'loading' | 'streaming' | 'done' | 'error'

function SkeletonRow({ width }: { width: string }) {
  return <div className={`h-3 bg-gray-100 rounded animate-pulse ${width}`} />
}

function MarkdownLine({ line }: { line: string }) {
  if (line.startsWith('## ')) {
    return <h3 className="text-[12px] font-semibold text-[#1a1a1a] mt-3 mb-1">{line.slice(3)}</h3>
  }
  if (line.startsWith('- ')) {
    return (
      <div className="flex gap-2 text-[12px] text-[#333] leading-relaxed">
        <span className="text-accent shrink-0">•</span>
        <span dangerouslySetInnerHTML={{ __html: boldify(line.slice(2)) }} />
      </div>
    )
  }
  if (line.startsWith('**') && line.endsWith('**')) {
    return <p className="text-[12px] font-semibold text-[#1a1a1a] mt-1">{line.slice(2, -2)}</p>
  }
  if (line.trim() === '') return <div className="h-1" />
  return <p className="text-[12px] text-[#333] leading-relaxed" dangerouslySetInnerHTML={{ __html: boldify(line) }} />
}

function boldify(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

export function DiagnosisModal({ fault, onClose }: { fault: Fault; onClose: () => void }) {
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<Phase>('loading')
  const abortRef = useRef<AbortController | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    abortRef.current = ctrl

    async function run() {
      try {
        const res = await fetch(`${API_BASE}/diagnose`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fault, recentStates: [] }),
          signal: ctrl.signal,
        })

        if (!res.ok || !res.body) {
          setPhase('error')
          return
        }

        setPhase('streaming')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') { setPhase('done'); return }
            try {
              const { chunk } = JSON.parse(data) as { chunk: string }
              setText((prev) => prev + chunk)
            } catch { /* ignore malformed chunk */ }
          }
        }
        setPhase('done')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setPhase('error')
      }
    }

    void run()
    return () => ctrl.abort()
  }, [fault])

  // Auto-scroll to bottom as text streams in
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [text])

  const lines = text.split('\n')

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl shadow-2xl w-[560px] max-h-[80vh] flex flex-col border border-border overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border shrink-0">
          <Bot size={15} className="text-accent" />
          <div className="flex-1">
            <div className="text-[13px] font-semibold">AI Fault Diagnosis</div>
            <div className="font-mono text-[10px] text-status-red">{fault.code}</div>
          </div>
          {phase === 'streaming' && (
            <span className="text-[10px] text-accent animate-pulse font-mono">Analysing…</span>
          )}
          {phase === 'done' && (
            <span className="text-[10px] text-status-green font-mono">Done</span>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:bg-topbar-active transition-colors ml-1"
          >
            <X size={13} />
          </button>
        </div>

        {/* Fault summary */}
        <div className="px-5 py-2.5 bg-status-red/5 border-b border-border-subtle shrink-0">
          <p className="text-[11px] text-[#444]">{fault.message}</p>
          {fault.jointIndex >= 0 && (
            <p className="text-[10px] text-muted mt-0.5 font-mono">Affected: Joint {fault.jointIndex}</p>
          )}
        </div>

        {/* Body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
          {phase === 'loading' && (
            <div className="flex flex-col gap-3">
              <SkeletonRow width="w-1/3" />
              <SkeletonRow width="w-full" />
              <SkeletonRow width="w-4/5" />
              <SkeletonRow width="w-3/4" />
              <div className="mt-2" />
              <SkeletonRow width="w-1/3" />
              <SkeletonRow width="w-full" />
              <SkeletonRow width="w-5/6" />
            </div>
          )}

          {(phase === 'streaming' || phase === 'done') && (
            <div className="flex flex-col gap-0.5">
              {lines.map((line, i) => (
                <MarkdownLine key={i} line={line} />
              ))}
              {phase === 'streaming' && (
                <span className="inline-block w-1.5 h-3.5 bg-accent animate-pulse rounded-sm ml-0.5" />
              )}
            </div>
          )}

          {phase === 'error' && (
            <p className="text-[12px] text-status-red">
              Failed to reach the backend. Make sure the server is running and ANTHROPIC_API_KEY is set.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-topbar-active text-[12px] hover:bg-border transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
