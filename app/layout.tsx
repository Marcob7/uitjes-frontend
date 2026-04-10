import "./globals.css";
import AppFrame from "@/components/AppFrame";
import { FavoritesProvider } from "@/components/FavouritesProvider";

export const metadata = {
  title: "Uitjes NL",
  description: "Ontdek leuke uitjes, evenementen en activiteiten bij jou in de buurt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <FavoritesProvider>
          <AppFrame>{children}</AppFrame>
        </FavoritesProvider>
      </body>
    </html>
  );
}
