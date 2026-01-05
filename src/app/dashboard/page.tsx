
'use client';

import { PageShell } from '@/components/page-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { ExchangeForm } from '@/components/dashboard/exchange-form';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { Button } from '@/components/ui/button';
import { Coins, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  username: string;
  sweepsCoins: number;
  usdBalance: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCoins, setIsAddingCoins] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      // Re-fetch user data to update UI
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
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

  return (
    <PageShell>
      <div className="grid gap-4 md:gap-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BalanceCard currency="SC" amount={userData?.sweepsCoins ?? 0} isLoading={isLoading} />
          <BalanceCard currency="USD" amount={userData?.usdBalance ?? 0} isLoading={isLoading} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-3">
            <RecentTransactions />
          </div>
          <div className="lg:col-span-2">
            <div className="grid gap-4">
              <ExchangeForm />
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
          </div>
        </div>
      </div>
    </PageShell>
  );
}
