import { IconCalendar, IconDashboard } from '@tabler/icons-react';
import { type FC } from 'react';
import { Link } from 'react-router';
import NavUser from './NavUser';
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
    title: 'Dashboard',
    url: '/',
    icon: IconDashboard,
  },
  {
    title: 'Activities',
    url: '/activities',
    icon: IconCalendar,
  },
];

const AppSidebar: FC = () => {
  const appName = import.meta.env.VITE_APP_TITLE;

  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="text-primary justify-center p-5 text-center text-3xl font-extrabold">
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
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
