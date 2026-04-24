import HeroSection from "@/components/home/HeroSection";
import NewMomentSection from "@/components/home/NewMomentSection";
import QuickSituationSection from "@/components/home/QuickSituationSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedSection from "@/components/home/FeaturedSection";
import LocalSection from "@/components/home/LocalSection";


export default function Page() {
  return (
    <main className="min-h-screen bg-[#f8f5f3]">
      <HeroSection />
      <NewMomentSection />
      <QuickSituationSection />
      <CategorySection />
      <FeaturedSection />
      <LocalSection />
    </main>
  );
}
