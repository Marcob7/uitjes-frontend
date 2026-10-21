export type SiteNavigationItemId =
  | "home"
  | "explore"
  | "search"
  | "events"
  | "inspiration"
  | "calendar"
  | "festivals"
  | "faq"
  | "saved"
  | "login";

export type SiteNavigationLabelKey =
  | "navigation.home"
  | "navigation.explore"
  | "navigation.search"
  | "navigation.events"
  | "navigation.inspiration"
  | "navigation.calendar"
  | "navigation.festivals"
  | "navigation.faq"
  | "navigation.saved"
  | "navigation.login";

export type SiteNavigationItem = {
  id: SiteNavigationItemId;
  href: string;
  labelKey: SiteNavigationLabelKey;
};

const siteNavigationItemsById = {
  home: { id: "home", href: "/", labelKey: "navigation.home" },
  explore: { id: "explore", href: "/ontdek", labelKey: "navigation.explore" },
  search: { id: "search", href: "/zoeken", labelKey: "navigation.search" },
  events: { id: "events", href: "/event-details", labelKey: "navigation.events" },
  inspiration: {
    id: "inspiration",
    href: "/inspiratie",
    labelKey: "navigation.inspiration",
  },
  calendar: {
    id: "calendar",
    href: "/jaarkalender",
    labelKey: "navigation.calendar",
  },
  festivals: {
    id: "festivals",
    href: "/festivals/kalender",
    labelKey: "navigation.festivals",
  },
  faq: { id: "faq", href: "/faq", labelKey: "navigation.faq" },
  saved: { id: "saved", href: "/saved", labelKey: "navigation.saved" },
  login: { id: "login", href: "/login", labelKey: "navigation.login" },
} as const satisfies Record<SiteNavigationItemId, SiteNavigationItem>;

/** The shared static item set for the desktop and mobile site navigation. */
export const mainNavigationItems = [
  siteNavigationItemsById.home,
  siteNavigationItemsById.explore,
  siteNavigationItemsById.search,
  siteNavigationItemsById.events,
  siteNavigationItemsById.inspiration,
  siteNavigationItemsById.calendar,
  siteNavigationItemsById.festivals,
  siteNavigationItemsById.faq,
] as const;

/** Footer order intentionally remains independent from the main navigation. */
export const footerPrimaryNavigationItems = [
  siteNavigationItemsById.explore,
  siteNavigationItemsById.calendar,
  siteNavigationItemsById.festivals,
  siteNavigationItemsById.inspiration,
] as const;

export const footerSecondaryNavigationItems = [
  siteNavigationItemsById.faq,
  siteNavigationItemsById.saved,
] as const;

export const searchNavigationItem = siteNavigationItemsById.search;
export const savedNavigationItem = siteNavigationItemsById.saved;
export const loginNavigationItem = siteNavigationItemsById.login;
