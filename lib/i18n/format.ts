import { localeToIntl, type Locale } from "./config";

export function formatDate(value: Date | string | number, locale: Locale, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat(localeToIntl[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(value));
}

export function formatNumber(value: number, locale: Locale, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(localeToIntl[locale], options).format(value);
}

export function formatRating(value: number, locale: Locale) {
  return formatNumber(value, locale, { maximumFractionDigits: 1 });
}

export function formatCurrency(value: number, locale: Locale, currency = "EUR") {
  return formatNumber(value, locale, { style: "currency", currency });
}
