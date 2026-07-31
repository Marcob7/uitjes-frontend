import { InspirationChoiceFlow } from "@/components/inspiration/InspirationChoiceFlow";

export const metadata = {
  title: "Inspiratie voor je volgende uitje | Uitjes",
  description:
    "Beantwoord een paar keuzes en ontdek ideeën voor je volgende uitje.",
  alternates: {
    canonical: "/inspiratie",
  },
};

type PageProps = {
  searchParams?: {
    category?: string;
    city?: string;
    location?: string;
    nearbyCity?: string;
  };
};

export const runtime = "edge";

export default function InspiratiePage({ searchParams }: PageProps) {
  return (
    <InspirationChoiceFlow
      initialCategory={searchParams?.category ?? ""}
      initialCity={searchParams?.city ?? ""}
      initialLocation={searchParams?.location ?? ""}
      initialNearbyCity={searchParams?.nearbyCity ?? ""}
    />
  );
}
