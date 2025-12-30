import { IconLoader } from '@tabler/icons-react';
import { Outlet } from 'react-router';
import AppSidebar from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { Toaster } from './ui/sonner';

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="mx-6 w-full">
        <SidebarTrigger className="my-1" />
        <Outlet />
        <Toaster
          position="top-right"
          expand
          richColors
          icons={{ loading: <IconLoader size={18} className="animate-spin" /> }}
        />
      </main>
    </SidebarProvider>
  );
}
