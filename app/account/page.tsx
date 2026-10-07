import type { Metadata } from "next";

import AccountPageClient from "./AccountPageClient";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import { getLocaleAlternates, getLocaleOpenGraph } from "@/lib/i18n/seo";
import { translate } from "@/lib/i18n/messages";

export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const pathname = getRequestPathname();
  const title = `${translate(locale, "auth.account")} | Uitjes`;
  const description = translate(locale, "auth.profileIntro");
  return { title, description, alternates: getLocaleAlternates(pathname, locale), openGraph: { title, description, ...getLocaleOpenGraph(locale, pathname) } };
}

export default function AccountPage() {
  return <AccountPageClient />;
}
