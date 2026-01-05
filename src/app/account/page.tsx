
'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/page-shell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Banknote, User, Hash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Skeleton } from '@/components/ui/skeleton';

interface UserData {
  username: string;
  sweepsCoins: number;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  routingNumber?: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    routingNumber: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setBankInfo({
            bankName: data.bankName || '',
            accountHolder: data.accountHolder || '',
            accountNumber: data.accountNumber || '',
            routingNumber: data.routingNumber || '',
          });
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: 'You must be logged in to save.', variant: 'destructive' });
        return;
    }
    setIsSaving(true);
    try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { ...bankInfo }, { merge: true });
        toast({
            title: 'Bank Information Saved',
            description: 'Your withdrawal details have been updated successfully.',
        });
    } catch (error) {
        console.error("Error saving bank info: ", error);
        toast({ title: 'Error saving data', variant: 'destructive' });
    }
    
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBankInfo((prev) => ({ ...prev, [id]: value }));
  };


  return (
    <PageShell>
      <div className="flex items-center justify-between w-full max-w-6xl px-4 md:px-6 py-4 mx-auto">
        <Avatar>
          <AvatarFallback>MX</AvatarFallback>
        </Avatar>
        <MainNav />
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-center mt-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            MX Exchange Account
          </h1>
        </div>

        <div className="space-y-4 text-lg text-left text-white">
          {isLoading ? (
            <>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-7 w-64" />
            </>
          ) : userData ? (
            <>
              <p>Account Name: {userData.username}</p>
              <p>MX Sweeps Coins Available: {userData.sweepsCoins?.toLocaleString()}</p>
            </>
          ) : (
             <p>Please sign in to view your account.</p>
          )}
        </div>

        <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 text-lg">
            <Link href="/dashboard">Make Trade</Link>
        </Button>
      </div>
      
      <Separator className="my-12 max-w-xl mx-auto" />

      <div className="mx-auto grid w-full max-w-xl gap-4">
        <Card>
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle>Bank Account Information</CardTitle>
              <CardDescription>
                Manage your bank account for USD withdrawals.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="bankName">Bank Name</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="bankName"
                    type="text"
                    placeholder="e.g., Global Megabank"
                    value={bankInfo.bankName}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={!user}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                 <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="accountHolder"
                    type="text"
                    placeholder="e.g., John Doe"
                    value={bankInfo.accountHolder}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={!user}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accountNumber">Account Number</Label>
                 <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="**** **** **** 1234"
                    value={bankInfo.accountNumber}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={!user}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="routingNumber">Routing Number</Label>
                 <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="routingNumber"
                    type="text"
                    placeholder="e.g., 123456789"
                    value={bankInfo.routingNumber}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={!user}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isSaving || !user}
              >
                {isSaving && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}
