import { ArrowRight, BarChart3, Calculator, FileText, UserPlus, Zap } from 'lucide-react'
import type { DashboardAction } from '../types'

const actions = [
  { label: 'Add Member', icon: UserPlus, tone: 'blue', description: 'Member registration is not connected in this demo.' },
  { label: 'Apply Loan', icon: FileText, tone: 'green', description: 'Loan applications are not connected in this demo.' },
  { label: 'EMI Calculator', icon: Calculator, tone: 'orange', description: 'The EMI calculator is not connected in this demo.' },
  { label: 'View Reports', icon: BarChart3, tone: 'purple', description: 'Reports are not connected in this demo.' },
]

type QuickActionsProps = {
  onAction: DashboardAction
}

function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <article className="overview-card quick-card">
      <div className="overview-card__heading"><h2><Zap className="quick-bolt" size={19} /> Quick Actions</h2></div>
      <div className="quick-grid">
        {actions.map(({ label, icon: Icon, tone, description }) => (
          <button
            type="button"
            className={`quick-action quick-action--${tone}`}
            key={label}
            onClick={() => onAction({ title: label, description })}
          >
            <Icon size={29} strokeWidth={2.4} />
            <strong>{label}</strong>
            <ArrowRight className="quick-action__arrow" size={15} />
          </button>
        ))}
      </div>
    </article>
  )
}

export default QuickActions
