export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
};

export type CalendarEvent = {
  date: Date;
  title: string;
  type: 'payday' | 'bill' | 'shift';
};
