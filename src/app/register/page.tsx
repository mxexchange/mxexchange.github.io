import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageShell } from '@/components/page-shell';
import { ArrowRight } from 'lucide-react';
import { MainNav } from '@/components/main-nav';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegisterPage() {
  return (
    <PageShell className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-between w-full max-w-6xl px-4 md:px-6 py-4">
        <Avatar>
          <AvatarFallback>MX</AvatarFallback>
        </Avatar>
        <MainNav />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Registration
          </h1>
          <p className="text-muted-foreground">Create Account</p>
        </div>

        <Card className="w-full">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Choose a username" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a password" />
                <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm your password" />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the <Link href="/policies" className="text-accent hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
                </label>
              </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Create Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
