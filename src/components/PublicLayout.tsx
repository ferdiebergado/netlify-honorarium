import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../features/auth/auth';
import Splash from './Splash';

type LocationState = {
  from?: string;
};

export default function PublicLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const path = state?.from ?? '/';

  if (isLoading) return <Splash />;

  if (user) return <Navigate to={path} replace />;

  return (
    <main>
      <Outlet />
    </main>
  );
}
