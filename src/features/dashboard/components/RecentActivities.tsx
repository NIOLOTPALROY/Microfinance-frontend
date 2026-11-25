import { Activity, ArrowRight } from 'lucide-react'
import { dashboardActivities } from '../data/demoDashboardData'

type RecentActivitiesProps = {
  onViewAll: () => void
}

function RecentActivities({ onViewAll }: RecentActivitiesProps) {
  return (
    <article className="overview-card activities-card" id="recent-activities">
      <div className="overview-card__heading">
        <h2><Activity className="activity-bell" size={20} /> Recent Activities</h2>
        <button className="text-link" type="button" onClick={onViewAll}>View All <ArrowRight size={14} /></button>
      </div>
      <div className="activity-list">
        {dashboardActivities.map(({ icon: Icon, tone, title, detail, tag }) => (
          <div className="activity-row" key={title}>
            <span className={`activity-row__icon activity-row__icon--${tone}`}><Icon size={16} /></span>
            <span className="activity-row__copy"><strong>{title}</strong><small>{detail}</small></span>
            <span className={`activity-tag activity-tag--${tone}`}>{tag}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

export default RecentActivities
