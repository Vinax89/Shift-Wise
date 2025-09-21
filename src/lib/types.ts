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

export type PayRules = {
    versionId: string;
    effectiveFrom: string;
    baseRate: number;
    overtime: {
        dailyThresholdHrs: number;
        weeklyThresholdHrs: number;
        multiplier: number;
        doubleAfterHrs?: number;
        doubleMultiplier?: number;
    };
    premiums: {
        id: string;
        type: 'window' | 'weekday' | 'holiday';
        days?: number[];
        start?: string;
        end?: string;
        calendar?: 'US_FED';
        mode: 'percent' | 'flat' | 'multiplier';
        value: number;
    }[];
    incentives: {
        id: string;
        label: string;
        amount: number;
    }[];
    rounding: {
        times: 'nearest5min' | 'nearest15min';
        pay: 'cent';
    };
    tz: string;
};

export type ShiftTemplate = {
    id: string;
    name: string;
    start: string; // "HH:mm"
    end: string; // "HH:mm"
    location?: string;
    incentives?: string[];
    premiums?: string[];
    notes?: string;
};

export type Shift = {
    id: string;
    start: number; // timestamp
    end: number; // timestamp
    tz: string;
    templateId?: string;
    payRuleVersion: string;
    incentives?: string[];
    premiums?: string[];
    computed: {
        baseHours: number;
        ot1_5Hours: number;
        ot2_0Hours: number;
        premiumPay: number;
        incentivePay: number;
        gross: number;
    };
    notes?: string;
    periodId: string;
    source: 'manual' | 'ics' | 'nlp';
};

export type Subscription = {
    id: string;
    name: string;
    amount: number;
    rrule: string;
    categoryId: string;
    status: 'active' | 'canceled';
    cancelAt?: number | null;
};
