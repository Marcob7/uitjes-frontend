import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voorbeeldagenda | Uitjes",
  description: "Een voorbeeldweergave van de agenda van Uitjes.",
  alternates: { canonical: "/event-details" },
  robots: { index: false, follow: true },
};

export default function EventDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
