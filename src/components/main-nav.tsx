'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/account',
    label: 'Account',
  },
  {
    href: '/settings/bank',
    label: 'Bank Info',
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-accent/80',
            pathname === item.href ? 'text-accent' : 'text-accent/60'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
