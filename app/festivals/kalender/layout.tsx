export const metadata = {
  title: "Festivalagenda Nederland | Uitjes",
  description:
    "Bekijk festivals in Nederland per datum en ontdek waar je de komende tijd naartoe kunt.",
  alternates: {
    canonical: "/festivals/kalender",
  },
  openGraph: {
    title: "Festivalagenda Nederland | Uitjes",
    description:
      "Bekijk festivals in Nederland per datum en ontdek waar je de komende tijd naartoe kunt.",
    url: "/festivals/kalender",
  },
};

export default function FestivalsCalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
