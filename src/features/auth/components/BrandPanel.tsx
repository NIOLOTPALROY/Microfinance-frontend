import { MoveUpRight } from 'lucide-react'
import BrandLogo from './BrandLogo'

function BrandPanel() {
  return (
    <section className="brand-panel" aria-label="DoorToDoor overview">
      <div className="brand-panel__glow brand-panel__glow--one" />
      <div className="brand-panel__glow brand-panel__glow--two" />
      <div className="brand-panel__content">
        <BrandLogo />

        <div className="brand-copy">
          <span className="eyebrow"><span className="status-dot" /> THE FIELD, REIMAGINED</span>
          <h1>Every move.<br />Made <span>meaningful.</span></h1>
          <p>One clear view of your operations, your team, and every doorstep in between.</p>
        </div>

        <div className="route-visual" aria-hidden="true">
          <div className="route-visual__grid" />
          <svg className="route-visual__map" viewBox="0 0 560 280" fill="none">
            <path className="map-line map-line--muted" d="M25 214 121 166 201 185 273 120 358 140 432 80 535 98" />
            <path className="map-line map-line--muted" d="M57 74 134 107 201 74 266 120 318 67 386 52 432 80 493 34" />
            <path className="map-line map-line--muted" d="m121 166 13-59 67-33 7 111 65-65 45 93 40-73 73-60 13 119" />
            <path className="map-line map-line--active" d="M25 214 121 166 201 185 273 120 358 140 432 80 535 98" />
            <circle className="map-point map-point--start" cx="25" cy="214" r="5" />
            <circle className="map-point map-point--end" cx="535" cy="98" r="5" />
            <circle className="map-pulse" cx="273" cy="120" r="12" />
            <circle className="map-point map-point--current" cx="273" cy="120" r="4" />
          </svg>
          <div className="route-card">
            <span className="route-card__icon"><MoveUpRight size={15} /></span>
            <span><strong>Route optimized</strong><small>Downtown · 12 stops</small></span>
            <span className="route-card__live">LIVE</span>
          </div>
          <div className="visual-caption"><span>40° 42' 46.8" N</span><span>74° 00' 21.2" W</span></div>
        </div>

        <div className="brand-footer">
          <span>BUILT FOR THE WAY YOU MOVE</span>
          <span className="brand-footer__line" />
          <span>01 — 03</span>
        </div>
      </div>
    </section>
  )
}

export default BrandPanel
