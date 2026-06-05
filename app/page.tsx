import HeroSection from "@/components/home/HeroSection";
import NewMomentSection from "@/components/home/NewMomentSection";
import QuickSituationSection from "@/components/home/QuickSituationSection";
import CategorySection from "@/components/home/CategorySection";
import HomeTestimonialsSection from "@/components/home/HomeTestimonialsSection";
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
      <HeroSection />
      <NewMomentSection />
      <QuickSituationSection />
      <CategorySection />
      <HomeTestimonialsSection />
      <HomeCitiesShowcaseSection />
    </main>
  );
}
