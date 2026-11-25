import type { ReactNode } from 'react'
import useAuth from '../hooks/useAuth'

type ProtectedRouteProps = {
  children: ReactNode
  fallback?: ReactNode
  accessDeniedFallback?: ReactNode
  allowedRoles?: string[]
  requiredPermissions?: string[]
  branchId?: string
}

function ProtectedRoute({
  children,
  fallback = null,
  accessDeniedFallback,
  allowedRoles,
  requiredPermissions = [],
  branchId,
}: ProtectedRouteProps) {
  const { isAuthenticated, isRestoringSession, hasRole, hasPermission, canAccessBranch } = useAuth()

  if (isRestoringSession) {
    return <div className="auth-loading" role="status">Restoring your secure session…</div>
  }

  if (!isAuthenticated) return fallback

  const roleAllowed = !allowedRoles?.length || allowedRoles.some(hasRole)
  const permissionsAllowed = requiredPermissions.every(hasPermission)
  const branchAllowed = !branchId || canAccessBranch(branchId)

  if (!roleAllowed || !permissionsAllowed || !branchAllowed) {
    return accessDeniedFallback ?? (
      <div className="auth-access-denied" role="alert">
        Your account does not have permission to access this area.
      </div>
    )
  }

  return children
}

export default ProtectedRoute
