# Support-, contact- en publieke-informatieaudit

Datum: 18 november 2026  
Scope: uitsluitend `frontend/`; geen Playwright uitgevoerd en geen backend-, API-, Forminit-, auth- of i18n-architectuurwijzigingen.

## Samenvatting

De contact- en hulpstromen zijn overwegend goed bereikbaar: FAQ staat in de gedeelde desktop- en mobiele navigatie, de FAQ bevat toetsenbordbedienbare filters en uitklapbare antwoorden, en contact-, feedback- en loginflows hebben bestaande herstel- of foutpaden. Drie kleine, broncode-aantoonbare P2-problemen zijn veilig opgelost. De bestaande ontbrekende privacyverklaring blijft een open P1-product/juridische blokkade en is niet opnieuw als nieuw probleem geteld.

| Prioriteit | Open | Opgelost |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 1 bestaand | 0 |
| P2 | 0 | 3 |

## Onderzocht

| Onderdeel | Locatie | Beoordeling |
| --- | --- | --- |
| Contact | `app/contact/page.tsx` | Duidelijk doel, gekoppelde labels, zichtbare verplichte markeringen, native e-mailvalidatie en mobiel-vloeiende velden. Forminit beheert bevestiging/fout/nieuwe poging; dit contract is bewust niet gewijzigd. |
| FAQ | `app/faq/FaqPageClient.tsx`, `lib/faq.ts` | Bereikbaar via header en footer; zoekfunctie, categorieën, contact- en feedbackroutes aanwezig. Tabs ondersteunen pijlen/Home/End; antwoorden zijn buttons met `aria-expanded`. |
| Feedback | `app/feedback/page.tsx` | Behoudt invoer bij fout, heeft retry via opnieuw versturen en toegankelijke status/foutmelding. Zie de eerdere formulieraudit voor de al uitgevoerde foutcopy-correctie. |
| Account | `app/account/AccountPageClient.tsx` | FAQ was beschikbaar; directe contactroute toegevoegd voor ingelogde gebruikers. Uitloggen blijft een duidelijke eigen actie; er is geen accountverwijdering gesuggereerd. |
| Login | `app/login/page.tsx`, `components/JwtLoginForm.tsx`, `components/LoginWithGoogle.jsx`, `components/LoginErrorAlert.tsx` | Veilige, bestaande return-to-flow behouden. Ongeldige gegevens, netwerk/server en Google-fouten gebruiken toegankelijke foutcopy; loading voorkomt dubbele acties. |
| Footer en header | `components/SiteFooter.tsx`, `components/home/navBar.tsx` | FAQ staat in beide navigaties; mobiele menu-links hebben een focus trap, Escape-sluiting en minimaal 44px hoge interactieve elementen. Footercontactroute is gecorrigeerd. |
| Error states | `app/zoeken/error.tsx`, `app/ontdek/error.tsx`, formulier- en nieuwsbriefpaden | Passende eerste herstelactie (opnieuw proberen/opnieuw versturen) is aanwezig. Niet overal onnodig een contactlink toegevoegd. |
| 404 | `app/not-found.tsx` | Herstelnavigatie naar home, zoeken en ontdekken toegevoegd. |

## Bevindingen

| ID | Route/component | Probleem | Prioriteit | Status / oplossing |
| --- | --- | --- | --- | --- |
| SUPPORT-01 | Footer, `components/SiteFooter.tsx` | De onderste zichtbare link “Contact” opende alleen een e-mailclient, terwijl een publieke contactpagina met formulier bestaat. | P2 | Opgelost: de link gaat locale-aware naar `/contact`; het expliciete e-mailadres bovenaan de footer blijft beschikbaar. |
| SUPPORT-02 | Account, `app/account/AccountPageClient.tsx` | Een ingelogde gebruiker kon vanuit het accountscherm wel de FAQ, maar niet rechtstreeks de contactpagina bereiken. | P2 | Opgelost: een derde, locale-aware actie “Neem contact op” toegevoegd naast opgeslagen items en FAQ. |
| SUPPORT-03 | 404, `app/not-found.tsx` | Een onbekende route toonde alleen tekst en bood geen route om verder te gaan. | P2 | Opgelost: locale-aware links naar home, zoeken en ontdekken toegevoegd; alle links hebben mobiele aanraakhoogte en zichtbare toetsenbordfocus. |

