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
import { Coins } from 'lucide-react';

export default function DashboardPage() {
  return (
    <PageShell>
      <div className="grid gap-4 md:gap-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BalanceCard currency="SC" amount={150000} />
          <BalanceCard currency="USD" amount={1250.75} />
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
                  <Button className="w-full">
                    <Coins className="mr-2 h-4 w-4" />
                    Load 10,000 SC
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
