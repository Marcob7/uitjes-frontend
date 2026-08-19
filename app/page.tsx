import HomeVideoSection from "@/components/home/homeVideoSection";
import CtaBannerSection from "@/components/home/CtaBannerSection";
import PlansFallenThroughSection from "@/components/home/PlansFallenThroughSection";
import AgendaSection from "@/components/home/AgendaSection";
import HomeCitiesShowcaseSection from "@/components/home/HomeCitiesShowcaseSection";

export const metadata = {
  title: "Uitjes plannen in Nederland",
  description:
    "Vind leuke uitjes, activiteiten, festivals en restaurants in Nederlandse steden.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#f8f5f3]">
      <HomeVideoSection />

      <CtaBannerSection />

      <PlansFallenThroughSection />

      <AgendaSection />

      <HomeCitiesShowcaseSection />
    </main>
  );
}
