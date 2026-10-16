import type { CalendarEventInput } from "@/lib/calendarIntegration";
import type { EventDateRange } from "@/lib/eventDateLabels";

export type WeekendEvent = EventDateRange & {
  id: string;
  label: string;
  title: string;
  location: string;
  price: string;
  image: string;
  featured?: boolean;
  tint: string;
};

export type TodayEvent = {
  time: string;
  title: string;
  location: string;
  image: string;
  kind: string;
};

export type Category = {
  title: string;
  kicker: string;
  href: string;
  image: string;
  className: string;
};

export type UpcomingMoment = Omit<EventDateRange, "startAt" | "endAt"> & {
  startAt: string;
  endAt?: string;
  title: string;
  location: string;
  image: string;
  calendar?: Pick<CalendarEventInput, "description" | "url" | "uid"> & {
    location?: CalendarEventInput["location"];
  };
};

export function getUpcomingMomentCalendar(moment: UpcomingMoment): CalendarEventInput | undefined {
  if (!moment.calendar) return undefined;

  return {
    title: moment.title,
    startAt: moment.startAt,
    endAt: moment.endAt,
    ...moment.calendar,
    location: moment.calendar.location ?? moment.location,
  };
}

export const weekendEvents: WeekendEvent[] = [
  {
    id: "strand",
    label: "Festival",
    title: "Festival STRAND",
    location: "Haarrijnse Plas · Utrecht",
    startAt: "2026-08-28",
    endAt: "2026-08-29",
    price: "Vanaf €29,50",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=88",
    featured: true,
    tint: "bg-[#d9e6d1]",
  },
  {
    id: "zeezout",
    label: "Dance",
    title: "ZeeZout Festival",
    location: "Tuinen van West · Amsterdam",
    startAt: "2026-08-29",
    price: "Vanaf €49,50",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=88",
    tint: "bg-[#ede4d0]",
  },
  {
    id: "oude-muziek",
    label: "Muziek",
    title: "Festival Oude Muziek",
    location: "Binnenstad · Utrecht",
    startAt: "2026-08-28",
    endAt: "2026-09-06",
    price: "Vanaf €12,50",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=88",
    tint: "bg-[#e3e2ef]",
  },
  {
    id: "ij-hallen",
    label: "Markt",
    title: "IJ-Hallen",
    location: "NDSM-werf · Amsterdam",
    startAt: "2026-08-29",
    endAt: "2026-08-30",
    price: "€6,50",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=88",
    tint: "bg-[#eee1d4]",
  },
  {
    id: "south-east-jazz",
    label: "Jazz",
    title: "South East Jazz",
    location: "Zuidoost · Amsterdam",
    startAt: "2026-08-29",
    endAt: "2026-08-30",
    price: "Gratis",
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=88",
    tint: "bg-[#dfeadf]",
  },
];

export const weekendGuide: EventDateRange = {
  startAt: "2026-08-28",
  endAt: "2026-08-30",
};

export const todayEvents: TodayEvent[] = [
  {
    time: "18:00",
    title: "Foodfestival aan de Kade",
    location: "Rotterdam · Leuvehoofd",
    kind: "Food",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=720&q=85",
  },
  {
    time: "19:30",
    title: "Openluchtconcert",
    location: "Utrecht · Ledig Erf",
    kind: "Live",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=720&q=85",
  },
  {
    time: "20:00",
    title: "Museumnacht Late",
    location: "Amsterdam · Museumplein",
    kind: "Kunst",
    image:
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=720&q=85",
  },
  {
    time: "22:00",
    title: "Clubnacht aan het IJ",
    location: "Eindhoven · Effenaar",
    kind: "Nacht",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=720&q=85",
  },
];

export const categories: Category[] = [
  {
    title: "Festivals",
    kicker: "Buitenlucht · live",
    href: "/festivals",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=88",
    className: "md:col-span-7 md:min-h-[25rem]",
  },
  {
    title: "Muziek & nightlife",
    kicker: "Tot laat · dichtbij",
    href: "/zoeken?q=muziek",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=88",
    className: "md:col-span-5 md:min-h-[25rem]",
  },
  {
    title: "Kunst & cultuur",
    kicker: "Verhalen · ontdek",
    href: "/zoeken?q=kunst",
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=88",
    className: "md:col-span-5 md:min-h-[25rem]",
  },
  {
    title: "Food & markets",
    kicker: "Proeven · rondstruinen",
    href: "/zoeken?q=food",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=88",
    className: "md:col-span-7 md:min-h-[25rem]",
  },
];

export const upcomingMoments: UpcomingMoment[] = [
  {
    startAt: "2026-09-12",
    endAt: "2026-09-13",
    title: "Open Monumentendag",
    location: "Door heel Nederland",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1100&q=88",
    calendar: {
      description: "Open Monumentendag · 12–13 september 2026",
      url: "/ontdek/open-monumentendag",
      uid: "event-details-open-monumentendag-2026@uitjes-nl.local",
    },
  },
  {
    startAt: "2026-09-25",
    endAt: "2026-10-02",
    title: "Nederlands Film Festival",
    location: "Utrecht",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1100&q=88",
    calendar: {
      description: "Nederlands Film Festival · 25 september–2 oktober 2026",
      url: "/ontdek/nederlands-film-festival",
      uid: "event-details-nederlands-film-festival-2026@uitjes-nl.local",
    },
  },
  {
    startAt: "2026-10-17",
    endAt: "2026-10-25",
    title: "Dutch Design Week",
    location: "Eindhoven",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=88",
    calendar: {
      description: "Dutch Design Week · 17–25 oktober 2026",
      url: "/ontdek/dutch-design-week",
      uid: "event-details-dutch-design-week-2026@uitjes-nl.local",
    },
  },
  {
    startAt: "2026-10-21",
    endAt: "2026-10-25",
    title: "Amsterdam Dance Event",
    location: "Amsterdam",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1100&q=88",
    calendar: {
      description: "Amsterdam Dance Event · 21–25 oktober 2026",
      url: "/ontdek/amsterdam-dance-event",
      uid: "event-details-amsterdam-dance-event-2026@uitjes-nl.local",
    },
  },
  {
    startAt: "2026-11-07",
    title: "Museumnacht Amsterdam",
    location: "Amsterdam · 19:00–02:00",
    image:
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1100&q=88",
    calendar: {
      location: "Amsterdam",
      description: "Museumnacht Amsterdam · 7 november 2026 · 19:00–02:00",
      url: "/ontdek/museumnacht-amsterdam",
      uid: "event-details-museumnacht-amsterdam-2026@uitjes-nl.local",
    },
  },
  {
    startAt: "2026-11-26",
    endAt: "2027-01-17",
    title: "Amsterdam Light Festival",
    location: "Grachten · Amsterdam",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1100&q=88",
    calendar: {
      location: "Grachten, Amsterdam",
      description: "Amsterdam Light Festival · 26 november 2026–17 januari 2027",
      url: "/ontdek/amsterdam-light-festival",
      uid: "event-details-amsterdam-light-festival-2026@uitjes-nl.local",
    },
  },
];
