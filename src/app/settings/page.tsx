import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline tracking-tight">Settings</h1>
      
      <Card>
          <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your personal information and profile settings.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">Profile settings will be available here.</p>
          </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">Notification settings will be available here.</p>
          </CardContent>
      </Card>
    </div>
  );
}
