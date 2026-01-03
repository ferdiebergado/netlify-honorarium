import { useAuth, useLogout } from '@/features/auth/auth';
import {
  IconCalendar,
  IconCurrencyPeso,
  IconHome,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { useCallback, type FC } from 'react';
import { Link } from 'react-router';
import Loader from './Loader';
import { Button } from './ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: IconHome,
  },
  {
    title: 'Activities',
    url: '/activities',
    icon: IconCalendar,
  },
  {
    title: 'Payees',
    url: '/payees',
    icon: IconUsers,
  },
  {
    title: 'Payments',
    url: '/payments',
    icon: IconCurrencyPeso,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: IconSettings,
  },
];

const AppSidebar: FC = () => {
  const { user } = useAuth();
  const { isPending, mutate: logout } = useLogout();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="text-2xl font-semibold">HonorProS</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        Logged in as {user?.name}{' '}
        <Button variant="link" onClick={handleLogout} disabled={isPending}>
          {isPending ? <Loader text="Logging out..." /> : 'Logout'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
