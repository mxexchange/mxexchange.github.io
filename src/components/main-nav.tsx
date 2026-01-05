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
            'text-sm font-medium transition-colors hover:text-primary-foreground/80',
            pathname === item.href ? 'text-primary-foreground' : 'text-primary-foreground/60'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
