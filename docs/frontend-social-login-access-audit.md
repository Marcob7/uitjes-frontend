# Sociale login en accounttoegang — audit

Datum: 18 november 2026  
Scope: uitsluitend frontendonderzoek. Geen Playwright of handmatige browsercontrole uitgevoerd.

## Samenvatting

De JWT-flow is consistent uitgevoerd: verplichte velden zijn zichtbaar, de
verzendactie is tijdelijk geblokkeerd, bekende fouttypen krijgen veilige copy
en alleen een geslaagde login gebruikt de bestaande veilige terugnavigatie.
De Google-knop valideert de bestemming vóór deze aan Allauth als `next` wordt
meegegeven en voorkomt herhaalde activatie tijdens de redirect.

Er is één P1-bevinding die niet veilig binnen de frontendscope kan worden
hersteld. Een Allauth Google-login maakt een Django-sessie, maar de
`AuthProvider` kan uitsluitend een JWT-sessie als ingelogd vaststellen. De
frontend kan daarom na een geslaagde Google-callback een uitgelogde
accountstatus tonen. Dit vereist een bewust backend-authenticatiecontract en
is niet met een frontendredirect of lokale tokenwijziging op te lossen.

Er zijn geen frontendcorrecties uitgevoerd. De reeds aanwezige
authenticatiebeveiligingen zijn correct voor hun respectieve JWT- en
returnTo-verantwoordelijkheden; een frontendwijziging zou de P1 niet
daadwerkelijk oplossen.

## Bestaande loginmethoden

| Methode | Frontendpad | Vastgesteld gedrag |
| --- | --- | --- |
| JWT | `JwtLoginForm` → `AuthProvider.login` → `/api/auth/token/` → `/api/auth/me/` | Slaat alleen bij een geldige tokenrespons tokens op, leest daarna het profiel en zet pas dan de status op `authenticated`. |
| Google | `LoginWithGoogle` → `/accounts/google/login/` | Zet een redirect-pending state en geeft alleen een gevalideerde interne bestemming als Allauth `next` mee. De uiteindelijke sessie wordt niet naar frontend-JWT vertaald. |

## Gecontroleerde flows

| Flow | Beoordeling | Bronbewijs |
| --- | --- | --- |
| Lege JWT-velden | Correct | Submit is disabled zonder identifier of wachtwoord; de inputs hebben `required` en zichtbare `*`. |
| Ongeldige gegevens | Correct | 401/403 wordt naar de generieke, niet-gevoelige melding `invalidCredentials` vertaald. |
| Netwerk- en serverfout | Correct | Transportfout wordt `network`; 5xx wordt `server`; responsebodies komen niet in de UI. |
| Herstel na JWT-fout | Correct | `finally` maakt de controls weer beschikbaar; alleen succes roept `onLoginSuccess` aan. |
| Dubbel submitten JWT | Correct in de bestaande UI | Velden en submitknop worden tijdens de aanvraag disabled. |
| Google laden/dubbel activeren | Correct in de bestaande UI | De knop krijgt `disabled`, `aria-busy` en laadcopy zodra de redirect start. |
| Google annuleren/fout | Deels bevestigd | Toegestane callbackcodes worden als generieke Google-fout getoond. De daadwerkelijke Allauth-callback is extern en niet browsergetest. |
| Save-actie vanuit detail/inspiratie | Correct | `useSaveAuthentication` behoudt locale, query en hash in een interne `returnTo`. |
| `/saved` uitgelogd | Correct | Toont na authcontrole een login-CTA met locale `/saved` als `returnTo`. |
| Accountstatus en logout | Correct voor JWT | Tijdens status `checking` wordt geen in-/uitgelogde kaart getoond; logout wist de bestaande tokenopslag en state. |

## Veilige terugnavigatie

`lib/authReturnTo.ts` accepteert alleen interne, niet-lege routes zonder
control characters. Externe URLs, protocolrelatieve URLs, backslashvarianten
en meervoudig gecodeerde omzeilingen worden verworpen. Query en hash blijven
behouden voor geldige lokale paden. JWT gebruikt bij een ongeldige aanwezige
waarde de bestaande locale fallback; Google krijgt in dat geval geen `next`.

De gerichte bestaande test `lib/authReturnTo.test.ts` controleert een
locale-pad met query/hash, onveilige redirectvarianten, een geldige Google
`next` en de JWT-fallback.

## Concrete bevindingen

