import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import { AppCard, AppSection } from "@/components/ui/app";

export default function OntdekDetailNotFound() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171511]">
      <AppSection maxWidth="default" spacing="sm" innerClassName="pt-6 pb-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Ontdek", href: "/ontdek" },
            { label: "Niet gevonden" },
          ]}
          className="mb-6"
        />

        <AppCard
          variant="elevated"
          padding="lg"
          className="mx-auto max-w-2xl border-[#e6e0d8] bg-white text-[#3f3429]"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a6d60]">
            Niet beschikbaar
          </p>
          <h1 className="mt-2 text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-[#171511]">
            Dit uitje is niet gevonden
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#62594e] sm:text-base">
            Het item is mogelijk verlopen, verborgen of nog niet gepubliceerd.
            Bekijk andere actuele uitjes via Ontdek.
          </p>
          <Link
            href="/ontdek"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/70"
          >
            Terug naar Ontdek
          </Link>
        </AppCard>
      </AppSection>
    </main>
  );
}
