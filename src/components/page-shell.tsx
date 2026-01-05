import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn('flex-1 p-4 md:p-6 lg:p-8', className)}>
      {children}
    </main>
  );
}
