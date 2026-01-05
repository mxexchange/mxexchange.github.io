
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
import { LoaderCircle, Banknote, User, Hash, Coins } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Skeleton } from '@/components/ui/skeleton';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { ExchangeForm } from '@/components/dashboard/exchange-form';

interface UserData {
  username: string;
  sweepsCoins: number;
  usdBalance: number;
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
  const [isAddingCoins, setIsAddingCoins] = useState(false);
  const { toast } = useToast();

  const fetchUserData = async (currentUser: FirebaseUser) => {
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
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser);
      } else {
        setUser(null);
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveBankInfo = async (e: React.FormEvent) => {
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
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        sweepsCoins: increment(10000)
      });
      await fetchUserData(user); // Re-fetch user data to update UI
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
    if (!user || !userData) {
      toast({ title: 'You must be logged in to make an exchange.', variant: 'destructive' });
      return;
    }

    if (userData.sweepsCoins < scAmount) {
      toast({ title: 'Insufficient Sweeps Coins', description: 'You do not have enough SC to complete this exchange.', variant: 'destructive' });
      return;
    }

    try {
      const batch = writeBatch(db);
      const userDocRef = doc(db, 'users', user.uid);

      batch.update(userDocRef, {
        sweepsCoins: increment(-scAmount),
        usdBalance: increment(usdAmount),
      });

      // Here you would typically create a transaction record as well
      // For now, we just update the balances.

      await batch.commit();
      await fetchUserData(user); // Re-fetch data to update UI

      toast({
        title: 'Exchange Successful',
        description: `You have exchanged ${scAmount.toLocaleString()} SC for $${usdAmount.toFixed(2)}.`,
      });
    } catch (error) {
      console.error("Error during exchange: ", error);
      toast({ title: 'Exchange Failed', description: 'An error occurred during the exchange.', variant: 'destructive' });
    }
  };

  const handleBankInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBankInfo((prev) => ({ ...prev, [id]: value }));
  };


  return (
    <PageShell>
        <div className="absolute top-0 left-0 flex items-center justify-between w-full max-w-6xl px-4 md:px-6 py-4 mx-auto">
             <Avatar>
                <AvatarFallback>MX</AvatarFallback>
            </Avatar>
            <MainNav />
        </div>
        <div className="grid gap-4 md:gap-8 max-w-6xl mx-auto w-full pt-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <BalanceCard currency="SC" amount={userData?.sweepsCoins ?? 0} isLoading={isLoading} />
              <BalanceCard currency="USD" amount={userData?.usdBalance ?? 0} isLoading={isLoading} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
                 <div className="lg:col-span-3 grid gap-4">
                    <ExchangeForm 
                        onExchange={handleExchange} 
                        sweepsCoinsBalance={userData?.sweepsCoins ?? 0} 
                        disabled={!user || isLoading}
                    />
                     <Card>
                        <CardHeader>
                          <CardTitle>Load Sweeps Coins</CardTitle>
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
                </div>
                <div className="lg:col-span-2">
                    <Card>
                      <form onSubmit={handleSaveBankInfo}>
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
                                onChange={handleBankInfoChange}
                                className="pl-10"
                                disabled={!user || isLoading}
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
                                onChange={handleBankInfoChange}
                                className="pl-10"
                                disabled={!user || isLoading}
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
                                onChange={handleBankInfoChange}
                                className="pl-10"
                                disabled={!user || isLoading}
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
                                onChange={handleBankInfoChange}
                                className="pl-10"
                                disabled={!user || isLoading}
                              />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isSaving || !user || isLoading}
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
            </div>
        </div>
    </PageShell>
  );
}
