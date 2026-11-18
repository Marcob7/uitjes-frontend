# Browserpermissies- en locatieaudit

Datum: 18 november 2026  
Scope: uitsluitend `frontend/`; geen Playwright, backend-, API-, dataset-, privacyverklaring- of i18n-architectuurwijzigingen.

## Samenvatting

De frontend gebruikt één werkelijke browserpermissie: `navigator.geolocation.getCurrentPosition()` in de Inspiratiewizard. De aanvraag gebeurt alleen na de expliciete actie **Gebruik mijn locatie**. Er zijn geen aanroepen aangetroffen naar `navigator.permissions`, `watchPosition`, `getUserMedia`, `mediaDevices`, camera-, microfoon- of bestandkiezer-API's binnen de actieve frontendbroncode. Externe kaarten en gewone links zijn geen browserpermissies.

Drie kleine, bewezen P2-correcties zijn uitgevoerd: uitleg vóór de prompt, een duidelijke weigermelding en bescherming tegen dubbele/verouderde locatieaanvragen. Handmatige stadselectie blijft altijd beschikbaar.

## Bestaande flow

1. Bezoeker opent `/inspiratie`; er wordt geen locatieprompt gedaan.
2. De wizard opent de stadsstap met een bruikbaar combobox-veld en stadslijst.
3. Alleen een klik op **Gebruik mijn locatie** roept `getCurrentPosition()` aan, met `enableHighAccuracy: false`, maximaal vijf minuten cache en een timeout van tien seconden.
4. Bij succes worden coördinaten uitsluitend lokaal vergeleken met de bestaande ondersteunde inspiratie-steden; de dichtstbijzijnde bestaande stad wordt gekozen.
5. De stadsselectie werkt daarna hetzelfde als een handmatige keuze en kan opnieuw worden aangepast.
6. Bij fout of ontbrekende browserondersteuning stopt de laadstatus en blijft de handmatige stadkeuze beschikbaar.

## Bevindingen

| ID | Onderdeel | Probleem | Prioriteit | Status / oplossing |
| --- | --- | --- | --- | --- |
| GEO-01 | `components/inspiration/InspirationCityStep.tsx` | De linktekst “Gebruik mijn locatie” legde vóór de browserprompt niet uit dat alleen een ondersteunde stad wordt gekozen en dat handmatig kiezen mogelijk blijft. | P2 | Opgelost: zichtbare, aan de knop gekoppelde uitleg toegevoegd. |
| GEO-02 | `components/inspiration/InspirationChoiceFlow.tsx` | Een geweigerde toestemming kreeg dezelfde generieke melding als een timeout, ontbrekende ondersteuning of tijdelijk onbeschikbare positie. | P2 | Opgelost: `PERMISSION_DENIED` krijgt een begrijpelijke, niet-technische melding; overige fouten behouden de bestaande herstelroute via stadselectie. |
| GEO-03 | `components/inspiration/InspirationChoiceFlow.tsx` | Tijdens een lopende browseraanvraag kon een handmatige stadkeuze nog worden overschreven door een vertraagde locatierespons. | P2 | Opgelost: een request-id annuleert verouderde callbacks; tevens voorkomt een pending-ref dubbele gelijktijdige aanvragen. |

### Reproduceerbaarheid en oorzaak

- **GEO-01:** open `/inspiratie` en lees de locatieactie voordat je klikt. Voorheen ontbrak de doel- en vrijwilligheidsuitleg; oorzaak was alleen een knoplabel. Verwacht: duidelijk dat locatie een vrijwillige snelkoppeling naar een ondersteunde stad is. Niet in een echte browser bevestigd.
- **GEO-02:** weiger de browserprompt. Voorheen verscheen de algemene melding “We konden je locatie niet bepalen”; oorzaak was een foutcallback zonder inspectie van `GeolocationPositionError.code`. Verwacht: de gebruiker begrijpt dat toestemming is geweigerd en kan handmatig kiezen. Niet in een echte browser bevestigd.
- **GEO-03:** activeer locatie, kies vóór de callback handmatig een andere stad en laat de callback daarna terugkeren. Voorheen riep de callback altijd `selectCity` aan; oorzaak was geen correlatie tussen een aanvraag en latere handmatige invoer. Verwacht: handmatige keuze blijft leidend. Broncode bevestigd; nog handmatig te simuleren.

