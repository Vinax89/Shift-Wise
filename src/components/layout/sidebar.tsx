'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar as BaseSidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CalendarDays,
  Target,
  PiggyBank,
  Landmark,
  Settings,
  Wallet,
} from 'lucide-react';

const menuItems = [
  { href: '/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/budgets', label: 'Budgets', icon: Wallet },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/taxes', label: 'Taxes', icon: PiggyBank },
];

const bottomMenuItems = [
  { href: '/accounts', label: 'Accounts', icon: Landmark },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar({ isMobile = false }) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8 text-accent"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2zm-4 4h12v2H8v-2z" />
          </svg>
          <h2 className="text-xl font-bold tracking-tighter font-headline text-foreground">
            ShiftWise
          </h2>
        </div>
      </SidebarHeader>
      <div className="flex-1 overflow-y-auto">
        <SidebarMenu className="p-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
      <div className="mt-auto">
        <SidebarMenu className="p-2">
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </>
  );

  if (isMobile) {
    return <div className="flex flex-col h-full">{sidebarContent}</div>;
  }

  return (
    <BaseSidebar variant="sidebar" collapsible="icon">
      {sidebarContent}
    </BaseSidebar>
  );
}
