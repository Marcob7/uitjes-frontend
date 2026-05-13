export type CategoryKey =
  | "events"
  | "attractions"
  | "restaurants"
  | "bars"
  | "thingsToDo";

export type BackendEvent = {
  id: number;
  slug?: string | null;
  title: string;
  city: string;
  venue: string | null;
  start_at: string | null;
  end_at: string | null;
  date_text: string | null;
  is_ongoing: boolean;
  is_free: boolean;
  price_min: number | null;
  price_note?: string | null;
  source_url: string | null;
  latitude?: number | null;
  longitude?: number | null;
  summary?: string | null;
  walk_minutes?: number | null;
  rating?: number | null;
  image?: string | null;
  status?: string | null;
  category_label?: string | null;
  kind?: string | null;
  tags?: string[];
  audiences?: PlannerCompanion[];
  moments?: PlannerMoment[];
  vibes?: PlannerVibe[];
};

export type CityExploreViewProps = {
  city: string;
  events: BackendEvent[];
  useEventFallback?: boolean;
};

export type ExploreCard = {
  id: number;
  title: string;
  label: string;
  time: string;
  location: string;
  image: string;
  href: string;
  description?: string;
  price?: string;
  distance?: string;
  status?: string;
  rating?: number | null;
  startAt?: string | null;
  endAt?: string | null;
  isOngoing?: boolean;
  kind?: string | null;
  tags?: string[];
  audiences?: PlannerCompanion[];
  moments?: PlannerMoment[];
  vibes?: PlannerVibe[];
};

export type PlannerCompanion = "solo" | "date" | "gezin" | "vrienden";

export type PlannerMoment = "nu" | "vanavond" | "morgen" | "weekend";

export type PlannerVibe = "cultureel" | "actief" | "eten-drinken" | "relaxed";

export type PlannerSelections = {
  companion: PlannerCompanion;
  moment: PlannerMoment;
  vibe: PlannerVibe;
};

export type ResultFilterKey =
  | "food_drink"
  | "outings"
  | "free"
  | "now"
  | "evening"
  | "culture"
  | "active";

export type CalendarView = "dag" | "week" | "maand" | "jaar";

export type CalendarCategory =
  | "Alle categorieen"
  | "Kunst"
  | "Muziek"
  | "Theater"
  | "Culinair";

export type CalendarEvent = {
  id: number;
  title: string;
  category: Exclude<CalendarCategory, "Alle categorieen">;
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
  liquid: {
    deep: string;
    mid: string;
    highlight: string;
  };
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

export type HeroRecommendation = {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  href: string;
};

export type ExploreFeatureCard = {
  id: number;
  title: string;
  description: string;
  icon: "spark" | "clock" | "map";
  tone: "butter" | "mint" | "mist";
};

export type EditorialContent = {
  editionTag: string;
  titleIntro: string;
  titleAccent: string;
  titleOutro: string;
  intro: string;
  ctaLabel: string;
  recommendations: HeroRecommendation[];
  momentFilters: string[];
  featureCards: ExploreFeatureCard[];
};
