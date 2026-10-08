import "./globals.css";
import localFont from "next/font/local";
import type { Metadata } from "next";

import AppFrame from "@/components/AppFrame";
import { AuthProvider } from "@/components/AuthProvider";
import { FavoritesProvider } from "@/components/FavouritesProvider";
import { SaveFeedbackProvider } from "@/components/SaveFeedbackProvider";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getRequestLocale, getRequestPathname } from "@/lib/i18n/request";
import { getLocaleAlternates, getLocaleOpenGraph } from "@/lib/i18n/seo";

// Cloudflare Pages only supports dynamic Next.js routes on the Edge Runtime.
// Declaring this at the root makes it the default for every route in the app.
export const runtime = "edge";

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

export function generateMetadata(): Metadata {
  const locale = getRequestLocale();
  const pathname = getRequestPathname();
  const english = locale === "en";

  return {
    metadataBase: new URL(metadataBase),
    applicationName: "Uitjes",
    title: english ? "Things to do in the Netherlands | Uitjes" : "Uitjes in Nederland | Uitjes",
    description: english
      ? "Discover things to do, activities, festivals and events in cities across the Netherlands."
      : "Ontdek uitjes, activiteiten, festivals en evenementen in steden door heel Nederland.",
    icons: { icon: "/favicon.ico" },
    alternates: getLocaleAlternates(pathname, locale),
    openGraph: {
      type: "website",
      ...getLocaleOpenGraph(locale, pathname),
      siteName: "Uitjes",
      title: english ? "Things to do in the Netherlands | Uitjes" : "Uitjes in Nederland | Uitjes",
      description: english
        ? "Discover things to do, activities, festivals and events in cities across the Netherlands."
        : "Ontdek uitjes, activiteiten, festivals en evenementen in steden door heel Nederland.",
      images: [{ url: "/images/homepage-festival-background.webp", alt: "Uitjes in Nederland" }],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getRequestLocale();
  return (
    <html lang={locale} className={`${editorialNew.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <LocaleProvider locale={locale}>
          <AuthProvider>
            <FavoritesProvider>
              <SaveFeedbackProvider>
                <AppFrame>{children}</AppFrame>
              </SaveFeedbackProvider>
            </FavoritesProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
