import { useAuth } from '@/features/auth/auth';
import { Navigate, Outlet, useLocation } from 'react-router';
import AppSidebar from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';

export default function Layout() {
  const app = import.meta.env.VITE_APP_TITLE;
  const { isAuthenticated, isLoading, isError } = useAuth();
  const { pathname } = useLocation();

  if (isLoading)
    return (
      <main className="bg-background flex h-screen items-center justify-center">
        <h1 className="text-primary text-5xl font-extrabold">{app}</h1>
      </main>
    );

  if (isError || !isAuthenticated)
    return <Navigate to="/login" replace state={{ intendedPath: pathname }} />;

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
