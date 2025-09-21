import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Welcome to ShiftWise</h1>
        <p className="text-muted-foreground mt-2">
          Let's get you set up. A few details will help us tailor the app to your needs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Income</CardTitle>
          <CardDescription>Tell us about how you get paid.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pay-rate">Default Pay Rate (per hour)</Label>
              <Input id="pay-rate" type="number" placeholder="e.g., 25.50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pay-schedule">Pay Schedule</Label>
              <Select>
                <SelectTrigger id="pay-schedule">
                  <SelectValue placeholder="Select a schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="semimonthly">Semi-monthly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
           <p className="text-xs text-muted-foreground pt-2">You can add shift differentials and other pay variations later.</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Your Location & Taxes</CardTitle>
          <CardDescription>This helps us estimate your tax burden.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip-code">ZIP Code</Label>
              <Input id="zip-code" placeholder="e.g., 90210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filing-status">Tax Filing Status</Label>
              <Select>
                <SelectTrigger id="filing-status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married_jointly">Married filing jointly</SelectItem>
                  <SelectItem value="married_separately">Married filing separately</SelectItem>
                  <SelectItem value="hoh">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
          <Button size="lg">Complete Setup</Button>
      </div>
    </div>
  );
}
