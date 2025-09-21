import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaxVisualizer } from '@/components/taxes/tax-visualizer';

export default function TaxesPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">Tax Burden Visualizer</CardTitle>
            <CardDescription>
                Enter your ZIP code to get an AI-powered estimate of your federal, state, and local tax burden.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <TaxVisualizer />
        </CardContent>
    </Card>
  );
}
