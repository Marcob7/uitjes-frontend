# Frontend-completenessaudit

Datum: 13 november 2026  
Scope: uitsluitend `frontend/`; geen Playwright uitgevoerd.

## Samenvatting

Er zijn drie P1-bevindingen. Ze zijn aantoonbaar vanuit de broncode, maar
hebben alle een product- of databronbesluit nodig. Daarom zijn in deze audit
geen functionele wijzigingen uitgevoerd: een ogenschijnlijk kleine wijziging
zou óf actuele content verzinnen, óf een juridische pagina vervangen door een
onverwante bestemming.

| Prioriteit | Aantal |
| --- | ---: |
| P0 | 0 |
| P1 | 3 |
| P2 | 3 |
| Bewust behouden | 4 |

## Onderzochte routes

Locale-prefixen worden centraal afgehandeld door `middleware.ts`: elke route
hieronder is bereikbaar als `/nl/...` en `/en/...`. De bronbestanden hebben
daarom geen fysieke locale-mappen nodig.

| Route | Bron | Beoordeling |
| --- | --- | --- |
| `/` | `app/page.tsx` | Onderzocht |
| `/ontdek`, `/ontdek/[slug]` | `app/ontdek/` | Onderzocht |
| `/zoeken` | `app/zoeken/` | Onderzocht |
| `/inspiratie`, `/inspiratie/[category]`, `/inspiratie/[category]/[slug]` | `app/inspiratie/` | Onderzocht |
| `/jaarkalender`, `/jaarkalender/[daySlug]`, `/jaarkalender/[daySlug]/[event]` | `app/jaarkalender/` | P1, zie QUAL-03 |
| `/festivals`, `/festivals/kalender`, `/festivals/lijst`, `/festivals/kaart`, `/festivals/[events]`, `/festivals/nieuwsbrief-preview` | `app/festivals/` | Onderzocht; `/festivals` is een bewuste redirect naar de kalender |
| `/saved`, `/bewaard` | `app/saved/`, `app/bewaard/` | Onderzocht; `/bewaard` is een bewuste legacyredirect |
| `/uitjes` | `app/uitjes/page.tsx` | Bewuste voorbeeldroute, zie QUAL-04 |
| `/login`, `/account`, `/faq` | respectievelijke `app/`-mappen | Onderzocht |
| `/contact`, `/feedback`, `/feedback-test` | respectievelijke `app/`-mappen | Onderzocht; zie QUAL-05 |
| `/demo` | `app/demo/page.tsx` | Onderzocht; zie QUAL-05 |
| `/events`, `/events/[id]`, `/event-details` | `app/events/`, `app/event-details/` | P1/P2, zie QUAL-02 en QUAL-06 |
| `/nieuws`, `/nieuws/[slug]` | `app/nieuws/` | Onderzocht |

`app/api/city-content/route.ts`, `.well-known/` en de sitemap/robots-routes
zijn geen bezoekerspagina's en zijn alleen op relevante link- en fallbackpaden
beoordeeld.

## Bevindingen

