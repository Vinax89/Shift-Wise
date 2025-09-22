import { addDays, addMonths, format, getDay, getDate, parseISO } from 'date-fns';
import type { Recurrence } from './types';

export function* occurrences(startISO: string, rule: Recurrence, untilISO: string) {
  let d = parseISO(startISO);
  const until = parseISO(untilISO);
  const interval = (rule as any).interval ?? 1;

  if (rule.freq === 'daily') {
    while (d <= until) { yield format(d, 'yyyy-MM-dd'); d = addDays(d, interval); }
    return;
  }

  if (rule.freq === 'weekly') {
    // Advance to week start
    let cursor = d;
    while (cursor <= until) {
      for (const wd of rule.byWeekday.sort()) {
        const diff = wd - getDay(cursor);
        const hit = addDays(cursor, diff >= 0 ? diff : diff + 7);
        if (hit >= d && hit <= until) yield format(hit, 'yyyy-MM-dd');
      }
      cursor = addDays(cursor, 7 * interval);
    }
    return;
  }

  if (rule.freq === 'monthly') {
    let cursor = d;
    while (cursor <= until) {
      const day = rule.byMonthDay;
      const candidate = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      if (candidate >= d && candidate <= until) yield format(candidate, 'yyyy-MM-dd');
      cursor = addMonths(cursor, interval);
    }
  }
}
