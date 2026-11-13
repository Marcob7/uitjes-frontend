# Login- en dataminimalisatie-audit

Datum: 13 november 2026  
Scope: uitsluitend frontend; geen Playwright uitgevoerd.

## Samenvatting

De primaire ontdekflows zijn zonder account bruikbaar. Authenticatie wordt
alleen gevraagd voor opslaan en accountgebonden gegevens. De oorspronkelijke
bestemming blijft nu behouden na een login vanuit een save-actie. Eén kleine,
bewezen formulierverbetering is ook uitgevoerd: verplichte velden op het
contactformulier worden zichtbaar als verplicht aangeduid.

| Prioriteit | Aantal |
| --- | ---: |
| P1 | 0 |
| P2 | 1 |
| Uitgevoerd | 1 |

## Publieke en accountgebonden flows

| Flow | Zonder login | Bewijs |
| --- | --- | --- |
| Homepage | Volledig toegankelijk | `app/page.tsx` bevat geen auth-gate. |
| Zoeken | Volledig toegankelijk, inclusief resultaten en filters | `app/zoeken/page.tsx`, `components/search/`. |
| Ontdek | Stadkeuze, filters, kaart en detailpagina's zijn publiek | `app/ontdek/`, `components/city-explore/`. |
| Inspiratie | Wizard, stadkeuze, resultaten en geolocatieactie zijn publiek | `app/inspiratie/page.tsx`, `components/inspiration/`. |
| Jaarkalender | Publiek toegankelijk | `app/jaarkalender/page.tsx`. |
| Festivals | Kalender, lijst, kaart en detailpagina's zijn publiek | `app/festivals/`. |
| Favoriet of plek bewaren | Login vereist; backendfavorieten en lokale opgeslagen plekken blijven behouden | `components/FavouriteButton.tsx`, `components/SavePlaceButton.tsx`. |
| `/saved` | Toont een login-call-to-action wanneer uitgelogd; accountfavorieten én lokale plekken worden pas na login gelezen | `components/SavedFavoritesPage.tsx:104-129,224-236`. |
| `/account` | Geen serverredirect; toont status en login-call-to-action als de bezoeker is uitgelogd | `app/account/AccountPageClient.tsx`. |
| Nieuwsbrief, contact en feedback | Publiek; geen login vereist | respectievelijke formulieren. |

Er zijn geen routeguards in middleware aangetroffen. Middleware handelt alleen
localeprefixen en de localecookie af. Publieke inhoud blijft dus beschikbaar
voordat een bezoeker een save- of accountactie kiest.

## Authenticatie en loginredirects

### MIN-01 — oorspronkelijke bestemming na login (opgelost)

- **Locatie:** `lib/authReturnTo.ts`, `components/useSaveAuthentication.ts`,
  `components/JwtLoginForm.tsx`, `components/LoginWithGoogle.jsx`,
  `app/login/page.tsx` en `components/SavedFavoritesPage.tsx`.
- **Contract:** `/nl/login?returnTo=/nl/ontdek/slug?city=...`. De waarde is
  altijd een applicatierelatieve route. Locale, query en hash van de
  save-pagina blijven behouden. Een directe `/login` zonder `returnTo`
  behoudt het bestaande gedrag.
- **JWT:** alleen na een geslaagde `login()` navigeert de loginpagina met
  `router.replace` naar de gevalideerde bestemming. Bij een fout wordt geen
  redirect uitgevoerd en blijft het formulier met de bestaande foutmelding
  beschikbaar.
- **`/saved`:** de bestaande login-call-to-action stuurt nu
  `returnTo=/nl/saved` of `returnTo=/en/saved` mee.
- **Google OAuth:** de frontend geeft uitsluitend een gevalideerde bestemming
  door als absolute `next`-URL aan de al bestaande Allauth-loginroute. Allauth
  bewaart `next` in zijn OAuth-state en valideert de host tegen de toegestane
  hosts/CSRF-origins voordat het terugstuurt. Er is geen OAuth-state of
  backendcallbackcontract gewijzigd.
- **Fallback:** een aanwezige maar ongeldige `returnTo` brengt een succesvolle
  JWT-login naar de locale homepage; voor Google wordt geen `next` meegestuurd
  en geldt de bestaande backendhomepagefallback.

### Veiligheidsvalidatie

`getSafeReturnTo` accepteert uitsluitend een relatieve applicatieroute. De
validator begrenst de lengte, weigert control characters en decodeert voor de
controle maximaal drie lagen URL-encoding. Daarna verifieert hij met `URL` dat
de route dezelfde applicatie-origin behoudt. Daardoor worden onder meer
externe URLs, `//host`, `javascript:...`, gecodeerde protocollen en dubbel
gecodeerde protocolrelatieve URLs geweigerd.

### Behouden beveiliging

- Saveknoppen blokkeren tijdens authcontrole en vragen alleen login wanneer de
  gebruiker niet is geauthenticeerd.
- Backendfavorieten blijven aan de ingelogde gebruiker gekoppeld; lokale
  opgeslagen plekken blijven in de bestaande `savedPlaceCards`-opslag.
- Een afgebroken of mislukte login laat de gebruiker op de publieke
  loginpagina met een foutmelding of normale uitgelogde staat; er is geen
  vastlopende authstatus aangetroffen.

## Formulieren en gegevens

