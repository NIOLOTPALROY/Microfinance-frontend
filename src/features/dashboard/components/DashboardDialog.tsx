import { useEffect, useRef } from 'react'
import { ArrowRight, X } from 'lucide-react'
import type { DashboardNotice } from '../types'

type DashboardDialogProps = {
  notice: DashboardNotice
  onClose: () => void
}

function DashboardDialog({ notice, onClose }: DashboardDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="dashboard-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="dashboard-dialog" role="dialog" aria-modal="true" aria-labelledby="dashboard-dialog-title">
        <button className="dashboard-dialog__close" type="button" onClick={onClose} ref={closeButtonRef} aria-label="Close dialog">
          <X size={18} />
        </button>
        <span className="dashboard-dialog__eyebrow">DOORTODOOR MICROFOUNDATION</span>
        <h2 id="dashboard-dialog-title">{notice.title}</h2>
        <p>{notice.description}</p>
        {notice.items && notice.items.length > 0 && (
          <ul className="dashboard-dialog__items">
            {notice.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}
        <button className="dashboard-dialog__done" type="button" onClick={onClose}>Got it <ArrowRight size={15} /></button>
      </section>
    </div>
  )
}

export default DashboardDialog
