# Frontendformulier-betrouwbaarheidsaudit

Datum: 18 november 2026  
Scope: uitsluitend `frontend/`. Geen backend-, API-contract-, privacy-, i18n- of Playwright-wijzigingen.

## Samenvatting

De echte verzendformulieren hebben bestaande native of componentgebonden
validatie, een geblokkeerde submit tijdens asynchrone verzending en een
succes- of foutpad. Zoek- en filterformulieren veranderen uitsluitend lokale
state of de URL; zij doen geen gegevensverzending. De return-to-beveiliging
van de bestaande JWT- en Google-flow is niet aangepast.

Drie kleine, bewezen correcties zijn uitgevoerd:

1. Feedbackfouten tonen nu statusgebonden, veilige en uitvoerbare copy in
   plaats van een mogelijk technische response body of netwerkfout.
2. De twee verplichte JWT-velden tonen weer de bestaande zichtbare
   verplichtmarkering (`*`).
3. De Google-login-knop wordt bij de start van de redirect uitgeschakeld,
   krijgt een laadtekst en voorkomt zo herhaald activeren.

## Inventarisatie

| Flow | Locatie | Soort | Validatie en versturen | Beoordeling |
| --- | --- | --- | --- | --- |
| Contact | `app/contact/page.tsx` | Externe gegevensverzending (Forminit) | Naam, e-mail, onderwerp en bericht zijn native `required`; e-mail is `type=email`. Forminit handelt navigatie en bevestiging af. | Veldlabels, hints en zichtbare `*` zijn aanwezig. Loading/fout/succes zijn niet frontend-eigen te bevestigen zonder het Forminit-contract. |
| Feedback | `app/feedback/page.tsx` | API-verzending | Bericht is verplicht en minimaal 10 tekens; e-mail is expliciet optioneel en `type=email`. Knop is disabled met **Versturen…**; succes wist invoer, fouten behouden invoer. | Gecorrigeerde veilige foutcopy en juiste `aria-invalid`-toepassing. |
| Nieuwsbrief | `components/NewsLetterSection.tsx` | API-verzending | E-mail is `required` en `type=email`. Knop is disabled met **Bezig…**; bevestigde success reset het e-mailadres, fouten behouden het. | Statusbericht gebruikt `role=status` en `aria-live=polite`. |
| JWT-login | `components/JwtLoginForm.tsx` | API-verzending | Identifier en wachtwoord zijn verplicht. Lege waarden blokkeren de submit; tijdens login zijn velden en knop disabled. | Authfouten gaan via de bestaande toegankelijke `LoginErrorAlert`; verplichte markering hersteld. |
| Google-login | `components/LoginWithGoogle.jsx` | OAuth-redirect | Geen invoervelden. De bestaande veilige `returnTo` wordt doorgegeven aan de bestaande helper. | Gecorrigeerd: knop krijgt een laadstatus en blokkeert dubbel activeren tot de redirect. |
| Algemene zoekbalk | `components/search/SearchForm.tsx`, `components/ui/app/AppSearchInput.tsx` | URL-state | Lege invoer krijgt een gekoppelde foutmelding en focus keert naar het veld; pending navigatie is aangekondigd. | Geen gegevensverzending. |
| Hero-zoekbalk | `components/home/homeVideoSection.tsx` | Route-navigatie | Lege invoer krijgt live foutmelding en focus; navigatie blokkeert een tweede actie. | Geen gegevensverzending. |
| Festivalzoeker | `app/festivals/kalender/page.tsx` | URL-state | Lege invoer krijgt gekoppelde live foutmelding; router-pending blokkeert de knop. | Geen gegevensverzending. |
| FAQ-zoeker | `app/faq/FaqPageClient.tsx` | Lokale filter/scroll | Lege invoer is toegestaan en leidt naar de FAQ-sectie. | Geen gegevensverzending; geen validatie nodig. |
| Jaarkalenderfilters | `app/jaarkalender/JaarkalenderFilterControls.tsx` | URL-state | Filterkeuzes en zoekactie veranderen bestaande URL/state. | Geen gegevensverzending. |
| Opgeslagen items zoeken | `components/SavedFavoritesPage.tsx` | Lokale filterstate | Vrije tekst filtert direct; een leeg veld is een geldige filtertoestand. | Geen gegevensverzending. |
| Inspiratiewizard | `components/inspiration/InspirationChoiceFlow.tsx`, `InspirationCityStep.tsx` | Lokale keuze- en URL-state | Een stad moet uit de ondersteunde lijst komen; keuze- en locatieproblemen worden als alert gemeld. De vervolgkeuzes worden als expliciete kaarten gekozen. | Geen gegevensverzending; keuzes en navigatie zijn lokaal. |

