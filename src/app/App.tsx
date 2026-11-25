import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import { AuthProvider } from "../features/auth/context/AuthContext";
import useAuth from "../features/auth/hooks/useAuth";
import type { AuthUser } from "../features/auth/types";

function getLastLoginAt(user: AuthUser): Date | null {
  if (!user.lastLoginAt) return null;
  const date = new Date(user.lastLoginAt);
  return Number.isNaN(date.getTime()) ? null : date;
}

function AppContent() {
  const {
    user,
    isAuthenticated,
    isRestoringSession,
    logout,
    successMessage,
    clearSuccessMessage,
  } = useAuth();

  useEffect(() => {
    document.title = isRestoringSession
      ? "Loading | DoorToDoor"
      : isAuthenticated
        ? "Dashboard | DoorToDoor"
        : "Sign in | DoorToDoor";
  }, [isAuthenticated, isRestoringSession]);

  return (
    <>
      <ProtectedRoute fallback={<LoginPage />}>
        {user && (
          <DashboardPage
            currentUser={user}
            lastLoginAt={getLastLoginAt(user)}
            onSignOut={() => {
              void logout();
            }}
          />
        )}
      </ProtectedRoute>
      {successMessage && (
        <div className="auth-toast" role="status">
          <CheckCircle2 size={17} aria-hidden="true" />
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={clearSuccessMessage}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
