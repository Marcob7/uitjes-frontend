import "./globals.css";
import localFont from "next/font/local";
import AppFrame from "@/components/AppFrame";
import { AuthProvider } from "@/components/AuthProvider";
import { FavoritesProvider } from "@/components/FavouritesProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const metadataBase = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;

const editorialNew = localFont({
  src: [
    {
      path: "../public/fonts/editorial-new/EditorialNew-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/editorial-new/EditorialNew-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/editorial-new/EditorialNew-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-editorial-new",
  display: "swap",
  fallback: ["Editorial New", "ui-sans-serif", "system-ui", "sans-serif"],
});

const plusJakartaSans = localFont({
  src: [
    {
      path: "../public/fonts/plus-jakarta-sans/PlusJakartaSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/plus-jakarta-sans/PlusJakartaSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/plus-jakarta-sans/PlusJakartaSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/plus-jakarta-sans/PlusJakartaSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/plus-jakarta-sans/PlusJakartaSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  fallback: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
});

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
    <html lang="nl" className={`${editorialNew.variable} ${plusJakartaSans.variable}`}>
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
