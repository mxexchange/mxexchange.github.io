import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageShell } from '@/components/page-shell';
import { ArrowRight } from 'lucide-react';
import { MainNav } from '@/components/main-nav';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


export default function SignInPage() {
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
                Sign In
            </h1>
        </div>

        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access your account, place bets, and more.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm text-accent hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input id="password" type="password" placeholder="********" />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Join us today to start exchanging sweeps coins.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type="password" placeholder="********" />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Register
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
