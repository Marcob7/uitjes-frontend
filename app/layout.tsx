import "./globals.css";
//import { FavoritesProvider } from "@/components/FavouritesProvider";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import InspirationCardsSection from "@/components/InspirationCardsSection";
import TrustedSection from "@/components/TrustedSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import FeatureCardsSection from "@/components/FeatureCardsSection";
import TestimonialSection from "@/components/TestimonialSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Uitjesplatform",
  description: "Ontdek leuke uitjes, evenementen en activiteiten bij jou in de buurt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="bg-white text-neutral-900 antialiased">
        <SiteHeader />
        <HeroSection />
        <InspirationCardsSection />
        <TrustedSection />
        <ShowcaseSection />
        <FeatureCardsSection />
        <TestimonialSection />
        <FinalCtaSection />

     

        <SiteFooter />
      </body>
    </html>
  );
}