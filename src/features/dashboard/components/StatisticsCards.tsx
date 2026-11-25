import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { dashboardMetrics } from '../data/demoDashboardData'

function Sparkline({ points }: { points: string }) {
  return (
    <svg className="metric-sparkline" viewBox="0 0 100 38" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points} fill="none" stroke="rgba(255,255,255,.82)" strokeWidth="2" />
      <path d={`M ${points.replaceAll(' ', ' L ')} L 100 38 L 0 38 Z`} fill="rgba(255,255,255,.12)" />
    </svg>
  )
}

function StatisticsCards() {
  return (
    <section className="micro-metrics" aria-label="Key performance indicators">
      {dashboardMetrics.map(({ title, value, change, direction, icon: Icon, tone, sparkline }) => (
        <article className={`micro-metric micro-metric--${tone}`} key={title}>
          <span className="micro-metric__icon"><Icon size={34} strokeWidth={2.2} /></span>
          <div className="micro-metric__content">
            <strong>{value}</strong>
            <span>{title}</span>
          </div>
          <span className="micro-metric__change">
            {direction === 'up' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
            {change}
          </span>
          <Sparkline points={sparkline} />
        </article>
      ))}
    </section>
  )
}

export default StatisticsCards
