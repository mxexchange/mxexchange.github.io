import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MX Exchange',
  description: 'Exchange your sweeps coins for USD.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('dark', inter.variable)}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 relative">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
