import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRedirects: Record<UserRole, string> = {
      doctor: '/doctor',
      receptionist: '/reception',
      patient: '/patient/dashboard',
      pharmacist: '/inventory',
      manager: '/reports',
      admin: '/admin/settings',
    };
    return <Navigate to={roleRedirects[user.role] || '/'} replace />;
  }

  return <>{children}</>;
}
