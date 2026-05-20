import { InspirationChoiceFlow } from "@/components/inspiration/InspirationChoiceFlow";

type PageProps = {
  searchParams?: {
    category?: string;
    location?: string;
    nearbyCity?: string;
  };
};

export const runtime = "edge";

export default function InspiratiePage({ searchParams }: PageProps) {
  return (
    <InspirationChoiceFlow
      initialCategory={searchParams?.category ?? ""}
      initialLocation={searchParams?.location ?? ""}
      initialNearbyCity={searchParams?.nearbyCity ?? ""}
    />
  );
}
