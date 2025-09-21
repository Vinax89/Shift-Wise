import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark } from 'lucide-react';

export default function AccountsPage() {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <Landmark className="h-8 w-8" />
                </div>
                <CardTitle className="font-headline mt-4">Connect Your Bank Account</CardTitle>
                <CardDescription>
                    Securely connect your bank accounts via Plaid to automatically import transactions and keep your finances up-to-date.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <Button size="lg">
                    Connect with Plaid
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                    By connecting your account, you agree to Plaid’s Privacy Policy.
                </p>
            </CardContent>
        </Card>
    );
}
