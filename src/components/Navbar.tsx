import type { FC } from 'react';
import { Link } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu';

const Navbar: FC = () => {
  return (
    <NavigationMenu className="bg-background flex min-w-lvw justify-baseline p-3 shadow-md">
      <NavigationMenuList>
        <NavigationMenuItem className="bg-secondary">
          <NavigationMenuLink asChild>
            <Link to={'/activities'}>Activities</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
