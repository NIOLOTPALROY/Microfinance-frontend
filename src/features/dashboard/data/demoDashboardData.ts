import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle,
  CircleDollarSign,
  ClipboardList,
  Headphones,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export type DashboardMetric = {
  title: string
  value: string
  change: string
  direction: 'up' | 'down'
  icon: LucideIcon
  tone: 'blue' | 'green' | 'orange' | 'purple'
  sparkline: string
}

export type DashboardActivity = {
  icon: LucideIcon
  tone: 'green' | 'blue' | 'purple'
  title: string
  detail: string
  tag: string
}

export type DashboardBranch = {
  name: string
  amount: number
  color: 'blue' | 'green' | 'purple' | 'orange'
}

export type DashboardNavigationItem = {
  label: string
  icon: LucideIcon
  badge?: string
  children?: string[]
}

export const dashboardMetrics: DashboardMetric[] = [
  { title: 'Total Members', value: '2,450', change: '12%', direction: 'up', icon: Users, tone: 'blue', sparkline: '0,31 18,28 33,33 48,21 64,26 80,12 98,6' },
  { title: 'Total Disbursed', value: '₹85.50 L', change: '18%', direction: 'up', icon: Wallet, tone: 'green', sparkline: '0,29 16,27 30,18 45,22 62,14 78,16 98,5' },
  { title: 'Pending Applications', value: '125', change: '5%', direction: 'down', icon: ClipboardList, tone: 'orange', sparkline: '0,32 17,27 33,28 49,19 62,26 79,11 98,7' },
  { title: 'Monthly Collection', value: '₹12.80 L', change: '14%', direction: 'up', icon: BarChart3, tone: 'purple', sparkline: '0,31 17,24 33,28 49,13 64,19 81,10 98,4' },
]

export const dashboardNavigation: DashboardNavigationItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Members', icon: Users, children: ['Register Member', 'View Member'] },
  { label: 'Loan Applications', icon: ClipboardList, badge: '24', children: ['All applications', 'New application'] },
  { label: 'Loan Approval', icon: CheckCircle, children: ['Pending approvals', 'Approval history'] },
  { label: 'Loan Disbursement', icon: CircleDollarSign },
  { label: 'EMI Collection', icon: Wallet },
  { label: 'Branch Management', icon: Building2, children: ['All branches', 'Branch performance'] },
  { label: 'Employee Management', icon: BriefcaseBusiness, children: ['Staff directory', 'Add employee'] },
  { label: 'Reports', icon: BarChart3, children: ['Financial reports', 'Collection reports'] },
  { label: 'Settings', icon: Settings, children: ['Preferences', 'Account settings'] },
  { label: 'Help & Support', icon: Headphones },
]

export const dashboardActivities: DashboardActivity[] = [
  { icon: CheckCircle, tone: 'green', title: 'Loan Approved – ₹50,000', detail: 'By Admin · 2 min ago', tag: 'Approved' },
  { icon: Users, tone: 'blue', title: 'New Member Registered – Riya Sharma', detail: 'By Operator · 5 min ago', tag: 'Member' },
  { icon: CircleDollarSign, tone: 'purple', title: 'EMI Collected – ₹12,000', detail: 'By Branch Manager · 10 min ago', tag: 'Collected' },
]

export const dashboardBranches: DashboardBranch[] = [
  { name: 'Main Branch', amount: 28, color: 'blue' },
  { name: 'North Branch', amount: 24, color: 'green' },
  { name: 'South Branch', amount: 20, color: 'purple' },
  { name: 'East Branch', amount: 18, color: 'orange' },
]

export const financialSeries = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  disbursement: [48, 49, 55, 50, 67, 73, 52, 68, 78, 77, 84, 98],
  collection: [39, 40, 45, 39, 51, 57, 35, 54, 64, 63, 70, 79],
  pending: [12, 14, 15, 14, 14, 15, 19, 25, 22, 31, 35, 40],
}

export const loanDistribution = [
  { label: 'Group Loan', value: 68, tone: 'blue' },
  { label: 'Personal Loan', value: 22, tone: 'green' },
  { label: 'Business Loan', value: 10, tone: 'orange' },
] as const

export const dashboardBranchesForSelector = ['Main Branch', 'North Branch', 'South Branch', 'East Branch']

export const dashboardSearchEntries = [
  { label: 'Riya Sharma', description: 'Member · Active account', detail: 'Demo member record for Riya Sharma.' },
  { label: 'Loan application LA-2401', description: 'Application · Pending review', detail: 'Demo loan application LA-2401 is awaiting review.' },
  { label: 'Monthly collection report', description: 'Report · Finance', detail: 'Monthly collection report is a demo dashboard section.' },
  { label: 'Branch performance', description: 'Report · Branches', detail: 'Use the branch performance chart on this dashboard.' },
]
