import { useAuth } from '@/features/auth/auth';
import { Navigate, Outlet } from 'react-router';
import AppSidebar from './AppSidebar';
import Loader from './Loader';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';

export default function Layout() {
  const { isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading) return <Loader text="Logging in..." />;

  if (isError || !isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="mx-6 w-full">
        <SidebarTrigger className="my-1" />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
