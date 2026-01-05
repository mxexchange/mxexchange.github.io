
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MainNav } from '@/components/main-nav';

export default function LandingPage() {
  return (
    <PageShell>
      <div className="absolute top-0 left-0 flex items-center justify-between w-full max-w-6xl px-4 md:px-6 py-4 mx-auto">
        <Avatar>
          <AvatarFallback>MX</AvatarFallback>
        </Avatar>
        <MainNav />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-6 text-center pt-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Sweeps Coin Exchange
        </h1>
        <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
          Exchange MX Sweeps Coins For US Dollars
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 text-lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
