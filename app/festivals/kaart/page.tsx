export const runtime = "edge";

import {
  redirectToFestivalCalendar,
  type FestivalRedirectSearchParams,
} from "../redirectToFestivalCalendar";

type FestivalsMapPageProps = {
  searchParams?: FestivalRedirectSearchParams;
};

export default function FestivalsMapPage({
  searchParams = {},
}: FestivalsMapPageProps) {
  redirectToFestivalCalendar(searchParams);
}