## Toegankelijkheid en mobiel

- De locatieactie is een echte knop, heeft minimaal 44px hoogte, een zichtbare toetsenbordfocus en `aria-describedby` naar de uitleg.
- Tijdens verwerking is de knop disabled en toont zij de bestaande laadtekst; foutmeldingen gebruiken `role="alert"`.
- De stadszoeker, lijst en keuze blijven naast de locatieactie beschikbaar en werken met toetsenbord, pijlen, Enter en Escape.
- De actie en melding wrappen in een flex-container; code-inspectie toont geen vaste breedte die op 320px, 375px, 430px of 768px overflow afdwingt.

Een visuele en echte-permissiecontrole in mobiele browsers kon in deze omgeving niet worden bevestigd. Test daarom handmatig: toestaan, weigeren, timeout/offline, niet-beschikbare positie, snel dubbel klikken, handmatige stadkeuze tijdens een open prompt en lange Engelse tekst op 320px/375px/430px/768px.

## Privacy en gegevensverwerking

Uit de frontendcode blijkt uitsluitend het volgende:

- De browser levert latitude/longitude aan `InspirationChoiceFlow` na de expliciete gebruikersactie.
- Coördinaten worden alleen als functie-invoer gebruikt om met `resolveNearestInspirationCityFromCoordinates` een bestaande stadsslug te bepalen.
- De gekozen stadsslug wordt in componentstate en de bestaande URL-query `city` bewaard; coördinaten zelf komen niet in URL, localStorage, cookie, API-request of externe geocodingdienst terecht.
- Er is geen `watchPosition`; locatie wordt niet gevolgd.

De definitieve privacyverklaring ontbreekt nog steeds. Dit is de reeds bekende, afzonderlijke product/juridische blokkade en is niet binnen deze sprint gewijzigd.

## Bewust ongewijzigd

- De bestaande set ondersteunde steden en de dichtstbijzijnde-stadberekening.
- Browseropties, backend- en city-content-verzoeken.
- De bestaande handmatige stadszoeker en URL-canonicalisatie.
- Geen Permissions API, nieuwe bevestigingsmodal, geocodingdienst, opslag of dependency toegevoegd.

## Gerichte regressie en validatie

De bestaande testinfrastructuur is beperkt tot pure TypeScript-tests en bevat geen DOM- of browser-geolocationmock. Daarom zijn geen schijnbare componenttests toegevoegd; de callbacks moeten handmatig in een echte browser worden getest. TypeScript en de bestaande regressies valideren wel de compileerbaarheid en bestaande 39 testpaden.

- `npx tsc --noEmit`: geslaagd.
- `npm test`: geslaagd — 39 tests, 39 passed.
- `npm run build`: geblokkeerd door de Windows-omgeving/cache, niet door een bewezen codefout: `EPERM: operation not permitted, mkdir 'C:\\Users\\Marco\\EventsPlanner\\frontend\\.next\\server\\app\\ontdek\\[slug]'`. Er zijn geen processen beëindigd en geen actieve buildbestanden verwijderd.
- `git diff --check`: geslaagd; zie de Git-controle hieronder voor bestaande CRLF-waarschuwingen.

## Verwante audits

- `docs/frontend-completeness-audit.md`: eerdere inventarisatie van locatiegebruik en open privacybeslissing.
- `docs/frontend-accessibility-audit.md` en `docs/frontend-mobile-ux-followup.md`: bestaande algemene toetsenbord- en mobiele controles.
