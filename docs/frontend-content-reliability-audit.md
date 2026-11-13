# Betrouwbaarheid van evenementen, prijzen en beoordelingen

Datum: 13 november 2026  
Scope: frontendonderzoek en één kleine, bewezen zoekcorrectie. Geen backend-, datamodel-, API-contract-, authenticatie- of i18n-wijzigingen; geen Playwright uitgevoerd.

## Samenvatting

De frontend heeft zowel API-gedreven content als expliciete dummy-, mock- en redactionele fallbackdata. De componenten presenteren ontbrekende prijs- en reviewwaarden meestal niet als feit, maar diverse publieke routes tonen wel vaste evenement-, festival- en detailinformatie zonder een actuele bron of zichtbare voorbeeldmarkering. Dat is een informatiekwaliteitsrisico en geen probleem dat veilig met een nieuwe frontendfallback kan worden opgelost.

Eén concrete fout is gecorrigeerd: de gratisfilter in Zoeken beschouwde elke prijs met een `0` als gratis. Daardoor kon bijvoorbeeld `EUR 10 - EUR 35` ten onrechte als gratis worden gefilterd. Alleen een expliciet gratis/free-label of een los nulbedrag telt nu als gratis.

## Gecontroleerde routes en componenten

| Onderdeel | Bronnen | Vaststelling |
| --- | --- | --- |
| Homepage | `app/page.tsx`, `app/event-details/eventDetailsData.ts` via agendaonderdelen | De homepage componeert vaste secties. De gedeelde eventdata bevatten vaste datums en prijzen; zie de bestaande QUAL-02-bevinding. |
| Zoeken | `lib/search/searchResults.ts`, `components/search/SearchResultsExperience.tsx`, `components/ui/ResultCard.tsx` | Combineert inspiratie-dummydata, festivaldata en city-content API-data. Prijs en reviewweergave is optioneel; de gratisclassificatie is gecorrigeerd. |
| Ontdek | `components/city-explore/*`, `lib/api/cityContent.ts`, `lib/exploreDetailData.ts` | API-velden worden genormaliseerd; bij lege of falende bron zijn mock- en dummykaarten actief. Sommige vaste detailteksten bevatten status-, prijs- en openingsclaims. |
| Inspiratie | `lib/dummy/inspirationResults.ts`, `components/inspiration/*`, `lib/inspiration/cityContentMapper.ts` | De afgesproken dummybron levert vaste prijs-, rating-, review- en categoriegegevens, inclusief `Vandaag` en `Gratis`. Zonder zichtbare demo-aanduiding kan dit als actueel overkomen. |
| Jaarkalender | `app/jaarkalender/data.ts`, `lib/eventDateLabels.ts` | Datumlabelhelper verwerkt datum-only waarden lokaal en gebruikt relatieve labels alleen met een huidige klok. De kalenderinhoud zelf is de eerder vastgestelde vaste 2024-voorbeelddata (QUAL-03). |
| Festivals | `app/festivals/data.ts`, `app/festivals/[events]/page.tsx` | Vaste festivaldata bevat data, ticketprijzen, line-ups, badges en faciliteitsclaims. Ticketknoppen openen een zoekopdracht, geen actuele voorraad- of boekingscontrole. |
| Details | `app/ontdek/[slug]/page.tsx`, `lib/exploreDetailData.ts`, `app/events/[id]/page.jsx` | Detailpagina's mengen bronvelden met fallbacks; de vaste ontdekdetails bevatten onder meer `VANDAAG OPEN` en openingsuren. `/events/[id]` toont bij ontbrekende prijs `Onbekend`. |
| Favorieten | `lib/favorites.ts`, `lib/savedPlaces.ts`, `components/SavedFavoritesPage.tsx` | Backendfavorieten en browseropslag bewaren momentopnames. Er is geen automatische hercontrole of verouderingsmarkering voor al opgeslagen gegevens. |

## Prijzen en gratislabels

### Herkomst en bestaand gedrag

