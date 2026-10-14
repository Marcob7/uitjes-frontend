import { getFestivalDetailHref } from "../data";

export type FestivalCalendarTone = "lime" | "pink" | "blue" | "amber" | "violet";

export const FESTIVAL_CALENDAR_TONE_CLASSES: Record<FestivalCalendarTone, string> = {
  lime: "bg-[#e8f2d0] text-[#344c18]",
  pink: "bg-[#f7d8de] text-[#7a213a]",
  blue: "bg-[#d9e6ff] text-[#294987]",
  amber: "bg-[#ffe9b6] text-[#704800]",
  violet: "bg-[#e6ddff] text-[#4b2e91]",
};

export type FestivalCalendarEvent = {
  label: string;
  tone: FestivalCalendarTone;
  date: string;
  genres: string[];
  href?: string;
};

export const FESTIVAL_CALENDAR_WEEKDAY_LABELS = ["MA", "DI", "WO", "DO", "VR", "ZA", "ZO"];

export const FESTIVAL_CALENDAR_EVENTS: FestivalCalendarEvent[] = [
  { label: "North Sea Jazz", tone: "lime", date: "2024-07-01", genres: ["Jazz"], href: getFestivalDetailHref("north-sea-jazz") },
  { label: "Vondelpark Openlucht", tone: "pink", date: "2024-07-03", genres: [] },
  { label: "Down The Rabbit Hole", tone: "violet", date: "2024-07-05", genres: [] },
  { label: "Gentle Giant Expo", tone: "blue", date: "2024-07-05", genres: ["Kunst"] },
  { label: "Awakenings Summer", tone: "pink", date: "2024-07-06", genres: ["Techno"] },
  { label: "Bospop Week", tone: "pink", date: "2024-07-06", genres: [] },
  { label: "+4 more", tone: "lime", date: "2024-07-06", genres: [] },
  { label: "Awakenings Final", tone: "pink", date: "2024-07-07", genres: ["Techno"] },
  { label: "Gouden Carolus Food", tone: "amber", date: "2024-07-09", genres: ["Culinair"] },
  { label: "Dekmantel Festival", tone: "pink", date: "2024-07-12", genres: ["Techno"], href: getFestivalDetailHref("dekmantel-festival") },
  { label: "Wildeburg Day 2", tone: "pink", date: "2024-07-13", genres: [] },
  { label: "Theater aan Zee", tone: "violet", date: "2024-07-13", genres: ["Kunst"] },
  { label: "Vierdaagsefeesten", tone: "lime", date: "2024-07-16", genres: [] },
  { label: "Vierdaagsefeesten", tone: "lime", date: "2024-07-17", genres: [] },
  { label: "Zwarte Cross", tone: "pink", date: "2024-07-18", genres: [] },
  { label: "Vierdaagsefeesten", tone: "lime", date: "2024-07-18", genres: [] },
  { label: "Zwarte Cross", tone: "pink", date: "2024-07-19", genres: [] },
  { label: "Welcome to the Village", tone: "pink", date: "2024-07-19", genres: [] },
  { label: "Zwarte Cross Final", tone: "pink", date: "2024-07-20", genres: [] },
  { label: "+2 more", tone: "lime", date: "2024-07-20", genres: [] },
];
