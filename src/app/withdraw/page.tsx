'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
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
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();
  const currentBalance = 1250.75;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive amount to withdraw.',
        variant: 'destructive',
      });
      return;
    }

    if (withdrawAmount > currentBalance) {
      toast({
        title: 'Insufficient Funds',
        description: 'You cannot withdraw more than your available balance.',
        variant: 'destructive',
      });
      return;
    }

    setIsWithdrawing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsWithdrawing(false);

    toast({
      title: 'Withdrawal Initiated',
      description: `Your withdrawal of $${withdrawAmount.toFixed(2)} is being processed.`,
    });

    setAmount('');
    setMethod('');
  };

  return (
    <PageShell>
      <div className="mx-auto grid w-full max-w-xl gap-4">
        <Card>
          <form onSubmit={handleWithdraw}>
            <CardHeader>
              <CardTitle>Withdraw USD</CardTitle>
              <CardDescription>
                Transfer funds to your external payment method. Your available balance is ${currentBalance.toFixed(2)}.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="method">Payment Method</Label>
                <Input
                  id="method"
                  type="text"
                  placeholder="e.g., PayPal email or Bank Account"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isWithdrawing || !amount || !method}
              >
                {isWithdrawing && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isWithdrawing ? 'Processing...' : 'Request Withdrawal'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}