- City-content draagt `price_min`, `price_max`, `price_note` en `is_free` aan. De adapters tonen `price_note` eerst, daarna `Gratis` bij een expliciet gratisveld en anders een prijs/range. Ontbrekende prijzen worden doorgaans niet getoond.
- `ResultCard` toont alleen een aanwezige prijsstring; er wordt daar geen `€0` gefabriceerd.
- `app/events/[id]/page.jsx` toont bij een ontbrekende prijs expliciet `Onbekend`.
- Inspiratie-, Ontdek- en festivalfallbacks bevatten vaste prijsstrings, zoals `Gratis`, `Vanaf EUR 0` en ticketprijzen. Voor die waarden is vanuit de frontend geen actuele bron of tijdstip af te leiden.
- `lib/exploreDetailData.ts` heeft een afzonderlijke fallback `Prijs op aanvraag`; dat is niet hetzelfde als een actuele prijsbevestiging.

### Uitgevoerde correctie: gratisfilter

`mapInspirationResult` gebruikte eerder `prijs.includes("0")`. Daarmee werden ook betaalde bedragen zoals `EUR 10 - EUR 35` en `EUR 100` als gratis aangemerkt. `isPriceLabelFree()` accepteert nu alleen:

- het zelfstandige label `Gratis` of `Free`; of
- een zelfstandig nulbedrag, bijvoorbeeld `Vanaf EUR 0`.

De gerichte test dekt beide positieve gevallen én de betaalde bedragen. Deze wijziging verandert geen API-contract of weergegeven prijs.

## Beoordelingen en reviews

- City-content kent optionele `rating_value`, `review_count`, `rating_source`, `rating_max` en `reviews_href`. Waarden worden op eindigheid en bereik genormaliseerd.
- `ResultCard` toont een score en reviewaantal alleen wanneer zowel een eindige score als een positief reviewaantal bestaan. Ontbrekende gegevens worden dus niet als nul reviews of een standaardscore gepresenteerd.
- De kaart toont de bronnaam niet naast score en reviewaantal, hoewel `rating_source` in adapters beschikbaar is. Zonder `reviews_href` is het getoonde aantal niet rechtstreeks verifieerbaar door de bezoeker.
- `lib/dummy/inspirationResults.ts` en `components/city-explore/data.ts` bevatten vaste scores, reviewaantallen en bronlabels zoals Google. Deze zijn geen vanuit de UI verifieerbare live reviews en worden op actieve fallbackpaden zonder algemene voorbeeldmarkering getoond.

Er is geen fictieve review toegevoegd of ingevulde ontbrekende score aangetroffen in `ResultCard`; de betrouwbaarheid van vaste fallbackwaarden is wel een open databronbeslissing.

## Datums, relatieve labels en tijdzones

- `lib/eventDateLabels.ts` behandelt `YYYY-MM-DD` als lokale kalenderdag, zodat UTC-parsing de dag niet verschuift. Met een actuele `now` geeft de helper alleen `Vandaag`, `Morgen` of `Dit weekend` terug wanneer de datumbereiken werkelijk overlappen; zonder lokale klok blijft een concrete datum zichtbaar.
- De actieve Jaarkalender genereert echter vaste voorbeeldinhoud voor 2024. Dit is reeds vastgelegd als **QUAL-03** in `docs/frontend-completeness-audit.md`; deze audit dupliceert de technische analyse niet.
- `app/event-details/eventDetailsData.ts` bevat vaste agenda-inhoud voor augustus–november 2026. Op de auditdatum is een deel verlopen; dit is reeds **QUAL-02**.
- Festivaldata, homepage-agendadata en enkele vaste ontdekdetails bevatten eveneens kalenderjaartallen, tijden of relatieve statuswoorden. Hun actualiteit kan de frontend niet bevestigen.

## Beschikbaarheid, tickets en links

- `buildTicketSearchHref()` opent een externe webzoekopdracht naar tickets/reserveren. Een knop als `Bekijk tickets` bewijst dus geen voorraad, beschikbaarheid of boekmogelijkheid.
- Festivaldetails bevatten vaste claims over tickets, pendelbussen, faciliteiten, kluisjes en toegankelijkheid. De code haalt geen realtime status op.
- Vaste ontdekdetails bevatten claims zoals `VANDAAG OPEN`, openingsuren en `Vanavond`; city-contentdetails gebruiken waar beschikbaar bronvelden, maar vallen anders terug op generieke teksten.
- De gebruikelijke formulering `Controleer vooraf de beschikbaarheid` is geen realtimeclaim en is daarom op zichzelf acceptabel.

