import { PageShell } from '@/components/page-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { mockTransactions } from '@/lib/data';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/lib/definitions';
import { SweepsCoinIcon } from '@/components/icons';

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

export default function HistoryPage() {
  return (
    <PageShell>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A complete record of all your account activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  ID
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">SC Amount</TableHead>
                <TableHead className="text-right">USD Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                    {tx.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium capitalize">{tx.type}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(tx.status)}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(tx.date), 'PPpp')}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-mono flex justify-end items-center gap-1',
                      tx.amountSC > 0 ? 'text-green-400' : tx.amountSC < 0 ? 'text-red-400' : ''
                    )}
                  >
                    {tx.amountSC.toLocaleString()}
                    <SweepsCoinIcon className="h-3 w-3" />
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-mono',
                      tx.amountUSD > 0 ? 'text-green-400' : tx.amountUSD < 0 ? 'text-red-400' : ''
                    )}
                  >
                    {tx.amountUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}
