
const currencyCache = new Map<string, Intl.NumberFormat>();
export function fmtCurrency(n: number, currency = 'USD', locale?: string) {
  const key = `${currency}:${locale||''}`;
  let fmt = currencyCache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
    currencyCache.set(key, fmt);
  }
  return fmt.format(n);
}
export const fmtInt = (n: number) => new Intl.NumberFormat().format(Math.round(n));
