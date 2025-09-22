'use client';
import Link from 'next/link';
import { GlassNav } from '@/components/glass/GlassNav';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';

export default function SiteHeader() {
  return (
    <GlassNav
      left={<div className="flex items-center gap-3">
        <Link href="/" className="text-sm font-semibold">Shift Finance</Link>
        <nav className="hidden md:flex items-center gap-3 text-sm text-muted-fg">
          <Link href="/transactions">Transactions</Link>
          <Link href="/budget">Budget</Link>
          <Link href="/calendar">Calendar</Link>
          <Link href="/reports">Reports</Link>
        </nav>
      </div>}
      right={<ThemeSwitcher />}
    />
  );
}