## Fallback- en voorbeeldgegevens

| Bron | Actief pad | Risico voor bezoeker |
| --- | --- | --- |
| `lib/dummy/inspirationResults.ts` | Inspiratie en Zoeken | Vaste prijzen, Google-scores/reviewaantallen en categorieën als `Vandaag` kunnen actueel lijken. |
| `components/city-explore/data.ts` | Ontdek bij ontbrekende events en vaste detailfallbacks | Vaste status, prijs, review- en beschikbaarheidswaarden kunnen als brondata ogen. |
| `lib/exploreDetailData.ts` | Ontdekdetail zonder passende API-record | Sommige teksten noemen dummydata intern, maar de publieke vaste details zijn niet overal als voorbeeld gemarkeerd. |
| `app/festivals/data.ts` | Festivals, festivalzoekresultaten | Vaste line-ups, prijsniveaus en faciliteiten hebben geen live-bron of bijwerkdatum. |
| `app/jaarkalender/data.ts` | Jaarkalender en kalenderdetails | Verlopen voorbeelddata wordt in een publieke kalender getoond; reeds QUAL-03. |

Afbeeldingsfallbacks in `lib/activityImages.ts` zijn alleen generieke sfeerbeelden en doen geen inhoudelijke gebeurtenisclaim. Zij zijn geen prijs-, datum- of beschikbaarheidsbron.

## Bevindingen en opvolging

| ID | Ernst | Bevinding | Benodigde beslissing |
| --- | --- | --- | --- |
| REL-01 | P1 | Publieke vaste event-, festival- en detailgegevens ogen deels actueel, terwijl de frontend geen actualiteit of beschikbaarheid kan controleren. | Kies een actuele, goedgekeurde contentbron of markeer/ontkoppel deze routes als voorbeeld/archief. |
| REL-02 | P1 | Fallbacks tonen vaste Google-scores en reviewaantallen zonder zichtbare bronverwijzing of algemene demo-indicatie. | Bevestig een verifieerbare ratingsbron en toon bron/URL, of verberg ratings in fallbackdata. |
| REL-03 | P1 | Jaarkalender toont vaste 2024-data als agenda. | Reeds QUAL-03: actuele bron of expliciete archief/demo-status vereist. |
| REL-04 | P1 | `/event-details` bevat gedeeltelijk verlopen vaste 2026-inhoud. | Reeds QUAL-02: productbesluit over actuele bron of navigatie nodig. |
| REL-05 | P2 | Favorieten zijn momentopnames; er is geen freshnesscontrole na opslaan. | Beslis of een toekomstige bron-update of `last_updated`-veld nodig is; geen client-side datum verzinnen. |
| REL-06 | opgelost | Zoeken classificeerde elk prijslabel met een `0` als gratis. | Gecorrigeerd met exacte gratis/nulbedragdetectie en regressietest. |

## Uitgevoerde wijzigingen

1. `lib/search/searchResults.ts`: gratisclassificatie beperkt tot expliciete gratis/free-tekst of een zelfstandig nulbedrag.
2. `lib/search/searchSelectors.test.ts`: regressietest toegevoegd voor gratis, nulbedrag, `EUR 10 - EUR 35` en `EUR 100`.

Geen prijzen, events, reviews, beschikbaarheid of fallbackbronnen zijn toegevoegd, verwijderd of inhoudelijk herschreven.

## Handmatige controles na een toekomstige databronbeslissing

- Vergelijk getoonde prijs, ticketlink, datum/tijd, locatie en beschikbaarheid met de aanbieder op dezelfde dag.
- Controleer dat een score en reviewaantal een zichtbare, werkende bronlink en herleidbare herkomst hebben.
- Open zowel een API-gedreven detail als een fallbackdetail en controleer of de status voor bezoekers voldoende herkenbaar is.
- Bewaar een item, wijzig of verwijder het aan de bron en bepaal het gewenste gedrag voor een verouderd opgeslagen item.

## Validatie

Uitgevoerd na de correctie: TypeScript-controle, bestaande tests, productiebuild en `git diff --check`. Geen Playwright gebruikt.
