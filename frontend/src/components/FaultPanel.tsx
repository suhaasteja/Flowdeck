import { useState } from 'react'
import { AlertTriangle, X, Zap, RotateCcw } from 'lucide-react'
import { useRobotStore, type Fault } from '../store/robotStore'
import { useSend } from '../App'
import { DiagnosisModal } from './DiagnosisModal'

function FaultDetails({ fault, onDiagnose, onReset }: {
  fault: Fault
  onDiagnose: () => void
  onReset: () => void
}) {
  const ts = new Date(fault.timestamp * 1000).toLocaleTimeString()
  const jointLabel = fault.jointIndex >= 0
    ? `Joint ${fault.jointIndex}`
    : 'System'

  return (
    <div className="flex items-start gap-3 flex-1">
      <AlertTriangle size={16} className="text-status-red shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-mono text-[12px] font-semibold text-status-red">{fault.code}</span>
          <span className="text-[10px] text-muted">{jointLabel}</span>
          <span className="text-[10px] text-muted ml-auto">{ts}</span>
        </div>
        <p className="text-[11px] text-[#1a1a1a] leading-snug truncate">{fault.message}</p>
      </div>

      <div className="flex gap-2 shrink-0 ml-2">
        <button
          onClick={onDiagnose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-white text-[11px] font-medium hover:bg-accent/90 transition-colors"
        >
          <Zap size={11} />
          Diagnose
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface border border-border text-[11px] hover:bg-topbar-active transition-colors"
        >
          <RotateCcw size={11} />
          Acknowledge &amp; Reset
        </button>
      </div>
    </div>
  )
}

export function FaultPanel() {
  const fault = useRobotStore((s) => s.fault)
  const setFault = useRobotStore((s) => s.setFault)
  const send = useSend()
  const [showDiagnosis, setShowDiagnosis] = useState(false)
  const [diagnosisFault, setDiagnosisFault] = useState<Fault | null>(null)

  function handleDiagnose() {
    if (!fault) return
    setDiagnosisFault(fault)
    setShowDiagnosis(true)
  }

  function handleReset() {
    send({ type: 'reset' })
    setFault(null)
  }

  function handleDismissFault() {
    setFault(null)
  }

  return (
    <>
      {/* Fault panel — slides up from bottom */}
      <div
        className={[
          'absolute bottom-0 left-0 right-0 z-20 transition-transform duration-300 ease-out',
          fault ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        <div className="bg-white border-t-2 border-status-red shadow-lg px-4 py-3 flex items-center gap-2">
          {fault ? (
            <FaultDetails fault={fault} onDiagnose={handleDiagnose} onReset={handleReset} />
          ) : null}

          <button
            onClick={handleDismissFault}
            className="shrink-0 w-6 h-6 rounded flex items-center justify-center text-muted hover:bg-topbar-active transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Diagnosis modal */}
      {showDiagnosis && diagnosisFault && (
        <DiagnosisModal
          fault={diagnosisFault}
          onClose={() => setShowDiagnosis(false)}
        />
      )}
    </>
  )
}
