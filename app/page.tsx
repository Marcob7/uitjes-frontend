import HeroSection from "@/components/home/HeroSection";
import NewMomentSection from "@/components/home/NewMomentSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedSection from "@/components/home/FeaturedSection";
import LocalSection from "@/components/home/LocalSection";


export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#f8f5f3]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/images/home/mobile-page-background.png')] bg-cover bg-top bg-no-repeat opacity-95 md:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,33,8,0.08),rgba(15,33,8,0.2))] md:hidden"
      />

      <div className="relative z-10">
        <HeroSection />
        <NewMomentSection />
        <CategorySection />
        <FeaturedSection />
        <LocalSection />
      </div>
    </main>
  );
}
