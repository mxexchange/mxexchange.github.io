import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { mockTransactions } from '@/lib/data';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/lib/definitions';
import { SweepsCoinIcon } from '../icons';
import { CircleDollarSign } from 'lucide-react';

const getStatusVariant = (status: Transaction['status']) => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Failed':
      return 'destructive';
    default:
      return 'outline';
  }
};


export function RecentTransactions() {
  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          A log of your recent account activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="font-medium capitalize">{tx.type}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(tx.status)}>
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell className={cn(
                    'text-right font-mono flex justify-end items-center gap-1',
                    tx.amountSC > 0 || tx.amountUSD > 0 ? 'text-green-400' : 'text-red-400'
                  )}>
                   {tx.amountSC !== 0 ? (
                    <>
                      {tx.amountSC.toLocaleString()}
                      <SweepsCoinIcon className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      {tx.amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </>
                  )}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {format(new Date(tx.date), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter className="justify-center border-t p-4">
          <Button asChild size="sm" variant="ghost" className="w-full">
            <Link href="/history">
              View All Transactions <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
    </Card>
  );
}
