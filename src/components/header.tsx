import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-10 h-16 items-center gap-4 border-b bg-primary px-4 text-primary-foreground md:px-6 flex">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold">
          MX Exchange
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {/* The Sign-in button is removed from here to consolidate auth flow */}
      </div>
    </header>
  );
}