### Reproduceerbaarheid en oorzaak

- **SUPPORT-01:** open een willekeurige pagina, scroll naar de footer en activeer “Contact”. Voorheen opende dit `mailto:uitjesnl@events.nl`; de oorzaak was een afzonderlijke mailto-link op `SiteFooter.tsx`. Verwacht: de openbare contactactie opent de contactroute. Geen backend- of productbesluit nodig.
- **SUPPORT-02:** log in, open `/account` en bekijk de actieknoppen. Voorheen ontbrak `/contact`; de oorzaak was dat de accountactiegroep alleen opgeslagen items en FAQ bevatte. Verwacht: hulpvragers kunnen vanuit hun account direct contact opnemen. Geen backend- of productbesluit nodig.
- **SUPPORT-03:** open een niet-bestaande route, bijvoorbeeld `/bestaat-niet`. Voorheen eindigde de gebruiker op een tekstuele 404 zonder actie; de oorzaak was de minimale `app/not-found.tsx`. Verwacht: ten minste een route naar home en relevante vervolgnavigatie. Geen backend- of productbesluit nodig.

## Publieke informatie en open beslissingen

- **Privacyverklaring (bestaand, P1):** `components/SiteFooter.tsx` bevat nog een locale-aware `/privacy`-link, maar er is geen `app/privacy/page.*`, goedgekeurde verklaring of externe privacy-URL. Dit is de reeds gedocumenteerde blokkade `QUAL-01` uit `docs/frontend-completeness-audit.md`; geen juridische tekst of willekeurige vervanging toegevoegd.
- **Algemene voorwaarden:** er is geen voorwaardenpagina of voorwaardenlink gevonden. De frontend biedt geen eigen betaalde functies, abonnementen of checkout; eventuele tickets verwijzen naar externe aanbieders. Er is daarom geen lege voorwaardenpagina gemaakt.
- **FAQ-inhoud:** geen aantoonbaar verouderd antwoord gevonden binnen deze scope. Er is geen nieuwe inhoud over niet-bestaande functies toegevoegd.

## Toegankelijkheid en mobiel

Broncodecontrole bevestigt voor de onderzochte supportroutes responsieve breedtes, `min-h-11`/`min-h-12` op relevante acties, gekoppelde formuliervelden en focusstijlen. De nieuwe accountactie breekt op kleine schermen terug naar één kolom; de 404-links stapelen daar eveneens. De footer- en 404-bestemmingen zijn locale-aware.

Een visuele browsercontrole op 320px, 375px, 430px en 768px kon in deze geïsoleerde omgeving niet worden bevestigd. Handmatig nog controleren: Forminit-validatie/bedankt- of foutpagina, lange vertalingen in de nieuwe accountactie en horizontale overflow bij de genoemde viewportbreedtes.

## Eerdere onderzoeken

- `docs/frontend-forms-reliability-audit.md`: formuliergedrag, inclusief behoud van invoer, loginfouten en Forminit-beperking.
- `docs/frontend-completeness-audit.md`: bestaande privacyblokkade en publieke-route-inventarisatie.
- `docs/frontend-accessibility-audit.md` en `docs/frontend-mobile-ux-audit.md`: bredere eerdere toegankelijkheids- en mobiele controles.

## Validatie

- `npx tsc --noEmit`: geslaagd.
- `npm test`: geslaagd — 39 tests, 39 passed.
- `git diff --check`: geslaagd. Git gaf alleen bestaande LF-naar-CRLF-normalisatiewaarschuwingen bij gewijzigde bronbestanden.
- `npm run build`: geblokkeerd door Windows-omgeving/cache, niet door een bewezen codefout: `EPERM: operation not permitted, mkdir 'C:\\Users\\Marco\\EventsPlanner\\frontend\\.next\\server\\app\\inspiratie\\[category]'`. Volgens opdracht zijn geen processen beëindigd en geen actieve buildbestanden verwijderd.
- Geen Playwright uitgevoerd, volgens opdracht.
