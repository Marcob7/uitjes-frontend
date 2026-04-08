import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedSection from "@/components/home/FeaturedSection";
import LocalSection from "@/components/home/LocalSection";


export default function Page() {
  return (
    <main className="min-h-screen bg-[#f8f5f3]">
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
      <LocalSection />
     
    </main>
  );
}