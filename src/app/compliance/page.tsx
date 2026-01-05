'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, LoaderCircle, ShieldAlert } from 'lucide-react';
import { analyzeTransactions } from '@/lib/actions';
import type { AnalyzeTransactionsOutput } from '@/ai/flows/compliance-tool-suspicious-transactions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

export default function CompliancePage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeTransactionsOutput | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeTransactions();
      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete',
        description: `${result.flaggedTransactions.length} transactions flagged for review.`,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not complete the compliance analysis.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const flaggedIds = new Set(analysisResult?.flaggedTransactions.map(t => t.transactionId) || []);

  return (
    <PageShell>
      <div className="grid gap-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Compliance Tool</h1>
                <p className="text-muted-foreground">Monitor and analyze transactions for suspicious activity.</p>
            </div>
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldAlert className="mr-2 h-4 w-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Transactions'}
          </Button>
        </div>

        {analysisResult && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.complianceReport}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Flagged Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult.flaggedTransactions.length > 0 ? (
                  <ul className="space-y-2">
                    {analysisResult.flaggedTransactions.map((tx) => (
                      <li key={tx.transactionId} className="text-sm">
                        <strong className="font-mono text-primary/80">{tx.transactionId}:</strong>{' '}
                        <span className="text-muted-foreground">{tx.reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>All Clear!</AlertTitle>
                    <AlertDescription>
                      No transactions were flagged in the latest analysis.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              A complete record of all account activity for analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">SC Amount</TableHead>
                  <TableHead className="text-right">USD Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx) => (
                  <TableRow key={tx.id} className={cn(flaggedIds.has(tx.id) && 'bg-destructive/10')}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                       {flaggedIds.has(tx.id) && <ShieldAlert className="inline h-4 w-4 mr-2 text-destructive" />}
                      {tx.id}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                        {tx.userId}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium capitalize">{tx.type}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(tx.status)}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono flex justify-end items-center gap-1">
                      {tx.amountSC.toLocaleString()}
                      <SweepsCoinIcon className="h-3 w-3" />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {tx.amountUSD.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
