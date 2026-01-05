import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';
import { SweepsCoinIcon } from '../icons';

interface BalanceCardProps {
  currency: 'SC' | 'USD';
  amount: number;
}

export function BalanceCard({ currency, amount }: BalanceCardProps) {
  const isUSD = currency === 'USD';
  const Icon = isUSD ? CircleDollarSign : SweepsCoinIcon;
  const title = isUSD ? 'USD Balance' : 'Sweeps Coin Balance';
  const formattedAmount = isUSD
    ? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    : amount.toLocaleString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedAmount}</div>
        <p className="text-xs text-muted-foreground">
          {isUSD
            ? 'Available for withdrawal'
            : 'Available for exchange'}
        </p>
      </CardContent>
    </Card>
  );
}
