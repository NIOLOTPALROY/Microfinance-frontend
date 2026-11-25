import { useEffect, useState } from 'react'
import { AUTH_SESSION_EXPIRED_EVENT } from '../../../services/apiClient'
import AuthContext from './authContextStore'
import authService, {
  getAuthErrorMessage,
  isUnauthorizedAuthError,
} from '../services/authService'
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthUser,
  ForgotPasswordRequest,
  LoginCredentials,
} from '../types'

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isRestoringSession, setIsRestoringSession] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void authService.getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setUser(null)
        if (isUnauthorizedAuthError(requestError)) {
          setError(null)
        } else {
          setError(getAuthErrorMessage(requestError))
        }
      })
      .finally(() => {
        if (active) setIsRestoringSession(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    function handleSessionExpired() {
      setUser(null)
      setError('Your session has expired. Please sign in again.')
      setSuccessMessage(null)
    }

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [])

  async function login(credentials: LoginCredentials): Promise<boolean> {
    setError(null)
    setSuccessMessage(null)
    setIsAuthenticating(true)

    try {
      const authenticatedUser = await authService.login(credentials)
      setUser(authenticatedUser)
      setSuccessMessage('Signed in successfully.')
      return true
    } catch (requestError) {
      setUser(null)
      setError(getAuthErrorMessage(requestError))
      return false
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function logout(): Promise<boolean> {
    setError(null)
    setSuccessMessage(null)
    setIsLoggingOut(true)

    try {
      await authService.logout()
      setError(null)
      setSuccessMessage('Signed out successfully.')
      return true
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError))
      return false
    } finally {
      setUser(null)
      setIsLoggingOut(false)
    }
  }

  async function forgotPassword(payload: ForgotPasswordRequest): Promise<boolean> {
    setError(null)
    setIsSendingPasswordReset(true)

    try {
      await authService.forgotPassword(payload)
      return true
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError))
      return false
    } finally {
      setIsSendingPasswordReset(false)
    }
  }

  async function refreshToken(): Promise<boolean> {
    setError(null)

    try {
      const refreshedUser = await authService.refreshToken()
      setUser(refreshedUser)
      return true
    } catch (requestError) {
      setError(getAuthErrorMessage(requestError))
      return false
    }
  }

  function hasRole(role: string) {
    return user?.roles.includes(role) ?? false
  }

  function hasPermission(permission: string) {
    return user?.permissions.includes(permission) ?? false
  }

  function canAccessBranch(branchId: string) {
    return user?.branchIds.includes(branchId) ?? false
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isRestoringSession,
    isAuthenticating,
    isSendingPasswordReset,
    isLoggingOut,
    error,
    successMessage,
    login,
    logout,
    forgotPassword,
    refreshToken,
    clearError: () => setError(null),
    clearSuccessMessage: () => setSuccessMessage(null),
    hasRole,
    hasPermission,
    canAccessBranch,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
