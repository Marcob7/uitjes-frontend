export const runtime = "edge";

import { redirect } from "next/navigation";

type FestivalsIndexPageProps = {
  searchParams?: {
    query?: string;
  };
};

export default function FestivalsIndexPage({
  searchParams,
}: FestivalsIndexPageProps) {
  const query = searchParams?.query?.trim();

  if (query) {
    redirect(`/festivals/lijst?query=${encodeURIComponent(query)}`);
  }

  redirect("/festivals/kalender");
}
