
import { PageShell } from '@/components/page-shell';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PoliciesPage() {
  return (
    <PageShell className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Our Policies</CardTitle>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-8 text-sm text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              1. Introduction & Terms of Service
            </h2>
            <p>
              Welcome to MX Exchange ("the Platform"). These policies govern your use of our services for exchanging Sweeps Coins (SC) for US Dollars (USD). By creating an account and using our platform, you agree to be bound by these policies and our Privacy Policy. Failure to comply may result in account suspension or termination.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              2. Account Responsibility
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Eligibility:</strong> You must be of legal age in your jurisdiction to use our service.
              </li>
              <li>
                <strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your account credentials (password, etc.). You must notify us immediately of any unauthorized use of your account.
              </li>
              <li>
                <strong>Accurate Information:</strong> You agree to provide and maintain accurate, current, and complete information, including your MXRacehub account details and banking information for withdrawals.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              3. Exchange and Withdrawal Policies
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Exchange Rate:</strong> The exchange rate between Sweeps Coins and USD is set by the Platform and is subject to change. The current effective rate is displayed on the exchange interface. All transactions are final once confirmed.
              </li>
              <li>
                <strong>Withdrawals:</strong> USD funds may be withdrawn to a verified bank account. We are not responsible for any delays or issues caused by incorrect banking information provided by you.
              </li>
              <li>
                <strong>Processing Times:</strong> Withdrawal requests are processed during business hours and may take several business days to complete.
              </li>
            </ul>
          </section>
          
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              4. Prohibited Activities
            </h2>
             <p>
              Engaging in any of the following activities is strictly prohibited and will lead to immediate account review and potential termination:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Fraud:</strong> Any attempt to defraud the platform or other users, including using stolen credentials or exploiting bugs.
              </li>
               <li>
                <strong>Automation:</strong> Using scripts, bots, or any other form of automation to interact with the platform is not allowed.
              </li>
              <li>
                <strong>Money Laundering:</strong> Using the service to conceal the origins of illegally obtained funds.
              </li>
              <li>
                <strong>Multiple Accounts:</strong> Operating more than one account without explicit permission from platform administrators.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              5. Compliance & Monitoring
            </h2>
            <p>
              To maintain the integrity of our platform and comply with regulations, we actively monitor transactions for suspicious activity. We reserve the right to flag, suspend, or investigate any transaction that our compliance tools identify as unusual, large, or potentially fraudulent. We may require additional information from you to complete our investigation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              6. Limitation of Liability
            </h2>
            <p>
              MX Exchange is provided on an "as-is" and "as-available" basis. We do not guarantee that the service will be uninterrupted or error-free. We are not liable for any losses incurred due to market fluctuations, technical issues, or actions taken in accordance with these policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              7. Amendments
            </h2>
            <p>
              We reserve the right to amend these policies at any time. We will notify you of any significant changes by posting the new policies on this page. Your continued use of the platform after such changes constitutes your acceptance of the new policies.
            </p>
          </section>
        </CardContent>
      </Card>
    </PageShell>
  );
}
