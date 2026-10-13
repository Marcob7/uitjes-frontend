import FaqPageClient from "./FaqPageClient";
import { getFaqContent } from "@/lib/faq";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import { getLocaleAlternates, getLocaleOpenGraph } from "@/lib/i18n/seo";
import { translate } from "@/lib/i18n/messages";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const pathname = getRequestPathname();
  const title = translate(locale, "faq.metaTitle");
  const description = translate(locale, "faq.metaDescription");
  return { title, description, alternates: getLocaleAlternates(pathname, locale), openGraph: { title, description, ...getLocaleOpenGraph(locale, pathname) } };
}

export default function FaqPage() {
  const locale = getRequestLocale();
  const { items } = getFaqContent(locale);
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqPageClient />
    </>
  );
}