| ID | Onderdeel | Prioriteit | Probleem en technische oorzaak | Reproduceerstappen | Veiligheidsimpact | Browser bevestigd? | Voorgestelde oplossing |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AUTH-UX-01 | Google-login/accountstatus; `components/LoginWithGoogle.jsx`, `components/AuthProvider.tsx` | P1 | Allauth logt via een Django-sessie in, maar `AuthProvider` zoekt uitsluitend opgeslagen JWT's en `getCurrentUser` stuurt alleen `Authorization: Bearer`. Bovendien accepteert `/api/auth/me/` alleen `JWTAuthentication`. De frontend ziet de Allauth-sessie daardoor niet als ingelogd. | Start Google-login, voltooi de callback en open `/account` of `/saved`. | Geen open redirect of tokenlek aangetroffen, maar wel een onbetrouwbare accountstatus en ontoegankelijke JWT-beschermde functies na Google-login. | Nee; statisch bewezen uit de gekoppelde frontend- en backendcontracten. | Maak buiten deze taak één expliciet contractkeuze: laat de Google-callback een door de frontend ondersteunde JWT-sessie opleveren, of laat `/api/auth/me/` en de frontend de beveiligde Django-sessie veilig herkennen. Voeg daarna een integratietest toe. |
| AUTH-UX-02 | OAuth-annulering/callback; `app/login/page.tsx`, `lib/authErrors.ts` | P2 | De frontend toont alleen bekende callbackcodes. Of Allauth bij annuleren werkelijk terugkeert naar de frontend met zo'n code is geen frontendcontract. | Annuleer een Google-accountkeuze en controleer de callback-URL en loginpagina. | Geen onveilige redirect vanuit frontend aangetroffen; gebruikersfeedback is afhankelijk van de backendcallback. | Nee. | Leg callback-errorcodes of een veilige generieke callbackroute vast in de backend; wijzig geen OAuth-state of frontendgokwerk. |

## Toegankelijkheid en mobiel

- JWT-inputs hebben zichtbare labels, native verplichte velden, passende
  autocomplete-attributen en minimaal 48 px hoge controls.
- Foutmeldingen gebruiken `role="alert"`; laadstatussen gebruiken zichtbare
  copy en, waar relevant, `role="status"` of `aria-busy`.
- De loginacties zijn 48 px hoog, stapelen op kleine schermen en gebruiken
  `w-full` voor de invoer; vanuit de bron is geen vaste breedte of horizontale
  overflow in het loginformulier gevonden.
- Een werkelijke controle op 320, 375, 430 en 768 px is niet uitgevoerd,
  omdat deze taak geen browservalidatie bevatte.

## Privacy en beveiliging

- Geen logging van wachtwoorden of JWT's aangetroffen in de onderzochte
  frontendauthenticatiecode.
- Foutcopy is op vaste categorieën gebaseerd en toont geen API-responsebody,
  stacktrace of gebruikersenumeratie.
- JWT-opslag, refreshgedrag, logoutmechanisme, OAuth-state en
  Allauth-configuratie zijn niet gewijzigd.
- De enige open beveiligingsbeslissing is AUTH-UX-01: de server moet bepalen
  hoe een Google-sessie veilig in de bestaande frontendauthenticatiestatus
  past.

## Uitgevoerde verbeteringen

Geen. Maximaal drie kleine verbeteringen waren toegestaan, niet verplicht.
De enige aangetroffen functionele blokkade vereist een backendcontract; een
frontendwijziging zou de bestaande autharchitectuur veranderen zonder de
Google-sessie te kunnen bewijzen.

## Handmatige vervolgcontrole

1. Controleer JWT met onjuiste gegevens, offline, herstel na fout en een
   geldige locale `returnTo` met query/hash.
2. Controleer een Google-succes, annulering en providerfout op de echte
   frontend- en backendorigin.
3. Herhaal `/saved`, een save-actie vanuit detail en inspiratie, `/account`
   en logout op 320, 375, 430 en 768 px.
4. Bevestig na de contractkeuze voor AUTH-UX-01 dat accountstatus,
   favorieten en terugnavigatie na Google-login allemaal dezelfde sessie
   herkennen.

## Validatie

- `npx tsc --noEmit`: geslaagd.
- `npm test`: geslaagd — 39 tests, 39 passed.
- `npm run build`: geblokkeerd door de bestaande Windows-bestandslock
  `EPERM: operation not permitted, mkdir
  'C:\\Users\\Marco\\EventsPlanner\\frontend\\.next\\server\\app\\events\\[id]'`.
  Dit gebeurde tijdens webpack vóór een codefoutmelding. Er zijn geen
  buildbestanden verwijderd en geen processen beëindigd.
- `git diff --check`: geslaagd. Git meldt alleen bestaande LF-naar-CRLF
  normalisatiewaarschuwingen bij al gewijzigde, niet-door-deze-audit
  aangeraakte bestanden.
