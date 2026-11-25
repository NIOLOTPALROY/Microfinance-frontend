export type DashboardNotice = {
  title: string
  description: string
  items?: string[]
}

export type DashboardAction = (notice: DashboardNotice) => void

export type DashboardTheme = 'light' | 'dark'
