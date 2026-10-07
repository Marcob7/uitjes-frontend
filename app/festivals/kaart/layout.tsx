export const metadata = {
  title: "Festivals op de kaart | Uitjes",
  description:
    "Verken festivals in Nederland op de kaart en bekijk wat er in de buurt speelt.",
  alternates: {
    canonical: "/festivals/kaart",
  },
  robots: { index: false, follow: true },
};

export default function FestivalsMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
