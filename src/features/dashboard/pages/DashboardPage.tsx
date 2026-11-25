import { useCallback, useState } from 'react'
import type { AuthUser } from '../../auth/types'
import MemberDirectoryPage from '../../members/pages/MemberDirectoryPage'
import MemberRegistrationPage from '../../members/pages/MemberRegistrationPage'
import { demoMembers } from '../../members/data/demoMembers'
import type { MemberRecord } from '../../members/types'
import BranchPerformance from '../components/BranchPerformance'
import DashboardDialog from '../components/DashboardDialog'
import DashboardFooter from '../components/DashboardFooter'
import FinancialOverview from '../components/FinancialOverview'
import Header from '../components/Header'
import LoanDistribution from '../components/LoanDistribution'
import MissionCard from '../components/MissionCard'
import QuickActions from '../components/QuickActions'
import RecentActivities from '../components/RecentActivities'
import Sidebar from '../components/Sidebar'
import StatisticsCards from '../components/StatisticsCards'
import WelcomeBanner from '../components/WelcomeBanner'
import { dashboardActivities, dashboardBranches } from '../data/demoDashboardData'
import type { DashboardNotice, DashboardTheme } from '../types'
import '../styles/dashboard.css'

type DashboardPageProps = {
  currentUser: AuthUser
  lastLoginAt: Date | null
  onSignOut: () => void
}

function DashboardPage({ currentUser, lastLoginAt, onSignOut }: DashboardPageProps) {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState('Main Branch')
  const [theme, setTheme] = useState<DashboardTheme>('light')
  const [notice, setNotice] = useState<DashboardNotice | null>(null)
  const [members, setMembers] = useState(demoMembers)
  const [memberBeingEdited, setMemberBeingEdited] = useState<MemberRecord | null>(null)
  const [memberFeedback, setMemberFeedback] = useState<string | null>(null)

  const closeNotice = useCallback(() => setNotice(null), [])

  function navigateTo(label: string) {
    setActiveItem(label)

    if (label === 'Register Member' || label === 'View Member') {
      setMemberBeingEdited(null)
      setMemberFeedback(null)
      setNotice(null)
      return
    }

    const sectionIds: Record<string, string> = {
      Dashboard: 'dashboard',
      'Branch Management': 'branch-performance',
      'Branch performance': 'branch-performance',
      Reports: 'financial-overview',
      'Financial reports': 'financial-overview',
    }
    const sectionId = sectionIds[label]

    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      setNotice(null)
      return
    }

    setNotice({
      title: label,
      description: `The ${label.toLowerCase()} screen is not part of this demo yet. No backend action was performed.`,
    })
  }

  function showActivities() {
    setNotice({
      title: 'Recent Activities',
      description: 'Recent demo activity shown on this dashboard:',
      items: dashboardActivities.map(({ title, detail }) => `${title} · ${detail}`),
    })
  }

  function showBranchDetails() {
    setNotice({
      title: 'Branch Performance',
      description: 'Sample disbursement totals by branch:',
      items: dashboardBranches.map(({ name, amount }) => `${name} — ₹${amount}L`),
    })
  }

  function showMission() {
    setNotice({
      title: 'Grow Together, Prosper Together',
      description: 'DoorToDoor MicroFoundation supports financial inclusion through accessible community lending. This is demo content; no application or donation is submitted.',
    })
  }

  function saveMember(member: MemberRecord) {
    const isEditing = members.some((existingMember) => existingMember.id === member.id)
    setMembers((current) => (
      isEditing
        ? current.map((existingMember) => existingMember.id === member.id ? member : existingMember)
        : [member, ...current]
    ))
    setMemberBeingEdited(null)
    setActiveItem('View Member')
    setMemberFeedback(isEditing
      ? 'Member profile updated in this demo session only.'
      : 'Member added to this demo session only.')
    setNotice(null)
  }

  function editMember(member: MemberRecord) {
    setMemberBeingEdited(member)
    setMemberFeedback(null)
    setActiveItem('View Member')
    setNotice(null)
  }

  function deleteMember(memberId: string) {
    setMembers((current) => current.filter((member) => member.id !== memberId))
    setMemberFeedback('Member removed from this demo session only.')
  }

  function handleSelectBranch(branch: string) {
    setSelectedBranch(branch)
  }

  function toggleTheme() {
    setTheme((current) => current === 'light' ? 'dark' : 'light')
  }

  return (
    <main className={`micro-dashboard${collapsed ? ' micro-dashboard--collapsed' : ' micro-dashboard--expanded'}`} data-theme={theme}>
      <Sidebar
        activeItem={activeItem}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={navigateTo}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <section className="micro-main">
        <Header
          user={currentUser}
          onAction={setNotice}
          onMenuClick={() => setMobileOpen(true)}
          onSelectBranch={handleSelectBranch}
          onSignOut={onSignOut}
          onToggleTheme={toggleTheme}
          selectedBranch={selectedBranch}
          theme={theme}
        />
        {activeItem === 'Register Member' || activeItem === 'View Member' ? (
          activeItem === 'View Member' && !memberBeingEdited ? (
            <div className="micro-content micro-content--members" id="member-directory">
              <MemberDirectoryPage
                members={members}
                feedback={memberFeedback}
                onClearFeedback={() => setMemberFeedback(null)}
                onEdit={editMember}
                onDelete={deleteMember}
                onRegister={() => navigateTo('Register Member')}
              />
            </div>
          ) : (
          <div className="micro-content micro-content--registration" id="member-registration">
            <MemberRegistrationPage
              key={memberBeingEdited?.id ?? 'new-member'}
              initialMember={memberBeingEdited}
              onBack={() => navigateTo('View Member')}
              onSave={saveMember}
            />
          </div>
          )
        ) : (
          <div className="micro-content" id="dashboard">
            <WelcomeBanner administratorName={currentUser.displayName} />
            <StatisticsCards />
            <section className="overview-grid" aria-label="Financial overview">
              <FinancialOverview />
              <LoanDistribution />
              <QuickActions onAction={setNotice} />
            </section>
            <section className="bottom-grid" aria-label="Recent activity and branch performance">
              <RecentActivities onViewAll={showActivities} />
              <BranchPerformance onViewDetails={showBranchDetails} />
              <MissionCard onOpenMission={showMission} />
            </section>
          </div>
        )}
        <DashboardFooter lastLoginAt={lastLoginAt} />
      </section>
      {notice && <DashboardDialog notice={notice} onClose={closeNotice} />}
    </main>
  )
}

export default DashboardPage
