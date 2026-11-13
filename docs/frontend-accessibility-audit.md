# Frontend toegankelijkheidsaudit — 13 november 2026

## Scope en methode

De audit is beperkt tot de bestaande frontend-routes en de gedeelde interactieve
componenten die zij gebruiken. De broncode is gecontroleerd op semantiek,
toegankelijke namen, toetsenbordbediening, focusbeheer, statusmeldingen en
zichtbare focusstijlen. De resultatenlijst op `/ontdek` is daarbij als
volwaardige, onafhankelijk bedienbare route beoordeeld; de kaart is aanvullend.

Gecontroleerde routes:

- `/`: navigatie, hero en zoekformulier
- `/ontdek`: resultatenlijst, kaart, filters, mobiele kaartweergave en paginering
- `/zoeken`: formulier, resultaten, foutstatus en filterpaneel
- `/inspiratie`, `/inspiratie/[category]`, `/inspiratie/[category]/[slug]`: wizard,
  keuzeopties, resultaatkaarten en bewaaracties
- `/jaarkalender`: maandnavigatie, dagen en filterdialoog
- `/festivals/kalender`: zoeken, kalender en filters
- `/saved`: favorieten, loading-, fout- en retry-status
- `/uitjes`: resultaatkaarten en links

## Bevindingen en uitgevoerde correcties

| Probleem | Route | WCAG 2.2 | Ernst | Oplossing |
| --- | --- | --- | --- | --- |
| Er was geen herhaalbare toetsenbordroute om de vaste navigatie over te slaan en direct de inhoud te bereiken. | Alle routes | 2.4.1 Blokken omzeilen (A) | P1 | Een zichtbare-bij-focus skiplink naar `#app-shell-content` toegevoegd; het doel is programmatisch focusbaar. |
| Het filterpaneel kon sluiten met Escape en herstelde focus, maar Tab kon naar de inhoud achter de modale dialoog ontsnappen. | `/zoeken` | 2.1.2 Geen toetsenbordval (A), 2.4.3 Focusvolgorde (A) | P1 | Het bestaande focus-trap-hulpmiddel toegepast op het paneel; Escape blijft sluiten en focus keert terug naar de trigger. |
| Kalenderlinks hadden op mobiel alleen een naam zoals `1 openen`; de datum en het doel waren daardoor niet ondubbelzinnig. | `/jaarkalender` | 2.4.4 Linkdoel (in context) (A), 2.5.3 Label in naam (A) | P1 | Elke actieve daglink krijgt nu een volledige, programmatisch bepaalde datumnaam, bijvoorbeeld `Bekijk activiteiten op dinsdag 1 oktober`. |

Er zijn precies drie kleine P1-correcties uitgevoerd. Er zijn geen P0-problemen
vastgesteld.

## Gecontroleerde positieve patronen

- De mobiele navigatie, ontdekfilters, mobiele kaart en jaarkalenderfilters
  hebben Escape-afhandeling, focusopslag/-herstel en een focus-trap.
- Interactieve elementen in de beoordeelde flows zijn overwegend semantische
  links of knoppen, met expliciete `type="button"` in formulieronafhankelijke
  knoppen.
- De ontdekkaart gebruikt benoemde `button`-markers; de resultatenlijst blijft
  beschikbaar zonder kaartinteractie.
- Relevante loading- en fouttoestanden op `/ontdek`, `/zoeken` en `/saved`
  gebruiken `role="status"` respectievelijk `role="alert"`; retryknoppen zijn
  benoemd en krijgen een disabled state tijdens een actieve poging.

## Contrastcontrole

De volgende directe voorgrond/achtergrondcombinaties uit de aangepaste en
beoordeelde flows zijn berekend met de WCAG-relatieve-luminantieformule:

| Combinatie | Verhouding | Resultaat |
| --- | ---: | --- |
| `#1D5A46` op `#FFFFFF` | 8.07:1 | AA normale tekst |
| `#171511` op `#FFFFFF` | 18.23:1 | AA normale tekst |
| `#005FCC` op `#FFFFFF` | 5.98:1 | AA normale tekst / focusindicator |
| `#65736C` op `#FFFFFF` | 4.97:1 | AA normale tekst |
| `#66594E` op `#FFFDF9` | 6.66:1 | AA normale tekst |

Transparante lagen, video-achtergronden, afbeeldingen en MapLibre-tegels kunnen
niet betrouwbaar met alleen bronanalyse worden beoordeeld. Er zijn daarom geen
visuele stijlwijzigingen gedaan op basis van een aanname.

## Niet vastgesteld als probleem / later handmatig controleren

De beschikbare gecontroleerde browser kon geen lokale ontwikkelserver bereiken:
een verzoek aan `localhost:3001` werd door het besturingssysteem geweigerd.
Daarom zijn onderstaande controles niet als browserobservatie bevestigd.

- Een browsermatige toetsenbordloop op alle breakpoints, inclusief de
  daadwerkelijk gerenderde MapLibre-canvas en externe kaarttegels.
- Schermlezer-aankondigingen in NVDA/Firefox of VoiceOver/Safari, met name bij
  dynamische zoek- en favorietenresultaten.
- Contrast op dynamische media en transparante overlays bij alle videoframes.
- De volledige headingstructuur en linknamen met productiegegevens, omdat de
  lokale routes afhankelijk zijn van runtimegegevens en externe kaarten.

Deze punten zijn geen geverifieerde defecten en vereisen een handmatige
browser- en assistieve-technologietest voordat ze als bevinding worden gepland.

## Regressiedekking en validatie

`calendarSelectors.test.ts` controleert nu expliciet dat een actieve
kalenderdag een volledige toegankelijke datumnaam levert. De bestaande
`focusTrap.test.ts` dekt de focus-wrap die nu ook door het zoekfilterpaneel
wordt gebruikt.

Uitgevoerd vanaf `frontend`:

- `npx tsc --noEmit`
- `npm test`
- `npm run build`
- `git diff --check`
