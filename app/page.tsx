import HomeSceneSection from "@/components/home/HomeSceneSection";
import NewHomeSection from "@/components/home/NewHomeSection";
import NewMomentSection from "@/components/home/NewMomentSection";
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
    <main className="min-h-screen bg-[#f8f5f3]">
      <HomeSceneSection
        description="Van verborgen lokale plekken tot festivals, restaurants en spontane plannen. Ontdek activiteiten die passen bij jouw stemming, locatie en moment."
      />
      <NewHomeSection />

      <PlansFallenThroughSection />
      <NewMomentSection />
      <AgendaSection />

  
      <HomeCitiesShowcaseSection />
    </main>
  );
}
