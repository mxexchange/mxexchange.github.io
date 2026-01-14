'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageShell } from '@/components/page-shell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
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
import { LoaderCircle, Banknote, User, Hash, Coins, KeyRound, CheckCircle } from 'lucide-react';
import { type User as FirebaseUser, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { ExchangeForm } from '@/components/dashboard/exchange-form';
import { useRouter } from 'next/navigation';
import { usePlaidLink } from 'react-plaid-link';

interface UserData {
  username: string;
  sweepsCoins: number;
  usdBalance: number;
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  routingNumber?: string;
  plaidAccessToken?: string;
  plaidItemId?: string;
}

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    routingNumber: '',
  });
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [isAddingCoins, setIsAddingCoins] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUserData = async (currentUser: FirebaseUser) => {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        setUsername(data.username || '');
        setBankInfo({
          bankName: data.bankName || '',
          accountHolder: data.accountHolder || '',
          accountNumber: data.accountNumber || '',
          routingNumber: data.routingNumber || '',
        });
      }
      setIsLoading(false);
  }

  useEffect(() => {
    if (!isUserLoading && user) {
        fetchUserData(user);
    } else if (!isUserLoading && !user) {
        setIsLoading(false);
    }
  }, [user, isUserLoading]);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch('/api/plaid-link-token', { method: 'POST' });
        const { link_token } = await response.json();
        setLinkToken(link_token);
      } catch (error) {
        console.error('Error creating Plaid link token:', error);
      }
    };
    createLinkToken();
  }, []);

  const onPlaidSuccess = useCallback(
    async (public_token: string) => {
      setIsSaving(true);
      try {
        await fetch('/api/plaid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_token, userId: user?.uid }),
        });

        if (user) {
            await fetchUserData(user);
        }

        toast({
          title: 'Bank Account Linked',
          description: 'Your bank account has been successfully linked.',
        });
      } catch (error) {
        console.error('Error linking bank account:', error);
        toast({ title: 'Error Linking Account', variant: 'destructive' });
      } finally {
        setIsSaving(false);
      }
    },
    [user, fetchUserData]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
  });

  
  const handleSaveAccountInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: 'You must be logged in to save.', variant: 'destructive' });
        return;
    }
    setIsSavingAccount(true);
    try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, { username });
        if(user) {
            await fetchUserData(user);
        } 
        toast({
            title: 'Account Information Saved',
            description: 'Your username has been updated successfully.',
        });
    } catch (error) {
        console.error("Error saving account info: ", error);
        toast({ title: 'Error saving data', variant: 'destructive' });
    }
    setIsSavingAccount(false);
  };

  const handlePasswordReset = async () => {
    if (!user || !user.email) {
      toast({ title: 'Could not send reset email', description: 'No user or email found.', variant: 'destructive' });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: 'Password Reset Email Sent',
        description: `An email has been sent to ${user.email} with instructions to reset your password.`,
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast({ title: 'Error', description: 'Could not send password reset email.', variant: 'destructive' });
    }
  };


  const handleAddCoins = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be signed in to add coins.',
        variant: 'destructive',
      });
      return;
    }
    setIsAddingCoins(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        sweepsCoins: increment(10000)
      });
      if (user) {
        await fetchUserData(user);
      }
      toast({
        title: 'Success',
        description: '10,000 SC added to your account.',
      });
    } catch (error) {
      console.error("Error adding coins: ", error);
      toast({
        title: 'Error',
        description: 'Could not add coins to your account.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingCoins(false);
    }
  };
  
  const handleExchange = async (scAmount: number, usdAmount: number) => {
    router.push(`/exchange/confirm?sc=${scAmount}&usd=${usdAmount}`);
  };

  return (
    <PageShell>
      <div className="absolute top-0 left-0 flex items-center justify-between w-full max-w-6xl px-4 md:px-6 py-4 mx-auto">
        <Avatar>
          <AvatarFallback>MX</AvatarFallback>
        </Avatar>
        <MainNav />
      </div>
      <div className="grid gap-8 max-w-xl mx-auto w-full pt-16">
        {/* Step 1: Account Settings */}
        <Card>
          <form onSubmit={handleSaveAccountInfo}>
            <CardHeader>
              <CardTitle>Step 1: Account Settings</CardTitle>
              <CardDescription>Manage your account details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="username" type="text" placeholder="Your username" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-10" disabled={!user || isLoading} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Password</Label>
                <Button type="button" variant="outline" className="w-full justify-start" onClick={handlePasswordReset} disabled={!user || isLoading}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <p className="text-xs text-muted-foreground">A password reset link will be sent to your email.</p>
              </div>
              <div className="space-y-1.5">
                <Label>MXRacehub Link</Label>
                <div className="flex items-center space-x-2 text-sm text-green-400 p-3 bg-muted rounded-md">
                  <CheckCircle className="h-5 w-5" />
                  <span>Account linked successfully</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSavingAccount || !user || isLoading}>
                {isSavingAccount && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isSavingAccount ? 'Saving...' : 'Save Account Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Step 2: Bank Account Information */}
        <Card>
            <CardHeader>
              <CardTitle>Step 2: Bank Account Information</CardTitle>
              <CardDescription>
                Manage your bank account for USD withdrawals.
              </CardDescription>
            </CardHeader>
            <CardContent>
            {userData?.plaidItemId ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-md bg-muted">
                        <div>
                            <p className="font-medium">{bankInfo.bankName}</p>
                            <p className="text-sm text-muted-foreground">**** **** **** {bankInfo.accountNumber}</p>
                        </div>
                        <Button variant="outline" disabled>Linked</Button>
                    </div>
                </div>
            ) : (
                <Button onClick={() => open()} disabled={!ready || isSaving} className="w-full">
                    {isSaving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Banknote className="mr-2 h-4 w-4" />}
                    {isSaving ? 'Linking...' : 'Link Bank Account'}
                </Button>
            )}
            </CardContent>
        </Card>

        {/* Step 3: Load Sweeps Coins */}
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Load Sweeps Coins</CardTitle>
            <CardDescription>
              Simulate loading coins from MXRacehub.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleAddCoins} disabled={isAddingCoins || !user}>
              {isAddingCoins ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Coins className="mr-2 h-4 w-4" />}
              {isAddingCoins ? 'Loading...' : 'Load 10,000 SC'}
            </Button>
          </CardContent>
        </Card>
        
        {/* Step 4: Balances */}
        <div className="grid gap-4 sm:grid-cols-2">
            <BalanceCard currency="SC" amount={userData?.sweepsCoins ?? 0} isLoading={isLoading} />
            <BalanceCard currency="USD" amount={userData?.usdBalance ?? 0} isLoading={isLoading} />
        </div>

        {/* Step 5: Exchange */}
        <ExchangeForm 
            onExchange={handleExchange} 
            sweepsCoinsBalance={userData?.sweepsCoins ?? 0} 
            disabled={!user || isLoading}
        />
      </div>
    </PageShell>
  );
}
