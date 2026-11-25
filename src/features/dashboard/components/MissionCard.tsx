import { ArrowRight, Leaf } from 'lucide-react'

type MissionCardProps = {
  onOpenMission: () => void
}

function MissionCard({ onOpenMission }: MissionCardProps) {
  return (
    <article className="mission-card">
      <div className="mission-card__sun" />
      <div className="mission-card__leaves" aria-hidden="true"><Leaf size={52} /><Leaf size={34} /></div>
      <div className="mission-card__coins" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="mission-card__copy">
        <strong>Grow Together</strong>
        <strong>Prosper Together</strong>
        <button type="button" onClick={onOpenMission}>Our Mission <ArrowRight size={15} /></button>
      </div>
    </article>
  )
}

export default MissionCard
