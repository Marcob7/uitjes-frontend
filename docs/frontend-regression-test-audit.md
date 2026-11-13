# Frontend regressietestaudit — 13 november 2026

## Inventarisatie

De frontend gebruikt de ingebouwde Node-test-runner via `tsx --test`; er is
geen componenttestlibrary, browserrunner, mockserver of testprovider aanwezig.
De bestaande tests zijn daarom deterministische unit-/integratietests van pure
selectoren, URL-helpers en fetchgrenzen:

- zoeken: `lib/search/searchSelectors.test.ts`
- city-content-API-query en foutpropagatie: `lib/api/cityContent.test.ts`
- backendfavorieten en lokale opgeslagen plaatsen: `lib/favorites.test.ts`
- stadnormalisatie: `lib/cityConfig.test.ts`
- inspiratie-URL-context: `lib/inspiration/href.test.ts`
- jaarkalenderselectoren: `app/jaarkalender/calendarSelectors.test.ts`
- focus-trapbeslissing: `lib/a11y/focusTrap.test.ts`

Er waren vóór deze wijziging 24 tests. Er is bewust geen nieuwe testomgeving
toegevoegd.

## Dekkingsmatrix

| Functionaliteit | Bestaande tests vóór audit | Risico | Aanpak |
| --- | --- | --- | --- |
| Zoeken en ranking | Basisfiltering en deterministische rating-ties | Hoog | Uitbreiden met volledige filtercombinatie en prijs-/recente sortering. |
| Zoekfilters en URL-state | Alleen city-content-query; geen zoekshortcut-URL | Hoog | `buildSearchHref` test voor alle parameters, encoding en locale. Hook-interactie blijft browser-/componentwerk. |
| Ontdekfilters en paginering | Geen ontdekselectoren of URL-tests | Hoog | URL-state, filtervalidatie, selectie en detailcontext testen; paginering is lokale componentstate en blijft handmatig/componenttestwerk. |
| Kaartselectie en URL-synchronisatie | Geen test | Middel | Pure `selected`-URL-context en detaildoorgifte testen; MapLibre-canvas vereist browsertest. |
| Backendfavorieten | GET, autorisatie en fout/retry | Hoog | POST/DELETE-grens en mislukte mutatieresultaten toevoegen. |
| Lokale saved places | Leesbaarheid na backendfout | Hoog | Togglegedrag testen naast een gelijktijdige backendfavoriet. |
| Inspiratiewizard | Alleen URL-context | Middel | Geen aanvullende pure, stabiele testgrens gevonden; keuze-flow is componentinteractie. |
| Jaarkalender | Selectorfilters, lege maand en datumlabel | Middel | Bestaande dekking is passend voor pure selectie. |
| Festivalfilters | Geen test | Laag/middel | Parser is klein en rechtstreeks; geen cluster gekozen ten koste van hogere risico's. |
| Mobiele overlayinteracties | Focus-trapbeslissing | Middel | Geen duplicaat toegevoegd: Escape/focusherstel/scroll-lock vereisen DOM-rendering en zijn niet betrouwbaar toetsbaar met de huidige runner. |

## Gekozen clusters en toegevoegde tests

### 1. Zoeken

Toegevoegd: vier tests in `searchHref.test.ts` en `searchSelectors.test.ts`.

- Zoek-URL houdt query, tijd, categorie en gratisfilter vast en encodeert
  speciale tekens.
- Inactieve filters verdwijnen uit de URL en de gekozen locale blijft behouden.
- Stad, tijd, categorie, prijs en rating worden als een gecombineerde AND-set
  toegepast.
- Prijs- en recente sortering zetten onbekende waarden achter bekende waarden.

### 2. Favorieten en lokale opslag

Toegevoegd: drie tests in `favorites.test.ts`.

- Save/unsave gebruikt de correcte event-endpoints en payload; een mislukte
  mutatie blijft een expliciet foutresultaat.
- Lokale saved places togglen onafhankelijk van de backendfavorieten; beide
  opslagmodellen kunnen in dezelfde sessie worden gelezen.

### 3. Ontdek URL- en selectiecontext

Toegevoegd: twee tests in `discoverUrl.test.ts`.

- Ongeldige en gedupliceerde URL-state wordt verworpen, terwijl valide filters,
  kaartweergave en markerselectie behouden blijven.
- Een detail-link behoudt zijn eigen queryparameters en vervangt alleen oude
  ontdekcontext door de actuele context.

In totaal zijn negen functionele regressietests toegevoegd. Productiecode is
niet gewijzigd voor deze testtaak.

## Bewust niet als geautomatiseerde browserflow getest

- Interactieve zoek- en ontdekfilterdialogen, focusherstel, Escape en
  scroll-lock cleanup.
- Ontdekpaginering, lijst-/kaartwissel en focusgedrag van MapLibre-markers.
- Inspiratiewizard en festivalfilterdialoog.

Deze flows vereisen gerenderde React-componenten en voor kaarten een echte
browser/canvas. De huidige Node-testinfrastructuur levert daar geen betrouwbare
testgrens voor. Een afzonderlijke, kleine browsertesttaak met de al beschikbare
productiebuild of een minimale componenttestvoorziening is hiervoor passender
dan in deze taak een zware teststack toevoegen.

## Validatie

Uitgevoerd vanuit `frontend`:

- `npx tsc --noEmit`
- `npm test` — 32/32 geslaagd
- `npm run build`
- `git diff --check`
