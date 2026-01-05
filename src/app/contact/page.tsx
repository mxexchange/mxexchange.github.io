
import { PageShell } from '@/components/page-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <PageShell className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Have questions or need support? Reach out to us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Mail className="h-6 w-6" />
            <a
              href="mailto:mxexchange@proton.me"
              className="font-medium text-primary hover:underline"
            >
              mxexchange@proton.me
            </a>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
