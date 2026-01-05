import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 h-16 items-center gap-4 border-b bg-primary px-4 text-primary-foreground md:px-6 flex">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold">
          MX Exchange
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary">
            <Link href="https://studio--studio-122199390-e63be.us-central1.hosted.app/" target="_blank">Sign In</Link>
        </Button>
      </div>
    </header>
  );
}
