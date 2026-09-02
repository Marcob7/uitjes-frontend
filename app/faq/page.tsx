import FaqPageClient from "./FaqPageClient";
import { faqItems } from "@/lib/faq";

export const metadata = {
  title: "Veelgestelde vragen | UitjesNL",
  description:
    "Lees hoe UitjesNL werkt, hoe je zoekt, steden kiest, favorieten bewaart en waar informatie over uitjes en evenementen vandaan komt.",
  alternates: {
    canonical: "/faq",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
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
