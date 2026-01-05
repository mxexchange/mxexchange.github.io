
import { PageShell } from '@/components/page-shell';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <PageShell className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground">
          <p>
            Welcome to MX Exchange. We are committed to protecting your privacy
            and handling your data in an open and transparent manner. This
            privacy policy sets out how we collect, use, and safeguard your
            information when you use our application.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              1. Information We Collect
            </h2>
            <p>
              We may collect and process the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Personal Identification Information:</strong> Your name,
                email address, and username, which are collected when you
                register and create an account.
              </li>
              <li>
                <strong>Financial Information:</strong> Your Sweeps Coin and USD
                balances, transaction history (exchanges, deposits,
                withdrawals), and withdrawal information such as bank account
                details.
              </li>
              <li>
                <strong>Technical Data:</strong> We may collect information about
                your device and how you interact with our service, including IP
                address and browser type, through standard logs.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain our service.</li>
              <li>To manage your account and transactions.</li>
              <li>To process withdrawals and exchanges.</li>
              <li>
                To comply with legal and regulatory obligations, including using
                our compliance tool to monitor for suspicious activity.
              </li>
              <li>
                To communicate with you, including sending password reset emails
                and important service announcements.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              3. Data Storage and Security
            </h2>
            <p>
              Your data is securely stored using Google Cloud's Firebase
              services (Authentication and Firestore). We implement security
              measures, including Firestore Security Rules, to protect your data
              from unauthorized access. While we strive to use commercially
              acceptable means to protect your Personal Information, no method
              of transmission over the Internet or method of electronic storage
              is 100% secure.
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              4. Third-Party Services
            </h2>
            <p>
              We utilize third-party services to provide our application's functionality.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Firebase (Google):</strong> Used for authentication, database (Firestore), and hosting. Your data is subject to Google's Privacy Policy.
              </li>
               <li>
                <strong>Google AI (Gemini):</strong> Our compliance tool uses Google's AI services to analyze transaction data for security purposes. The data sent for analysis is limited to non-personally identifiable transaction details.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              5. Your Rights
            </h2>
            <p>
              You have the right to access, update, or delete the information we
              have on you. You can manage your account information directly from
              the 'Account' page. If you wish to delete your account entirely,
              please contact us.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              6. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
              You are advised to review this Privacy Policy periodically for any
              changes.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              7. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, you can
              contact us by visiting the contact page on our website.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
