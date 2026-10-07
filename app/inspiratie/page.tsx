import { InspirationChoiceFlow } from "@/components/inspiration/InspirationChoiceFlow";

export const metadata = {
  title: "Ideeën voor je volgende uitje | Uitjes",
  description:
    "Vind ideeën voor een dagje uit. Kies wat bij je moment past en ontdek activiteiten in de buurt.",
  alternates: {
    canonical: "/inspiratie",
  },
  openGraph: {
    title: "Ideeën voor je volgende uitje | Uitjes",
    description:
      "Vind ideeën voor een dagje uit en ontdek activiteiten die bij je moment passen.",
    url: "/inspiratie",
  },
};

type PageProps = {
  searchParams?: {
    city?: string;
    location?: string;
    nearbyCity?: string;
  };
};

export const runtime = "edge";

export default function InspiratiePage({ searchParams }: PageProps) {
  return (
    <InspirationChoiceFlow
      initialCity={searchParams?.city ?? ""}
      initialLocation={searchParams?.location ?? ""}
      initialNearbyCity={searchParams?.nearbyCity ?? ""}
    />
  );
}
