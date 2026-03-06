import "./globals.css";
import { FavoritesProvider } from "@/components/FavouritesProvider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "OpPad",
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
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </FavoritesProvider>
      </body>
    </html>
  );
}