| ID | Route | Probleem | Ernst | Voorgestelde oplossing |
| --- | --- | --- | --- | --- |
| QUAL-01 | alle routes (footer) | De link **Privacy** verwijst naar `/privacy`, waarvoor geen pagina bestaat. Een repositorybrede controle vond geen goedgekeurde verklaring of externe privacy-URL. | P1 | Publiceer de goedgekeurde privacyverklaring op die route, of lever een goedgekeurde externe privacy-URL aan. |
| QUAL-02 | `/event-details` | De primaire navigatie **Events** leidt naar vaste agenda-inhoud uit augustus–november 2026; op de auditdatum zijn meerdere items al verlopen. De kaarten in de sectie ‘Vandaag’ springen alleen naar `#binnenkort` in plaats van naar een eventdetail. | P1 | Kies een actuele bron voor deze route of haal de route uit de primaire navigatie. Dit vereist een productbesluit; geen gefingeerde actuele agenda toevoegen. |
| QUAL-03 | `/jaarkalender` | De publieke kalender bouwt zijn inhoud op vaste, gegenereerde oktober-2024-gegevens (`YEAR = 2024`), inclusief voorbeeldtitels. Daardoor suggereert de pagina actuele evenementen terwijl de data ruim verlopen is. | P1 | Koppel een goedgekeurde actuele databron of presenteer de route expliciet als archief/demo na productbesluit. |
| QUAL-04 | `/uitjes` | De pagina toont zichzelf zichtbaar als ‘tijdelijke voorbeeldweergave’ met ‘dummy resultaten’, maar is bewust `noindex` en gebruikt de expliciet te behouden inspiratiegegevens. | P2 / Bewust | Behouden. Beslis later of de route publiek blijft, hernoemd wordt, of wordt vervangen door een productroute. |
| QUAL-05 | `/demo`, `/feedback-test` | Twee niet-genoemde, publieke ontwikkelroutes tonen demo-/testcopy en respectievelijk een vaste backend-call en testfeedback. Ze staan niet in primaire navigatie, maar zijn wel direct bereikbaar. | P2 | Productbesluit: afschermen/verwijderen bij release of expliciet als interne QA-route beheren. Niet automatisch verwijderen wegens mogelijk ontwikkelgebruik. |
| QUAL-06 | `/events` | De route toont alleen de ingevoerde zoekterm en geen resultaatfunctionaliteit. Hij is niet in de hoofdnavigatie, maar `/events/[id]` verwijst hiernaar terug. | P2 | Bepaal of dit een legacyroute blijft, naar een bestaande zoekroute redirect, of echte resultaten krijgt. |

### Reproductie en locaties

- **QUAL-01:** open een willekeurige pagina, scroll naar de footer en kies
  ‘Privacy’. De link wordt samengesteld in `components/SiteFooter.tsx:116`;
  `app/privacy/page.*` bestaat niet.
- **QUAL-02:** open de hoofd- of mobiele navigatie en kies ‘Events’. De
  bestemming staat in `lib/navigation/siteNavigation.ts:35`; de vaste datums
  staan in `app/event-details/eventDetailsData.ts:43-270`; de `#binnenkort`
  kaarten staan in `app/event-details/EventDetailsSections.tsx:42`.
- **QUAL-03:** open `/jaarkalender` en inspecteer een dag of filterresultaat.
  De vaste basisdatum en voorbeeldgenerator staan in
  `app/jaarkalender/data.ts:1-236`.
- **QUAL-04:** open `/uitjes`; metadata en zichtbare voorbeeldcopy staan in
  `app/uitjes/page.tsx:10-12` en `app/uitjes/page.tsx:94-139`.
- **QUAL-05:** open `/demo` of `/feedback-test`; de pagina's staan in
  `app/demo/page.tsx` en `app/feedback-test/page.tsx`.
- **QUAL-06:** open `/events` zonder query; de beperkte weergave staat in
  `app/events/EventsClient.tsx`.

## Privacycontrole (aanvulling 13 november 2026)

### Geen goedgekeurde verklaring gevonden

Repositorybrede zoekopdrachten naar `privacy`, `privacy-policy`,
`privacyverklaring`, `gegevensbescherming`, `AVG`, `GDPR`, `terms`,
`voorwaarden` en `cookies` vonden geen publiceerbare privacyverklaring, geen
privacyroute en geen goedgekeurde externe privacy-URL. De aangetroffen
documenten zijn technische of planningsdocumenten, geen juridische
verklaringen:

- `docs/newsletter-signup-check.md:79-88` benoemt expliciet dat duidelijke
  privacytekst, toestemming en een uitschrijfmogelijkheid nog nodig zijn voor
  echte nieuwsbriefverzending.
- `docs/frontend-jwt-loginflow-check.md:57` noemt veilige tokenopslag een
  productiepunt ter herbeoordeling.
- `docs/saved-favorites-domain-audit.md` documenteert opslaggedrag en open
  privacyverwachtingen, maar bevat geen verklaring voor bezoekers.

