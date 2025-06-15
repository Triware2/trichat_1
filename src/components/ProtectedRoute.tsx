
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  requiresPlatformAccess?: boolean;
}

export const ProtectedRoute = ({ children, allowedRoles, requiresPlatformAccess = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if this is the platform creator (you)
  const isPlatformCreator = user.email === 'Admin@trichat.com' || user.email === 'admin@trichat.com';
  
  // If platform access is required, only allow the platform creator
  if (requiresPlatformAccess && !isPlatformCreator) {
    return <Navigate to="/admin" replace />;
  }

  // For regular role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.user_metadata?.role || 'admin';
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
