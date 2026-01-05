'use client';

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
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Signed In',
        description: 'You have successfully signed in.',
      });
      router.push('/account'); // Redirect to account page after sign-in
    } catch (error: any) {
      // If user does not exist, create a new account
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          // Create a new document in Firestore for the new user
          await setDoc(doc(firestore, 'users', user.uid), {
            id: user.uid,
            mxRacehubId: `MXR-${user.uid.substring(0, 8)}`, // Example MXRacehub ID
            sweepsCoinBalance: 0,
            usdBalance: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            email: user.email,
            username: user.email?.split('@')[0] || '', // Default username from email
          });
          toast({
            title: 'Account Created',
            description: 'Your account has been successfully created.',
          });
          router.push('/account');
        } catch (creationError: any) {
           toast({
            title: 'Sign-up Failed',
            description: creationError.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Sign In Failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };
  
  return (
    <PageShell className="flex flex-col items-center justify-center">
       <div className="absolute top-0 left-0 flex items-center justify-between w-full max-w-6xl px-4 md:px-6 py-4 mx-auto">
             <Avatar>
                <AvatarFallback>MX</AvatarFallback>
            </Avatar>
            <MainNav />
        </div>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-4 pt-16">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Sign In or Sign Up
            </h1>
            <p className="text-muted-foreground">
              Sign in with your MXRacehub account credentials.
            </p>
        </div>

        <Card className="w-full">
            <form onSubmit={handleSignIn}>
            <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>
                Enter your credentials to access your account. New users will be automatically registered.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
                <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                Sign In / Sign Up <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
            </form>
        </Card>
      </div>
    </PageShell>
  );
}
