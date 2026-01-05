import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-8 text-center text-muted-foreground">
      <div className="mb-4 flex justify-center gap-4">
        <Link href="/home" className="hover:text-primary">Home</Link>
        <Link href="/account" className="hover:text-primary">Account</Link>
        <Link href="/policies" className="hover:text-primary">Policies</Link>
        <Link href="/privacy" className="hover:text-primary">Privacy</Link>
        <Link href="/contact" className="hover:text-primary">Contact</Link>
      </div>
      <p>&copy; {new Date().getFullYear()} MX Exchange</p>
    </footer>
  );
}
