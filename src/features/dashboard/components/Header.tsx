import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  Building2,
  Check,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
} from 'lucide-react'
import type { AuthUser } from '../../auth/types'
import {
  dashboardBranchesForSelector,
  dashboardSearchEntries,
} from '../data/demoDashboardData'
import type { DashboardAction, DashboardTheme } from '../types'

type HeaderProps = {
  user: AuthUser
  onAction: DashboardAction
  onMenuClick: () => void
  onSelectBranch: (branch: string) => void
  onSignOut: () => void
  onToggleTheme: () => void
  selectedBranch: string
  theme: DashboardTheme
}

const notifications = [
  { id: 1, title: 'Loan approval pending', detail: '3 applications need review', time: '5 min ago' },
  { id: 2, title: 'New member registered', detail: 'Riya Sharma · Main Branch', time: '12 min ago' },
  { id: 3, title: 'EMI collection received', detail: '₹12,000 collected today', time: '28 min ago' },
  { id: 4, title: 'Branch report is ready', detail: 'Monthly collection summary', time: '1 hr ago' },
  { id: 5, title: 'System update', detail: 'Your dashboard is up to date', time: '2 hrs ago' },
]

type OpenMenu = 'branch' | 'notifications' | 'profile' | null

function Header({
  user,
  onAction,
  onMenuClick,
  onSelectBranch,
  onSignOut,
  onToggleTheme,
  selectedBranch,
  theme,
}: HeaderProps) {
  const initials = user.displayName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'
  const profileSubtitle = user.roles.length ? user.roles.join(' · ') : 'Authenticated user'
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [unreadIds, setUnreadIds] = useState(() => new Set(notifications.map(({ id }) => id)))
  const headerRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchResults = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    if (!normalizedTerm) return []
    return dashboardSearchEntries.filter(({ label, description }) =>
      `${label} ${description}`.toLowerCase().includes(normalizedTerm),
    )
  }, [searchTerm])

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }

      if (event.key === 'Escape') {
        setOpenMenu(null)
        setSearchTerm('')
        searchInputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setOpenMenu(null)
        setSearchTerm('')
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    return () => document.removeEventListener('pointerdown', handleOutsideClick)
  }, [])

  function toggleMenu(menu: Exclude<OpenMenu, null>) {
    setOpenMenu((current) => current === menu ? null : menu)
    setSearchTerm('')
  }

  function chooseSearchResult(label: string, detail: string) {
    onAction({ title: label, description: detail })
    setSearchTerm('')
  }

  function openNotification(notification: typeof notifications[number]) {
    setUnreadIds((current) => {
      const next = new Set(current)
      next.delete(notification.id)
      return next
    })
    onAction({ title: notification.title, description: notification.detail })
    setOpenMenu(null)
  }

  function markAllRead() {
    setUnreadIds(new Set())
  }

  return (
    <header className="micro-topbar" ref={headerRef}>
      <button className="micro-mobile-menu" type="button" onClick={onMenuClick} aria-label="Open navigation">
        <Menu size={21} />
      </button>

      <div className="global-search-wrap">
        <label className="global-search">
          <Search size={18} aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value)
              setOpenMenu(null)
            }}
            placeholder="Search members, loans, or transactions..."
            aria-label="Search members, loans, or transactions"
            aria-expanded={searchTerm.trim().length > 0}
            aria-controls="global-search-results"
          />
          <kbd>Ctrl + K</kbd>
        </label>
        {searchTerm.trim() && (
          <div className="search-results" id="global-search-results" role="listbox" aria-label="Search results">
            {searchResults.length ? searchResults.map((result) => (
              <button
                type="button"
                role="option"
                aria-selected="false"
                key={result.label}
                onClick={() => chooseSearchResult(result.label, result.detail)}
              >
                <span className="search-results__icon"><Search size={15} /></span>
                <span><strong>{result.label}</strong><small>{result.description}</small></span>
              </button>
            )) : <p className="search-results__empty">No matching demo records.</p>}
          </div>
        )}
      </div>

      <div className="topbar-actions">
        <div className="topbar-menu">
          <button
            className="branch-select"
            type="button"
            onClick={() => toggleMenu('branch')}
            aria-expanded={openMenu === 'branch'}
            aria-haspopup="menu"
          >
            <Building2 size={17} /><span>{selectedBranch}</span><ChevronDown size={14} />
          </button>
          {openMenu === 'branch' && (
            <div className="topbar-dropdown branch-dropdown" role="menu" aria-label="Select branch">
              <strong className="topbar-dropdown__heading">Your branches</strong>
              {dashboardBranchesForSelector.map((branch) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={selectedBranch === branch}
                  key={branch}
                  onClick={() => {
                    onSelectBranch(branch)
                    setOpenMenu(null)
                  }}
                >
                  <Building2 size={15} />
                  <span>{branch}</span>
                  {selectedBranch === branch && <Check size={15} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="topbar-menu">
          <button
            className="topbar-icon topbar-notifications"
            type="button"
            onClick={() => toggleMenu('notifications')}
            aria-label={`Notifications, ${unreadIds.size} unread`}
            aria-expanded={openMenu === 'notifications'}
            aria-haspopup="menu"
          >
            <Bell size={19} />
            {unreadIds.size > 0 && <i>{unreadIds.size}</i>}
          </button>
          {openMenu === 'notifications' && (
            <div className="topbar-dropdown notifications-dropdown" role="menu" aria-label="Notifications">
              <div className="notifications-heading">
                <strong>Notifications</strong>
                <button type="button" onClick={markAllRead}>Mark all read</button>
              </div>
              {notifications.map((notification) => (
                <button
                  className={`notification-item${unreadIds.has(notification.id) ? ' notification-item--unread' : ''}`}
                  type="button"
                  role="menuitem"
                  key={notification.id}
                  onClick={() => openNotification(notification)}
                >
                  <span className="notification-item__dot" />
                  <span><strong>{notification.title}</strong><small>{notification.detail}</small><small>{notification.time}</small></span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="topbar-icon theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-pressed={theme === 'dark'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="topbar-menu">
          <button
            className="admin-profile"
            type="button"
            onClick={() => toggleMenu('profile')}
            aria-expanded={openMenu === 'profile'}
            aria-haspopup="menu"
          >
            <span className="admin-avatar">{initials}</span>
            <span className="admin-profile__copy"><strong>{user.displayName}</strong><small>{profileSubtitle}</small></span>
            <ChevronDown size={14} />
          </button>
          {openMenu === 'profile' && (
            <div className="topbar-dropdown profile-dropdown" role="menu" aria-label="User profile">
              <div className="profile-dropdown__identity"><UserRound size={17} /><span><strong>{user.displayName}</strong><small>{profileSubtitle}</small></span></div>
              <button type="button" role="menuitem" onClick={() => {
                onAction({ title: 'Administrator profile', description: 'Profile editing is not connected in this demo.' })
                setOpenMenu(null)
              }}>
                <UserRound size={15} /> My profile
              </button>
              <button className="profile-dropdown__signout" type="button" role="menuitem" onClick={onSignOut}>
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