Daarom is scenario B van toepassing: er is geen privacycontent toegevoegd en
de footerlink blijft ongewijzigd. Het vervangen van de link door contact, een
technisch document of zelfgeschreven juridische tekst zou geen geldige
privacybestemming opleveren. **QUAL-01 kan niet worden afgesloten.**

### Aantoonbare frontendverwerking

Dit is een technische inventarisatie van zichtbare codepaden, geen uitspraak
over bewaartermijnen, grondslagen, verwerkersovereenkomsten of
backendverwerking.

| Onderdeel | Wat uit frontendcode blijkt | Bron |
| --- | --- | --- |
| Account en sessie | Het loginformulier verstuurt gebruikersnaam óf e-mailadres met wachtwoord naar de auth-API. Access- en refresh-JWT's worden onder `uitjes.jwt.tokens` in `localStorage` opgeslagen; een profielrequest leest onder andere naam, gebruikersnaam en e-mailadres. Google-login navigeert naar de externe OAuth-loginendpoint van de API. | `lib/jwtAuth.ts`, `components/LoginWithGoogle.jsx` |
| Accountfavorieten | Ingelogde gebruikers lezen, voegen toe en verwijderen via de favorites-API. | `lib/favorites.ts`, `components/FavouritesProvider.tsx` |
| Lokale opgeslagen plekken | Titel, route, optionele metadata/afbeelding en opslagtijd worden in browser-`localStorage` onder `savedPlaceCards` opgeslagen. | `lib/savedPlaces.ts` |
| Localecookie | De taalkeuze schrijft de cookie `uitjes_locale`; middleware leest/schrijft dezelfde cookie met een jaar geldigheid en `SameSite=Lax`. | `components/i18n/LanguageSwitcher.tsx`, `middleware.ts` |
| Nieuwsbrief | Het formulier verstuurt e-mailadres, frequentie, interesses en bron naar `/api/newsletter/signup/`. De zichtbare frontend bevat geen privacy-link of toestemmingscopy bij dit formulier. | `components/NewsLetterSection.tsx`, `lib/newsletter.ts` |
| Contact en feedback | Contact verzendt naam, e-mailadres, onderwerp en bericht naar Forminit. Feedback verstuurt bericht, optioneel e-mailadres, pagina-URL, een honeypotveld en een starttijd naar de API. | `app/contact/page.tsx`, `app/feedback/page.tsx` |
| Locatie | De inspiratiewizard vraagt via `navigator.geolocation` om browserlocatie wanneer de gebruiker die actie start. | `components/inspiration/InspirationChoiceFlow.tsx` |
| Kaarten en afbeeldingen | De kaart gebruikt MapLibre met de OpenFreeMap-stijl-URL. Afbeeldingen worden onder meer van `images.unsplash.com` geladen. | `components/city-explore/ExploreMap.tsx`, `next.config.js`, `lib/remoteImage.ts` |

Er zijn in de frontendcode geen aanroepen naar gangbare analytics/telemetry-
SDK's aangetroffen (`gtag`, Google Analytics, Plausible, PostHog, Mixpanel).
Dat bewijst niet dat productie-infrastructuur geen metingen uitvoert.

### Gecontroleerde navigatie

- De gedeelde `SiteFooter` wordt via `AppFrame` voor desktop en mobiel
  gerenderd; dezelfde ongeldige privacylink staat dus in beide layouts.
- De link gebruikt `localePathname("/privacy", locale)`. Daardoor worden
  `/nl/privacy` en `/en/privacy` gevormd; middleware rewritet beide naar de
  ontbrekende interne route. Een directe on-geprefixte `/privacy` redirectt
  eerst naar de voorkeurstaal en eindigt eveneens op de ontbrekende route.
- Login- en accountpagina's bevatten geen aanvullende privacy- of
  voorwaardenlink. Contact is in de footer als mailto-link aanwezig.

### Benodigde informatie voor een veilige oplossing

De eigenaar moet één van deze concrete artefacten aanleveren voordat de link
gewijzigd of `/privacy` gepubliceerd kan worden:

1. een goedgekeurde Nederlandse privacyverklaring, met een besluit of een
   Engelse vertaling nodig is; of
