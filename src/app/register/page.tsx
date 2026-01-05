'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { LoaderCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  return (
    <PageShell className="flex flex-col items-center justify-center">
      <div className="flex items-center space-x-2">
        <LoaderCircle className="h-6 w-6 animate-spin" />
        <p>Redirecting to sign-in...</p>
      </div>
    </PageShell>
  );
}
