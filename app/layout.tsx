import "./globals.css";
import AppFrame from "@/components/AppFrame";
import { AuthProvider } from "@/components/AuthProvider";
import { FavoritesProvider } from "@/components/FavouritesProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const metadataBase = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;

export const metadata = {
  metadataBase: new URL(metadataBase),
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
        <AuthProvider>
          <FavoritesProvider>
            <AppFrame>{children}</AppFrame>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
