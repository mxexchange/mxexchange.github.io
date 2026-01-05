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
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MainNav } from '@/components/main-nav';

interface UserData {
  username: string;
  sweepsCoins: number;
  usdBalance: number;
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      }
      setIsLoading(false);
    };

    if (!isUserLoading) {
      fetchUserData();
    }
  }, [user, isUserLoading, firestore]);


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
          <BalanceCard currency="SC" amount={userData?.sweepsCoins ?? 0} isLoading={isLoading || isUserLoading} />
          <BalanceCard currency="USD" amount={userData?.usdBalance ?? 0} isLoading={isLoading || isUserLoading} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:gap-8">
            <RecentTransactions />
        </div>
      </div>
    </PageShell>
  );
}
