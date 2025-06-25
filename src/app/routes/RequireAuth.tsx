import { Navigate, Outlet, useLocation } from 'react-router';
import { useUserInfoQuery } from '../../features/auth/authApi';

export default function RequireAuth() {
  const { data, isLoading } = useUserInfoQuery();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <Navigate to="/login" state={{ from: location }} />;

  const adminRoutes = ['/inventory', '/admin-dashboard'];

  if (
    adminRoutes.includes(location.pathname) &&
    !data.result.role.includes('ADMIN')
  ) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