| Formulier | Veld / gegevens | Verplicht? | Frontendvalidatie en aantoonbare noodzaak | Beoordeling |
| --- | --- | --- | --- | --- |
| Contact | Naam | Ja | Native `required`; hint zegt dat dit de afzender identificeert. Externe Forminit-bestemming is leidend; optionaliteit is niet uit frontendcode te bewijzen. | Open product-/formulierbesluit. |
| Contact | E-mailadres | Ja | Native `required`, `type=email`; nodig volgens zichtbare copy om te reageren. | Functioneel verklaard. |
| Contact | Onderwerp | Ja | Native `required`; mogelijk voor rubricering, maar geen backendcontract zichtbaar. | Open product-/formulierbesluit. |
| Contact | Bericht | Ja | Native `required`; inhoud van de vraag. | Functioneel verklaard. |
| Feedback | Suggestie | Ja | Native `required` plus minimaal tien tekens in clientcode. | Functioneel verklaard. |
| Feedback | E-mail | Nee | Geen `required`; label vermeldt expliciet ‘(optioneel)’ en een leeg veld wordt als lege string verstuurd. | Correct optioneel. |
| Feedback | `website` | Niet voor bezoekers | Verborgen honeypotveld; geen zichtbare invoervereiste. | Geen gebruikersdata-eis. |
| Feedback | Pagina-URL en formulierstarttijd | Automatisch | Worden vanuit de browser meegestuurd. | Documenteren in toekomstige verklaring; niet door bezoeker invoerbaar. |
| Nieuwsbrief | E-mailadres | Ja | Native `required`, `type=email`; nodig voor bezorging. | Functioneel verklaard. |
| Nieuwsbrief | Frequentie, interesses, bron | Automatisch | De bestaande component stuurt vaste/door de pagina aangeleverde waarden; er zijn geen vooraf aangevinkte voorkeuren. | Geen extra zichtbaar persoonsveld. |
| JWT-login | Gebruikersnaam of e-mail | Ja | Native `required`; wordt samen met wachtwoord naar de auth-API gestuurd. | Functioneel voor login. |
| JWT-login | Wachtwoord | Ja | Native `required`, `type=password`. | Functioneel voor login. |
| Google-login | Google-accountkeuze | Extern | De knop navigeert naar de bestaande OAuth-endpoint. | Niet door het frontendformulier verzameld. |

## Privacyvriendelijke defaults

- Locatie wordt pas via `navigator.geolocation.getCurrentPosition` gevraagd
  na de expliciete actie ‘Gebruik mijn locatie’ in de inspiratiewizard.
  `enableHighAccuracy` staat op `false`.
- Er zijn geen aangevinkte nieuwsbriefcheckboxes of andere opt-in-vakjes in
  de onderzochte frontend gevonden.
- Er zijn geen `console.log`-, `console.info`- of `console.debug`-aanroepen
  gevonden die formulierwaarden of tokens schrijven. De resterende
  `console.warn`/`console.error`-aanroepen betreffen foutpaden en loggen in de
  onderzochte code geen formulierpayload of JWT.
- JWT's en lokale opgeslagen plekken zijn bestaande opslagmechanismen en zijn
  niet gewijzigd. Zie ook de privacycontrole in
  `docs/frontend-completeness-audit.md`.

## Uitgevoerde correctie

### MIN-02 — verplichte contactvelden waren visueel niet herkenbaar

- **Ernst:** P2
- **Locatie:** `app/contact/page.tsx:35-83`.
- **Probleem:** naam, e-mailadres, onderwerp en bericht hadden wel native
  `required`, maar onderdrukten allemaal de bestaande verplichte-markering.
- **Oplossing:** de onderdrukking verwijderd. `AppInput` en `AppTextarea`
  tonen nu hun bestaande `*` bij elk verplicht contactveld.
- **Waarom veilig:** alleen zichtbare uitleg verandert; veldnamen,
  `required`-attributen, Forminit-bestemming en payload blijven identiek.

## Openstaande beslissingen

1. Bevestig met een handmatige Google-login in elke productie-origin dat de
   bestaande Allauth-cookie/JWT-sessie na de callback ook door de frontend
   wordt hersteld; dit is niet betrouwbaar unit-testbaar zonder externe OAuth.
2. Bevestig met de eigenaar van het Forminit-formulier of naam en onderwerp
   daadwerkelijk verplicht moeten blijven; de frontend kan dat externe
   contract niet aantonen of veilig versoepelen.
3. Voeg, los van deze audit, goedgekeurde privacyinformatie toe voor
   nieuwsbrief-, feedback- en contactverwerking. Dit verandert deze audit
   niet in een juridische verklaring.

## Handmatige testscenario's

1. Open alle publieke hoofdroutes uitgelogd en controleer zoeken, filters,
   kaart, wizard, kalender en festivalnavigatie.
2. Kies een lokale plek en een backendevent als uitgelogde bezoeker; bevestig
   de login-CTA en controleer na JWT-login het oorspronkelijke vervolgpad,
   inclusief locale, query en hash.
3. Controleer dat `/saved` de login-CTA toont uitgelogd en beide bestaande
   savevarianten toont na login.
4. Dien contact in met elk ontbrekend verplicht veld en controleer de native
   foutmelding en de zichtbare `*`-markeringen.
5. Dien feedback in zonder e-mailadres; controleer dat de API dit accepteert
   in de bedoelde omgeving.
6. Meld je aan voor de nieuwsbrief met alleen een e-mailadres en controleer
   de bestaande backendreactie.
7. Kies ‘Gebruik mijn locatie’ en controleer dat de browser pas dan om
   toestemming vraagt.
8. Herhaal stap 2 met Google-login en controleer de Allauth-callback op de
   daadwerkelijke productie-origin.

