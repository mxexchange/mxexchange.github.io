'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { SWEEPS_COIN_TO_USD_RATE } from '@/lib/constants';
import { ArrowRight, LoaderCircle } from 'lucide-react';

export function ExchangeForm() {
  const [scAmount, setScAmount] = useState('');
  const [isExchanging, setIsExchanging] = useState(false);
  const usdAmount = scAmount
    ? (parseFloat(scAmount) * SWEEPS_COIN_TO_USD_RATE).toFixed(2)
    : '0.00';

  const handleExchange = async () => {
    setIsExchanging(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsExchanging(false);
    setScAmount('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exchange</CardTitle>
        <CardDescription>
          Exchange your Sweeps Coins for USD. Rate: 100 SC = $1 USD.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="sc-amount">Sweeps Coins</Label>
              <Input
                id="sc-amount"
                type="number"
                placeholder="Amount of SC to exchange"
                value={scAmount}
                onChange={(e) => setScAmount(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="usd-amount">USD Value</Label>
              <div
                id="usd-amount"
                className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm"
              >
                ${usdAmount}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleExchange}
          disabled={!scAmount || parseFloat(scAmount) <= 0 || isExchanging}
        >
          {isExchanging && (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isExchanging ? 'Exchanging...' : 'Confirm Exchange'}
        </Button>
      </CardFooter>
    </Card>
  );
}
