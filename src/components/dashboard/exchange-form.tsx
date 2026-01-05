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
import { useToast } from '@/hooks/use-toast';

interface ExchangeFormProps {
  onExchange: (scAmount: number, usdAmount: number) => Promise<void>;
  sweepsCoinsBalance: number;
  disabled?: boolean;
}

export function ExchangeForm({ onExchange, sweepsCoinsBalance, disabled = false }: ExchangeFormProps) {
  const [scAmount, setScAmount] = useState('');
  const [isExchanging, setIsExchanging] = useState(false);
  const { toast } = useToast();

  const usdAmount = scAmount
    ? (parseFloat(scAmount) * SWEEPS_COIN_TO_USD_RATE).toFixed(2)
    : '0.00';

  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    const scAmountNum = parseFloat(scAmount);
    const usdAmountNum = parseFloat(usdAmount);

    if (scAmountNum <= 0 || isNaN(scAmountNum)) {
        toast({ title: 'Invalid Amount', description: 'Please enter a positive amount of Sweeps Coins.', variant: 'destructive'});
        return;
    }

    if (scAmountNum > sweepsCoinsBalance) {
        toast({ title: 'Insufficient Balance', description: 'You cannot exchange more Sweeps Coins than you have.', variant: 'destructive'});
        return;
    }

    setIsExchanging(true);
    await onExchange(scAmountNum, usdAmountNum);
    setIsExchanging(false);
    setScAmount('');
  };

  return (
    <Card>
      <form onSubmit={handleExchange}>
        <CardHeader>
          <CardTitle>Exchange</CardTitle>
          <CardDescription>
            Exchange your Sweeps Coins for USD. Rate: 100 SC = $1 USD.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="sc-amount">Sweeps Coins</Label>
                <Input
                  id="sc-amount"
                  type="number"
                  placeholder="Amount of SC to exchange"
                  value={scAmount}
                  onChange={(e) => setScAmount(e.target.value)}
                  disabled={disabled || isExchanging}
                />
                 <p className="text-xs text-muted-foreground">
                    Available: {sweepsCoinsBalance.toLocaleString()} SC
                </p>
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
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={disabled || !scAmount || parseFloat(scAmount) <= 0 || isExchanging}
          >
            {isExchanging && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isExchanging ? 'Exchanging...' : 'Confirm Exchange'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
