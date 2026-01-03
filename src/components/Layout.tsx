import { Outlet } from 'react-router';
import AppSidebar from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';

export default function Layout() {
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
