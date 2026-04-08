export type CategoryKey =
  | "events"
  | "attractions"
  | "restaurants"
  | "bars"
  | "thingsToDo";

export type BackendEvent = {
  id: number;
  title: string;
  city: string;
  venue: string | null;
  start_at: string | null;
  end_at: string | null;
  date_text: string | null;
  is_ongoing: boolean;
  is_free: boolean;
  price_min: number | null;
  source_url: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type CityExploreViewProps = {
  city: string;
  events: BackendEvent[];
};

export type ExploreCard = {
  id: number;
  title: string;
  label: string;
  time: string;
  location: string;
  image: string;
  href: string;
};

export type CalendarView = "dag" | "week" | "maand" | "jaar";

export type CalendarCategory =
  | "Alle categorieën"
  | "Kunst"
  | "Muziek"
  | "Theater"
  | "Culinair";

export type CalendarEvent = {
  id: number;
  title: string;
  category: Exclude<CalendarCategory, "Alle categorieën">;
  city: string;
  date: string;
  time?: string;
  color: "green" | "purple" | "sand";
};

export type SafeCityTheme = {
  slug: string;
  label: string;
  description?: string;
  heroImage: string;
  fallbackImage: string;
  colors: {
    pageBackground: string;
    softSurface?: string;
    accent: string;
    accentText: string;
    heading?: string;
    text?: string;
    mutedSurface?: string;
  };
};

export type IconicCard = {
  id: number;
  title: string;
  description: string;
  cta: string;
  image: string;
};