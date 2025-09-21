import type { Metadata } from 'next';
import { Inter, Nunito_Sans } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import ThemeProvider from '@/app/providers/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'ShiftWise - Smart Budgeting for Irregular Income',
  description:
    'Finally, a budgeting app designed for shift workers. Align your budget with your paychecks, track your fluctuating income, and build a stable financial future.',
};

const speculationRules = {
  prefetch: [
    {
      source: 'document',
      where: {
        selector_matches:
          ":where(a[href^='/transactions'],a[href^='/budgets'],a[href^='/calendar'],a[href^='/goals'])",
      },
      eagerness: 'moderate',
    },
  ],
  prerender: [
    {
      source: 'list',
      urls: ['/overview'],
      eagerness: 'conservative',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }}
        />
      </head>
      <body
        className={`${inter.variable} ${nunitoSans.variable} font-body antialiased min-h-screen bg-background text-foreground`}
        data-density="comfy"
      >
        <ThemeProvider>
          <AppShell>{children}</AppShell>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
