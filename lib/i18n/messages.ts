import { defaultLocale, type Locale } from "./config";

import commonEn from "@/messages/en/common.json";
import commonNl from "@/messages/nl/common.json";

const commonMessages = {
  nl: commonNl,
  en: commonEn,
} satisfies Record<Locale, typeof commonNl>;

export function getCommonMessages(locale: Locale = defaultLocale) {
  return commonMessages[locale];
}

type MessageValues = Record<string, string | number>;

/**
 * Resolves a dot-notated UI key from the central dictionary.  Returning the
 * key is intentional: a missing translation must not result in an empty
 * control or a rendering error while it is being added to the dictionary.
 */
export function translate(locale: Locale, key: string, values: MessageValues = {}) {
  const value = key.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object") return (current as Record<string, unknown>)[segment];
    return undefined;
  }, getCommonMessages(locale));

  if (typeof value !== "string") return key;

  return value.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match,
  );
}
