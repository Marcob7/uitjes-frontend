export const runtime = "edge";

import {
  redirectToFestivalCalendar,
  type FestivalRedirectSearchParams,
} from "../redirectToFestivalCalendar";

type FestivalsPageProps = {
  searchParams?: FestivalRedirectSearchParams;
};

export default function FestivalsPage({
  searchParams = {},
}: FestivalsPageProps) {
  redirectToFestivalCalendar(searchParams);
}
