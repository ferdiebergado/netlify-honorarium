import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../features/auth/auth';
import AppSidebar from './AppSidebar';
import Splash from './Splash';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';

export default function Layout() {
  const { isLoading, user } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) return <Splash />;

  if (!user) return <Navigate to="/login" replace state={{ from: pathname }} />;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="mx-6 w-full">
        <SidebarTrigger className="mt-3 mb-12" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
