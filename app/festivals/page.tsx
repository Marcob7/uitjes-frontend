export const runtime = "edge";

import {
  redirectToFestivalCalendar,
  type FestivalRedirectSearchParams,
} from "./redirectToFestivalCalendar";
import { getRequestLocale } from "@/lib/i18n/request";

type FestivalsIndexPageProps = {
  searchParams?: FestivalRedirectSearchParams;
};

export default function FestivalsIndexPage({
  searchParams = {},
}: FestivalsIndexPageProps) {
  redirectToFestivalCalendar(searchParams, getRequestLocale());
}
