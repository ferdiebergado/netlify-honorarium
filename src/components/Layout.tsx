import { useAuth } from '@/features/auth/auth';
import { Navigate, Outlet } from 'react-router';
import AppSidebar from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';

export default function Layout() {
  const { isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading)
    return (
      <main className="bg-background flex h-screen items-center justify-center">
        <h1 className="text-primary text-5xl font-extrabold">{import.meta.env.VITE_APP_TITLE}</h1>
      </main>
    );

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
