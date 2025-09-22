import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import ThemeProvider from '@/app/providers/theme-provider';
import RouteTransitions from '@/app/providers/route-transitions';
import { inter, nunito } from '@/app/fonts';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'ShiftWise - Smart Budgeting for Irregular Income',
  description:
    'Finally, a budgeting app designed for shift workers. Align your budget with your paychecks, track your fluctuating income, and build a stable financial future.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head />
      <body
        className={`font-sans antialiased min-h-screen bg-background text-foreground`}
        data-density="comfy"
        data-glass="auto"
      >
        <ThemeProvider>
          <RouteTransitions />
          <SiteHeader />
          <AppShell>{children}</AppShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
