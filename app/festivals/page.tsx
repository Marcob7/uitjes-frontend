export const runtime = "edge";

import {
  redirectToFestivalCalendar,
  type FestivalRedirectSearchParams,
} from "./redirectToFestivalCalendar";

type FestivalsIndexPageProps = {
  searchParams?: FestivalRedirectSearchParams;
};

export default function FestivalsIndexPage({
  searchParams = {},
}: FestivalsIndexPageProps) {
  redirectToFestivalCalendar(searchParams);
}
