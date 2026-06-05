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
