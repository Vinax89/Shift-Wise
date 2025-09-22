export const CATEGORIES = [
  'Income','Groceries','Transport','Dining','Housing','Utilities','Health','Subscriptions',
  'Shopping','Entertainment','Education','Fees','Transfers','Savings','Investments','Gifts',
  'Travel','Insurance','Taxes','Uncategorized',
] as const;
export type Category = typeof CATEGORIES[number];