`app/feedback-test/page.tsx` is een ontwikkel-/testpagina die echte records
kan posten, maar hoort niet bij de gebruikersflow. Hij is niet gewijzigd om
geen test- of backendgedrag buiten deze scope te veranderen.

## Verzend-, succes- en foutroutes

- **Contact:** browser-native validatie voorkomt lege of ongeldige e-mailinput.
  Omdat het HTML-formulier rechtstreeks naar Forminit post, zijn een lokale
  succesmelding, retry en foutclassificatie niet betrouwbaar toe te voegen
  zonder het providercontract over te nemen.
- **Feedback:** alle bekende responsecategorieën hebben veilige copy:
  netwerk (`0`), ongeldige invoer (`400`), toestemming/sessie (`401/403`),
  rate limit (`429`), serverfout (`5xx`) en fallback. Geen response body,
  pagina-URL of foutstack komt in de UI. Invoer wordt alleen op bevestigd
  succes gewist.
- **Nieuwsbrief:** de bestaande helper geeft success alleen door als de
  response dat bevestigt. Een netwerk- of onbekende fout wordt niet als
  succes gepresenteerd en de e-mail blijft staan voor een nieuwe poging.
- **JWT:** de bestaande authlaag vertaalt 401/403 naar onjuiste gegevens en
  netwerk/serverproblemen naar vaste gebruikerscopy. Alleen een geslaagde
  login roept de bestaande veilige terugnavigatie aan.
- **Google:** er is per definitie geen lokale OAuth-succesbevestiging voor de
  redirect. De pagina verwerkt bestaande, toegestane callbackfouten met
  `LoginErrorAlert`; de nieuwe pending state voorkomt dubbel klikken.

## Toegankelijkheid en mobiel

- De echte invoervelden hebben gekoppelde labels. Contact, feedback en JWT
  maken verplichting zichtbaar; feedback vermeldt e-mail expliciet als
  optioneel.
- Feedback-, nieuwsbrief- en loginfouten gebruiken een alert of live status.
  Zoekfouten zijn aan het bijbehorende veld gekoppeld; de relevante
  zoekflows herstellen focus bij lege invoer.
- Submitknoppen hebben ten minste een `min-h-10`, `min-h-11` of `min-h-12`;
  contact, feedback en login schakelen op mobiel naar volle breedte waar dat
  nodig is. De nieuwsbriefinput gebruikt `min-w-0`, zodat hij naast de knop
  kan krimpen.
- Broncontrole bevestigt geen vaste viewportbreedtes die input buiten het
  scherm dwingen. Een echte rendercontrole op 375 px, 430 px en tabletbreedte
  blijft handmatig nodig voor lange vertalingen, browser-native validatiebubbels
  en externe Forminit-navigatie. Eerdere browseraudit kon de lokale server niet
  vanuit de geïsoleerde browser bereiken; er worden daarom geen
  screenshotclaims gedaan.

## Bevindingen en open beslissingen

| Ernst | Bevinding | Locatie | Vervolg |
| --- | --- | --- | --- |
| P2 | Forminit bepaalt contactsucces, -fout en eventuele anti-dubbelklik na de browsernavigatie; het contract is niet vanuit deze checkout verifieerbaar. | `app/contact/page.tsx` | Controleer de providerrespons en bevestigingspagina handmatig; wijzig geen regels zonder providercontract. |
| P2 | De nieuwsbriefhelper accepteert het bestaande `ok`/`message`-contract, maar er is geen frontendbewijs voor exacte servervalidatie of 429-copy. | `lib/newsletter.ts` | Backend/API-contract afzonderlijk documenteren als ander werk nodig is. |
| P3 | `feedback-test` kan echte feedbackrecords creëren en gebruikt een afzonderlijke, verouderingsgevoelige testflow. | `app/feedback-test/page.tsx` | Alleen in een afgeschermde ontwikkelomgeving gebruiken; productbesluit over behoud/afscherming apart nemen. |
| P3 | De feedbackpayload bevat automatisch pagina-URL en starttijd voor het bestaande anti-spammechanisme. | `app/feedback/page.tsx` | In de nog ontbrekende goedgekeurde privacyverklaring opnemen; geen juridische tekst toegevoegd. |

