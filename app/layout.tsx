// frontend/app/layout.tsx
import "./globals.css";
import { FavoritesProvider } from "@/components/FavouritesProvider";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        {/* 
          MVP navigatie:
          - Snel kunnen klikken tussen je belangrijkste schermen
          - Later vervang je dit door een echte header met search + city selector
        */}
        <nav
          style={{
            padding: 16,
            borderBottom: "1px solid #eee",
            display: "flex",
            gap: 12,
          }}
        >
          {/* Voor MVP zijn simpele <a> links prima */}
          <a href="/">Home</a>
          <a href="/ontdek">Ontdek</a>
          <a href="/saved">Bewaard</a>
          <a href="/feedback">Feedback</a>

        </nav>

        {/* Hier renderen alle pagina’s (home/ontdek/events/saved) */}
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </body>
    </html>
  );
}
