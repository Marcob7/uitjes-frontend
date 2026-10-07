import type { Metadata } from "next";

// This is a legacy API view. The richer, public event pages live under
// /ontdek/[slug], so keeping this route out of search prevents duplicates.
export const metadata: Metadata = {
  title: "Evenementenoverzicht | Uitjes",
  robots: { index: false, follow: true },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
