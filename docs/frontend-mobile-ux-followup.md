# Gerichte mobiele UX-verbeteringen — follow-up

Sprint S9, frontend-only. Deze follow-up verwijst naar de gevraagde eerdere audit
`frontend/docs/frontend-mobile-ux-audit.md`. Dat bestand is niet aanwezig in deze
checkout; de hieronder genoemde reeds aanwezige maatregelen zijn daarom uit de
huidige implementatie afgeleid, niet opnieuw getest of als nieuw werk gerekend.

## Bestaande mobiele maatregelen die behouden zijn

- De mobiele navigatie sluit bij routewissel en bij de desktop-breakpoint, zet
  achtergrondscroll tijdelijk vast, ondersteunt Escape, focus-trapping en
  focusherstel (`components/home/navBar.tsx`).
- Zoek-, ontdek- en kalenderdialogen gebruiken bestaande focus- en
  scroll-lockvoorzieningen; deze zijn niet aangepast.
- Het festivalrooster valt onder `sm` terug naar een mobiele lijst en de
  jaarkalender heeft al een responsive grid-/lijststructuur.
- Formulierinvoer gebruikt op de gecontroleerde routes `text-base` en minimaal
  48px hoge velden, waardoor iOS-zoom door kleine tekst niet wordt geïntroduceerd.

## Onderzoek

Broncode is beoordeeld voor `/`, `/zoeken`, `/ontdek` (inclusief kaartoverlay en
detail), `/inspiratie` (inclusief detail), `/jaarkalender`,
`/festivals/kalender`, `/festivals/lijst`, `/saved`, `/login`, `/account`,
`/contact` en `/feedback`, plus gedeelde navigatie-, dialoog-, formulier-, kaart-
en resultaatkaartcomponenten.

De beoogde breedtes zijn 320, 375, 390, 430, 768 en 1024 CSS-px. Een lokale
browserpreview vanuit de ingebouwde browser kon de ontwikkelserver niet bereiken
(`ERR_CONNECTION_TIMED_OUT`); onderstaande bevindingen zijn dus
code-aantoonbaar, maar niet visueel in een browser bevestigd. Er is geen
Playwright uitgevoerd.

## Bevindingen en wijzigingen

| ID | Route/component | Viewport | Ernst | Bevinding en oorzaak | Status |
| --- | --- | --- | --- | --- | --- |
| MOBILE-01 | Gedeelde `IconButton` | 320–430 | P2 | De `sm`-variant was 36 × 36px. Hij wordt gebruikt voor iconische bedieningen, waaronder sluiten/wissen; dat ligt onder de mobiele richtmaat van circa 44px. | Opgelost: `sm` is nu 44 × 44px (`components/ui/IconButton.tsx`). |
| MOBILE-02 | `/ontdek`, `DiscoverResultsMobileMapDialog` | 320–430 | P2 | De kaarthoogte trok een vaste 7,25rem af. Wanneer de stadsnaam/titel meer verticale ruimte inneemt, kon het dialoog totaal hoger dan de viewport worden. | Opgelost: de overlay is een flexkolom met `100dvh`; de kaart vult alleen resterende ruimte (`components/city-explore/DiscoverResultsMobileMapDialog.tsx`). |
| MOBILE-03 | `/festivals/kalender`, `CalendarPill` | 320–430 | P2 | Klikbare festivalitems in de mobiele lijst hadden alleen tekst met verticale padding (ongeveer 28px hoog), onder de gewenste aanraakmaat. | Opgelost: links zijn op mobiel minimaal 44px hoog; het compacte desktoprooster blijft ongewijzigd vanaf `sm` (`app/festivals/kalender/page.tsx`). |

Er zijn geen bewezen horizontale-overflowbugs aangetroffen in de beoordeelde
responsive structuren. Bewust niet gewijzigd: bestaande hamburgernavigatie,
focus-traps, scroll-lock, formuliervalidatie, kaartinitialisatie en kalenderdata.

## Handmatig te controleren

Controleer in een browser op 320, 375, 390, 430, 768 en 1024px:

1. Open/sluit de mobiele navigatie, navigeer ermee, toets Escape en vergroot
   daarna naar desktopbreedte; controleer focusherstel en achtergrondscroll.
2. Open de filters op `/zoeken` en `/ontdek`, en de kaart op `/ontdek`; controleer
   dat sluitknoppen bereikbaar zijn, de achtergrond niet scrolt en de kaart bij
   een lange stadsnaam volledig binnen de viewport blijft.
3. Controleer op `/festivals/kalender` dat festivalitems op mobiel gemakkelijk
   te raken zijn en dat de compacte kalender vanaf 768px niet onnodig ruimer is.
4. Vul lange zoektermen en e-mailadressen in op `/zoeken`, `/login`, `/contact`
   en `/feedback`; controleer afbreken van fouten, toetsenbordgedrag en afwezigheid
   van horizontale scroll.

## Vervolg

Er zijn geen nieuwe P1/P0-problemen uit broncodeonderzoek. Herhaal alleen een
visuele audit wanneer de ontbrekende eerdere audit beschikbaar is of wanneer een
apparaat/browser-specifiek probleem wordt gemeld.
