import { ArrowRight, Building2 } from 'lucide-react'
import { dashboardBranches } from '../data/demoDashboardData'

type BranchPerformanceProps = {
  onViewDetails: () => void
}

function BranchPerformance({ onViewDetails }: BranchPerformanceProps) {
  const maxAmount = Math.max(...dashboardBranches.map(({ amount }) => amount))

  return (
    <article className="overview-card branch-card" id="branch-performance">
      <div className="overview-card__heading">
        <h2><Building2 size={19} /> Branch Performance</h2>
        <button className="text-link" type="button" onClick={onViewDetails}>View Details <ArrowRight size={14} /></button>
      </div>
      <div className="branch-chart" role="img" aria-label="Branch performance chart in lakhs">
        {dashboardBranches.map(({ name, amount, color }) => (
          <div className="branch-column" key={name}>
            <strong>₹{amount}L</strong>
            <span
              className={`branch-column__bar branch-column__bar--${color}`}
              style={{ height: `${(amount / maxAmount) * 78}%` }}
            />
            <small>{name}</small>
          </div>
        ))}
      </div>
    </article>
  )
}

export default BranchPerformance
