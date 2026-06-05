import FestivalsListClient from "./FestivalsListClient";

export const runtime = "edge";

export const metadata = {
  title: "Festivals ontdekken | Uitjes",
  description: "Bekijk festivals en festivaluitjes in Nederland.",
  alternates: {
    canonical: "/festivals/lijst",
  },
};

type FestivalsPageProps = {
  searchParams?: {
    query?: string;
  };
};

export default function FestivalsPage({ searchParams }: FestivalsPageProps) {
  return <FestivalsListClient searchParams={searchParams} />;
}
