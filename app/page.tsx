import NewHomeSection from "@/components/home/NewHomeSection";
import NewMomentSection from "@/components/home/NewMomentSection";
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
      <NewHomeSection />

      <NewMomentSection />
      <AgendaSection />

  
      <HomeCitiesShowcaseSection />
    </main>
  );
}
