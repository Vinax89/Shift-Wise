import { Transaction, Goal, CalendarEvent } from '@/lib/types';
import { subDays, addDays, subMonths, addMonths } from 'date-fns';

const now = new Date();

export const transactions: Transaction[] = [
  {
    id: '1',
    date: subDays(now, 2).toISOString(),
    merchant: 'Paycheck',
    amount: 1250.75,
    category: 'Income',
    type: 'income',
  },
  {
    id: '2',
    date: subDays(now, 3).toISOString(),
    merchant: 'Grocer Fresh',
    amount: -85.4,
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: '3',
    date: subDays(now, 4).toISOString(),
    merchant: 'Edison Power',
    amount: -112.3,
    category: 'Utilities',
    type: 'expense',
  },
  {
    id: '4',
    date: subDays(now, 5).toISOString(),
    merchant: 'The Coffee Stop',
    amount: -5.5,
    category: 'Food',
    type: 'expense',
  },
  {
    id: '5',
    date: subDays(now, 15).toISOString(),
    merchant: 'City Apartments',
    amount: -1500,
    category: 'Rent',
    type: 'expense',
  },
  {
    id: '6',
    date: subDays(now, 16).toISOString(),
    merchant: 'Paycheck',
    amount: 1195.5,
    category: 'Income',
    type: 'income',
  },
  {
    id: '7',
    date: subDays(now, 20).toISOString(),
    merchant: 'Gas & Go',
    amount: -45.21,
    category: 'Transportation',
    type: 'expense',
  },
  {
    id: '8',
    date: subDays(now, 25).toISOString(),
    merchant: 'Internet Co',
    amount: -65.0,
    category: 'Utilities',
    type: 'expense',
  },
];

export const goals: Goal[] = [
  {
    id: 'g1',
    name: 'Vacation to Hawaii',
    targetAmount: 5000,
    currentAmount: 1250,
    deadline: addDays(now, 180).toISOString(),
  },
  {
    id: 'g2',
    name: 'New Laptop',
    targetAmount: 2000,
    currentAmount: 1800,
    deadline: addDays(now, 30).toISOString(),
  },
  {
    id: 'g3',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 4500,
    deadline: addDays(now, 365).toISOString(),
  },
];

export const calendarEvents: CalendarEvent[] = [
  { date: subDays(now, 15), title: 'Rent Due', type: 'bill' },
  { date: subDays(now, 4), title: 'Power Bill', type: 'bill' },
  { date: subDays(now, 2), title: 'Payday', type: 'payday' },
  { date: subDays(now, 16), title: 'Payday', type: 'payday' },
  { date: subDays(now, 1), title: 'Evening Shift', type: 'shift' },
  { date: now, title: 'Day Shift', type: 'shift' },
  { date: addDays(now, 1), title: 'Day Shift', type: 'shift' },
  { date: addDays(now, 4), title: 'Night Shift', type: 'shift' },
  { date: addDays(now, 5), title: 'Night Shift', type: 'shift' },
  { date: addDays(now, 14), title: 'Payday', type: 'payday' },
  { date: addDays(now, 15), title: 'Rent Due', type: 'bill' },
];
