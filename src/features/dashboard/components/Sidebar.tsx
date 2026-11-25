import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, HandCoins, X } from 'lucide-react'
import { dashboardNavigation } from '../data/demoDashboardData'

type SidebarProps = {
  activeItem: string
  collapsed: boolean
  mobileOpen: boolean
  onNavigate: (label: string) => void
  onToggleCollapsed: () => void
  onCloseMobile: () => void
}

function BrandMark() {
  return (
    <span className="microfinance-mark" aria-hidden="true">
      <i className="microfinance-mark__person" />
      <i className="microfinance-mark__left" />
      <i className="microfinance-mark__right" />
      <i className="microfinance-mark__leaf" />
    </span>
  )
}

function Sidebar({
  activeItem,
  collapsed,
  mobileOpen,
  onNavigate,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => new Set())

  function toggleExpanded(label: string) {
    setExpandedItems((current) => {
      const next = new Set(current)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  function selectItem(label: string) {
    onNavigate(label)
    onCloseMobile()
  }

  function handleItemClick(label: string, hasChildren: boolean) {
    if (label === 'Members' && hasChildren) {
      if (collapsed) onToggleCollapsed()
      toggleExpanded(label)
      return
    }

    selectItem(label)
  }

  return (
    <>
      {mobileOpen && (
        <button className="sidebar-backdrop" type="button" onClick={onCloseMobile} aria-label="Close navigation" />
      )}
      <aside className={`micro-sidebar${collapsed ? ' micro-sidebar--collapsed' : ''}${mobileOpen ? ' micro-sidebar--open' : ''}`}>
        <button
          className="sidebar-collapse"
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
        </button>
        <button className="sidebar-mobile-close" type="button" onClick={onCloseMobile} aria-label="Close navigation">
          <X size={19} />
        </button>

        <a className="micro-brand" href="#dashboard" onClick={() => selectItem('Dashboard')}>
          <BrandMark />
          <strong>DoorToDoor</strong>
          <span>Microfinance</span>
          <small>Together for a Better Life</small>
        </a>

        <nav className="micro-nav" aria-label="Dashboard navigation">
          {dashboardNavigation.map(({ label, icon: Icon, badge, children }) => {
            const expanded = expandedItems.has(label)
            const selected = activeItem === label || Boolean(children?.includes(activeItem))
            const iconClass = label.toLowerCase().replaceAll(' ', '-')
            const submenuId = `sidebar-submenu-${iconClass}`

            return (
              <div className="micro-nav__group" key={label}>
                <div className={`micro-nav__item-wrap${selected ? ' micro-nav__item-wrap--active' : ''}`}>
                  <button
                    className={`micro-nav__item${selected ? ' micro-nav__item--active' : ''}`}
                    type="button"
                    onClick={() => handleItemClick(label, Boolean(children))}
                    aria-current={selected ? 'page' : undefined}
                    title={collapsed ? label : undefined}
                  >
                    <span className={`micro-nav__icon micro-nav__icon--${iconClass}`}><Icon size={17} /></span>
                    <span className="micro-nav__label">{label}</span>
                    {badge && <span className="micro-nav__badge">{badge}</span>}
                  </button>
                  {children && (
                    <button
                      className="micro-nav__expand"
                      type="button"
                      onClick={() => toggleExpanded(label)}
                      aria-label={`${expanded ? 'Collapse' : 'Expand'} ${label} submenu`}
                      aria-expanded={expanded}
                      aria-controls={submenuId}
                    >
                      <ChevronDown size={14} />
                    </button>
                  )}
                </div>
                {children && expanded && !collapsed && (
                  <div className="micro-nav__submenu" id={submenuId}>
                    {children.map((child) => (
                      <button
                        key={child}
                        className={`micro-nav__subitem${activeItem === child ? ' micro-nav__subitem--active' : ''}`}
                        type="button"
                        onClick={() => selectItem(child)}
                      >
                        <span aria-hidden="true" />
                        {child}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="sidebar-promo">
          <div className="sidebar-promo__art"><HandCoins size={48} strokeWidth={1.3} /></div>
          <p>Empowering<br />People, Building<br /><strong>Prosperity</strong></p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