## Uitgevoerde correcties

1. `lib/feedback.ts` en `app/feedback/page.tsx`: foutberichten zijn nu
   op HTTP-status gebaseerd, begrijpelijk en vrij van response-body- of
   netwerkdetails. `aria-invalid` markeert niet langer het berichtveld bij
   een algemene transportfout.
2. `components/JwtLoginForm.tsx`: verwijderde onderdrukking van de bestaande
   verplichtmarkering voor identifier en wachtwoord.
3. `components/LoginWithGoogle.jsx`: redirect-pending state met disabled
   knop, `aria-busy`, laadcopy en bescherming tegen herhaald activeren.

## Gerichte regressiedekking

`lib/feedback.test.ts` verifieert de veilige foutcopy voor netwerk, 400,
401, 429, 500 en een onbekende status. Voor de clientcomponenten is geen
DOM-testomgeving aanwezig; er zijn geen testdependencies of Playwright
toegevoegd.

## Handmatige testscenario's

1. Contact: controleer op 375 px en 430 px labels, verplichte velden,
   browser-e-mailvalidatie, één submit en Forminit-bevestiging/foutpagina.
2. Feedback: probeer een leeg en een bericht onder 10 tekens; corrigeer het
   bericht; simuleer 400, 429, 5xx en offline. Controleer dat copy veilig is,
   de invoer na een fout blijft staan en alleen een succes de velden leegt.
3. Nieuwsbrief: test leeg, ongeldig, serverfout en succes. Controleer loading,
   retry, live melding en behouden e-mail bij fout.
4. JWT: probeer lege velden, onjuiste gegevens, offline en correct inloggen
   met een locale `returnTo` inclusief query. Controleer de asterisk,
   loading en terugkeerroute.
5. Google: activeer de knop dubbel snel; er mag slechts één redirect starten.
   Test tevens een toegestane en een onveilige `returnTo`.
6. Zoekers en wizard: voer lege zoektermen in, gebruik toetsenbordbediening,
   en controleer dat URL/state verandert zonder een verzoek met formulierdata.
7. Herhaal de echte invoer- en foutmeldingscontrole op 375 px, 430 px en een
   tabletbreedte; let op horizontale scroll, knoppen die worden afgekapt en overlappende
   meldingen.

## Verwante eerdere audits

- `frontend/docs/frontend-accessibility-audit.md` voor de bredere
  toetsenbord-, focus- en statuscontrole.
- `docs/frontend-mobile-ux-audit.md` voor de eerdere mobiele viewport- en
  overlaycontrole.
- `frontend/docs/frontend-login-data-minimization-audit.md` voor de
  return-to-beveiliging, dataminimalisatie en eerdere contactmarkeringen.

## Validatie

- `npx tsc --noEmit`: geslaagd.
- `npm test`: geslaagd — 39 tests, 39 passed (waaronder de nieuwe gerichte
  feedbackfouttest).
- `git diff --check`: geslaagd; Git gaf alleen bestaande
  LF-naar-CRLF-normalisatiewaarschuwingen bij drie gewijzigde bronbestanden.
- `npm run build`: niet uitvoerbaar tot voltooiing in deze checkout. Twee
  pogingen stopten tijdens de webpack-uitvoer met Windows `EPERM` bij het
  aanmaken van verschillende bestaande `.next/server/app`-mappen
  (`inspiratie/[category]` en `events/[id]`). Er draaide daarna geen
  `node`-proces. Volgens de taakafspraak zijn geen buildbestanden verwijderd
  en geen processen beëindigd; het probleem vraagt een schone, niet-vergrendelde
  buildcache of omgeving buiten deze taak.
