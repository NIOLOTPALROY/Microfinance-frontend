import { Clock3, ShieldCheck } from 'lucide-react'

type DashboardFooterProps = {
  lastLoginAt: Date | null
}

function DashboardFooter({ lastLoginAt }: DashboardFooterProps) {
  const formattedLogin = lastLoginAt ? new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(lastLoginAt)
    : 'Unavailable'

  return (
    <footer className="micro-footer">
      <span><ShieldCheck size={15} /> RBI Registered NBFC-MFI</span>
      <i />
      <span>DoorToDoor MicroFoundation Pvt. Ltd.</span>
      <span className="micro-footer__spacer" />
      <span><Clock3 size={15} /> Last Login: {formattedLogin}</span>
      <span className="system-online"><i /> System Online</span>
    </footer>
  )
}

export default DashboardFooter
