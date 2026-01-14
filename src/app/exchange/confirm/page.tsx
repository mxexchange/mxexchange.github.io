'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, writeBatch, increment } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoaderCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { SweepsCoinIcon } from '@/components/icons';
import { SWEEPS_COIN_TO_USD_RATE } from '@/lib/constants';

interface UserData {
  sweepsCoins: number;
}

function ConfirmExchangeComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scAmountStr = searchParams.get('sc');
  const usdAmountStr = searchParams.get('usd');

  const scAmount = scAmountStr ? parseFloat(scAmountStr) : 0;
  const usdAmount = usdAmountStr ? parseFloat(usdAmountStr) : 0;
  const exchangeFee = usdAmount * 0.02;
  const netUsdAmount = usdAmount - exchangeFee;

  useEffect(() => {
    if (!scAmount || !usdAmount || scAmount * SWEEPS_COIN_TO_USD_RATE !== usdAmount) {
      setError('Invalid exchange amounts provided.');
    }

    const fetchInitialData = async (currentUser: FirebaseUser) => {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        setUserData(data);
        if (data.sweepsCoins < scAmount) {
          setError('You do not have enough Sweeps Coins to complete this exchange.');
        }
      } else {
        setError('Could not find user data.');
      }
      setIsLoading(false);
    };

    if (!isUserLoading) {
      if (user) {
        fetchInitialData(user);
      } else {
        router.push('/sign-in');
      }
    }

  }, [isUserLoading, user, router, scAmount, usdAmount, firestore]);

  const handleFinalizeExchange = async () => {
    if (!user || !userData || error) return;

    setIsConfirming(true);
    try {
      const batch = writeBatch(firestore);
      const userDocRef = doc(firestore, 'users', user.uid);
      const houseAccountRef = doc(firestore, 'system', 'houseAccount');

      batch.update(userDocRef, {
        sweepsCoins: increment(-scAmount),
        usdBalance: increment(netUsdAmount),
      });

      batch.set(houseAccountRef, { 
        balance: increment(exchangeFee) 
      }, { merge: true });

      await batch.commit();

      toast({
        title: 'Exchange Successful',
        description: `You have exchanged ${scAmount.toLocaleString()} SC for $${netUsdAmount.toFixed(2)}. A 2% fee of $${exchangeFee.toFixed(2)} was applied.`,
      });
      router.push('/account');
    } catch (exchangeError) {
      console.error("Error during exchange: ", exchangeError);
      toast({ title: 'Exchange Failed', description: 'An error occurred during the exchange.', variant: 'destructive' });
      setIsConfirming(false);
    }
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive h-6 w-6" />
                    Exchange Error
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive">{error}</p>
            </CardContent>
            <CardFooter>
                 <Button onClick={() => router.push('/account')} className="w-full">
                    Return to Account
                </Button>
            </CardFooter>
        </Card>
    )
  }


  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Confirm Your Exchange</CardTitle>
        <CardDescription>Please review the details below before finalizing your exchange.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-md bg-muted">
            <div className="flex items-center gap-2">
                <SweepsCoinIcon className="h-6 w-6" />
                <span className="font-bold text-lg">{scAmount.toLocaleString()} SC</span>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="font-bold text-lg text-green-400">
                {netUsdAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
            <p>A 2% exchange fee of <strong>${exchangeFee.toFixed(2)}</strong> will be deducted from your exchange amount.</p>
            <p>By clicking "Finalize Exchange", you agree to exchange {scAmount.toLocaleString()} Sweeps Coins for <strong>${netUsdAmount.toFixed(2)}</strong>. This action is irreversible.</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto" disabled={isConfirming}>
            Cancel
        </Button>
        <Button onClick={handleFinalizeExchange} className="w-full sm:w-auto flex-1" disabled={isConfirming || !!error}>
          {isConfirming && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isConfirming ? 'Processing...' : 'Finalize Exchange'}
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function ConfirmExchangePage() {
    return (
        <PageShell className="flex items-center justify-center">
            <Suspense fallback={<LoaderCircle className="h-8 w-8 animate-spin" />}>
                <ConfirmExchangeComponent />
            </Suspense>
        </PageShell>
    )
}
