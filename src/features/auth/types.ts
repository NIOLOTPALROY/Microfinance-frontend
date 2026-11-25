import type { ReactNode } from 'react'

export type AuthUser = {
  id: string
  displayName: string
  email?: string
  mobile?: string
  roles: string[]
  permissions: string[]
  branchIds: string[]
  lastLoginAt?: string
}

export type LoginCredentials = {
  identifier: string
  password: string
  rememberMe: boolean
}

export type ForgotPasswordRequest = {
  identifier: string
}

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isRestoringSession: boolean
  isAuthenticating: boolean
  isSendingPasswordReset: boolean
  isLoggingOut: boolean
  error: string | null
  successMessage: string | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => Promise<boolean>
  forgotPassword: (payload: ForgotPasswordRequest) => Promise<boolean>
  refreshToken: () => Promise<boolean>
  clearError: () => void
  clearSuccessMessage: () => void
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  canAccessBranch: (branchId: string) => boolean
}

export type AuthProviderProps = {
  children: ReactNode
}
