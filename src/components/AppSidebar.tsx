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
import { Avatar, AvatarImage } from './ui/avatar';
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
  useSidebar,
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
  const appName = import.meta.env.VITE_APP_TITLE;

  const { user } = useAuth();
  const { isPending, mutate: logout } = useLogout();
  const { open } = useSidebar();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="text-primary text-center text-3xl font-extrabold">
        {open ? appName : appName[0]}
      </SidebarHeader>
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
      <SidebarFooter className="my-2 flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Avatar>
            <AvatarImage src={user?.picture} />
          </Avatar>
          {open && user?.name}
        </div>
        <Button variant="link" onClick={handleLogout} disabled={isPending}>
          {isPending ? <Loader text="Logging out..." /> : 'Logout'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
