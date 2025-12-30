import {
  IconCalendar,
  IconCurrencyPeso,
  IconHome,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import type { FC } from 'react';
import { Link } from 'react-router';
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
    url: '#',
    icon: IconSettings,
  },
];

const AppSidebar: FC = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
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
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
