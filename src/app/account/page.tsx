import { PageShell } from '@/components/page-shell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AccountPage() {
  return (
    <PageShell className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-between w-full max-w-6xl px-4 md:px-6 py-4">
        <Avatar>
          <AvatarFallback>MX</AvatarFallback>
        </Avatar>
        <MainNav />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            MX Exchange Account
          </h1>
        </div>

        <div className="space-y-4 text-lg text-left text-white">
          <p>Account Name: Value</p>
          <p>MX Sweeps Coins Available: Value</p>
        </div>

        <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 text-lg">
            <Link href="/dashboard">Make Trade</Link>
        </Button>
      </div>
    </PageShell>
  );
}
