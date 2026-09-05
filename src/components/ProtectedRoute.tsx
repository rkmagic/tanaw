import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/integrations/gcp/types";

const ROLE_DASHBOARD: Record<UserRole, string> = {
  candidate: "/candidate/dashboard",
  agency: "/agency/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    const dashboard = ROLE_DASHBOARD[role];
    return <Navigate to={dashboard} replace />;
  }

  return <>{children}</>;
}
