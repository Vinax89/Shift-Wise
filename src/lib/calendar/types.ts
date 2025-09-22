export type EventKind = 'shift' | 'bill' | 'subscription' | 'payday';
export type CalendarEvent = {
  id?: string;
  uid: string;
  kind: EventKind;
  date: string;        // YYYY-MM-DD
  title: string;
  amount?: number;     // negative for expenses
  meta?: Record<string, any>;
  createdAt?: any;
};

export type Recurrence =
  | { freq: 'weekly'; byWeekday: number[]; interval?: number }
  | { freq: 'monthly'; byMonthDay: number; interval?: number }
  | { freq: 'daily'; interval?: number };
