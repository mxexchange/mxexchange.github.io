'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  History,
  Landmark,
  ShieldCheck,
  Coins,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { SweepsCoinIcon } from './icons';

const navItems = [
  {
    href: '/',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/history',
    icon: History,
    label: 'History',
  },
  {
    href: '/withdraw',
    icon: Landmark,
    label: 'Withdraw',
  },
  {
    href: '/compliance',
    icon: ShieldCheck,
    label: 'Compliance',
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-2 py-4">
      <div className="mb-4 flex items-center gap-2 px-2">
        <SweepsCoinIcon className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold group-data-[collapsible=icon]:hidden">
          MX Sweeps
        </h1>
      </div>
      <nav className="flex-1">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    className: 'group-data-[collapsible=icon]:block hidden',
                  }}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </nav>
    </div>
  );
}
