
'use client';

import { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
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
import { LoaderCircle, Banknote, User, Hash } from 'lucide-react';

export default function BankSettingsPage() {
  const [bankInfo, setBankInfo] = useState({
    bankName: 'Global Megabank',
    accountHolder: 'John Doe',
    accountNumber: '**** **** **** 1234',
    routingNumber: '*********',
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch('/api/plaid-link-token', {
        method: 'POST',
      });
      const { link_token } = await response.json();
      setLinkToken(link_token);
    };
    createLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      await fetch('/api/plaid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }),
      });
      toast({
        title: 'Bank Account Linked',
        description: 'Your bank account has been successfully linked.',
      });
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSaving(false);

    toast({
      title: 'Bank Information Saved',
      description: 'Your withdrawal details have been updated successfully.',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setBankInfo((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <PageShell>
      <div className="mx-auto grid w-full max-w-xl gap-4">
        <Card>
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle>Bank Account Information</CardTitle>
              <CardDescription>
                Manage your bank account for USD withdrawals.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <Button onClick={() => open()} disabled={!ready}>
                Link Bank Account
              </Button>
              <div className="space-y-1.5">
                <Label htmlFor="bankName">Bank Name</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="bankName"
                    type="text"
                    placeholder="e.g., Global Megabank"
                    value={bankInfo.bankName}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                 <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="accountHolder"
                    type="text"
                    placeholder="e.g., John Doe"
                    value={bankInfo.accountHolder}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="accountNumber">Account Number</Label>
                 <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="**** **** **** 1234"
                    value={bankInfo.accountNumber}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="routingNumber">Routing Number</Label>
                 <div className="relative">
                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="routingNumber"
                    type="text"
                    placeholder="e.g., 123456789"
                    value={bankInfo.routingNumber}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isSaving}
              >
                {isSaving && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}