2. een goedgekeurde externe privacy-URL.

Daarna kan de bestaande locale-aware footerlink naar de juiste bestemming
wijzen of kan de aangeleverde verklaring op `/privacy` worden geplaatst,
zonder nieuwe auth-, cookie- of opslagfunctionaliteit.

## Tijdelijke teksten en fallbackgegevens

De zoekopdracht naar `TODO`, `FIXME`, `placeholder`, `coming soon`,
`binnenkort`, `not implemented`, `dummy`, `mock`, `test data`, `lorem ipsum`,
`tijdelijk` en `voorbeeld` is beoordeeld op context.

- **Behouden:** `lib/dummy/inspirationResults.ts` blijft de actieve,
  afgesproken inspiratiebron. De verwijzingen vanuit Inspiratie, Zoeken en
  Uitjes zijn daarom geen automatische fout.
- **Behouden:** `components/city-explore/data.ts` en
  `lib/exploreDetailData.ts` bevatten fallbackgegevens voor de ontdekroutes.
  `ExploreMap` meldt zelfs wanneer gegenereerde kaartcoördinaten actief zijn.
  Dit is een bewuste degradatie bij ontbrekende brondata, geen veilige
  verwijderkandidaat binnen deze opdracht.
- **Geen bevinding:** invoerveld-placeholders, voorbeelden in contact- en
  feedbackformulieren, en foutteksten bij API-storingen zijn reguliere UI-copy.
- **Geen bevinding:** `LEGACY_PLACEHOLDERS` in `lib/activityImages.ts` is
  juist een filter om oude beeldplaceholders niet te tonen.

## Interacties en links

- De onderzochte knoppen met callbacks voeren een concrete actie uit
  (zoeken/filteren, scrollen, favorieten, delen, kalenderexport, formulieren
  of dialoogbediening). Er is geen actieve `<button onClick={() => {}}>`
  aangetroffen.
- Hashlinks op de eventdetailpagina verwijzen naar aanwezige sectie-IDs. Hun
  semantische tekortkoming bij de ‘Vandaag’-kaarten is opgenomen in QUAL-02.
- `/bewaard` en `/festivals` zijn gecontroleerde legacyredirects en blijven
  behouden.
- De harde interne links die localeprefixen niet zelf opbouwen worden door de
  middleware naar de voorkeurslocale gestuurd. Dit is geen gebroken
  bestemming, maar nieuw werk hoort waar passend `localePathname` te blijven
  gebruiken.
- Externe links naar Forminit, MapLibre/OpenFreeMap, WhatsApp, ticketbronnen,
  Unsplash en mailto-adressen zijn syntactisch beoordeeld. Nieuwe vensters
  gebruiken `rel="noreferrer"`; er is geen externe crawler uitgevoerd.

## Uitgevoerde verbeteringen

Geen. De gevonden P1's vereisen inhoudelijke keuzes; een kleine wijziging zou
onjuist gedrag maskeren of een nieuwe functie/content verzinnen.

## Benodigde productbeslissingen

1. Lever de bestemming en inhoud voor de privacyverklaring aan (QUAL-01).
2. Kies de publieke toekomst van `/event-details` en zijn primaire
   navigatielink (QUAL-02).
3. Kies een actuele bron of expliciete status voor `/jaarkalender` (QUAL-03).
4. Beslis vóór release of `/demo`, `/feedback-test`, `/uitjes` en `/events`
   publiek bereikbaar mogen blijven (QUAL-04 t/m QUAL-06).

## Handmatige controles

- Test de daadwerkelijke bestemmingen van ticket-, route-, Forminit-,
  nieuwsbrief-, kaart- en mailto-links in een browser met productieconfiguratie.
- Test in beide locales de redirect/rewrite voor elke hierboven genoemde route.
- Bevestig met de privacy-eigenaar welke URL en tekst juridisch correct zijn.
- Test aanmelding, favorieten en feedback tegen een beschikbare backend; deze
  audit wijzigde geen API-contracten of backendfunctionaliteit.

