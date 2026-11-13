# Handmatige frontend-testchecklist

Deze checklist is gebaseerd op de huidige EventsPlanner-frontend. Test op een schone browsersessie en noteer per item `geslaagd`, `mislukt` of `niet getest` achter **Resultaat**. Herlaad de pagina tussen onafhankelijke scenario's wanneer een URL-, filter- of loginstatus relevant is.

## Snelste route bij weinig tijd

Voer eerst alle P0-tests uit: HOME-01, SEARCH-01, SEARCH-02, DISCOVER-01, INSPIRE-01, CAL-01, FEST-01, SAVED-01, AUTH-01 en MOBILE-01. Deze controleren navigatie, de belangrijkste zoek- en ontdekflows, inloggen en bewaren.

Gebruik voor mobiele tests een viewport van **375 px** en herhaal de relevante controle op **430 px**. Test toetsenbordstappen op desktop met `Tab`, `Shift+Tab` en `Escape`.

## Homepage en algemene navigatie

- [ ] **HOME-01 — P0 — Globale navigatie werkt**
  - **Pagina:** `/`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Open de homepage. Gebruik de desktopnavigatie om Ontdek, Inspiratie, Jaarkalender, Festivals, FAQ en Zoeken te openen. Klik telkens op het logo om terug te gaan.
  - **Verwacht resultaat:** Elke link opent de bijbehorende pagina; het logo opent de homepage; de actieve navigatielink past bij de geopende route.
  - **Resultaat:** …

- [ ] **HOME-02 — P0 — Zoeken vanaf de hero behoudt de zoekterm**
  - **Pagina:** `/`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Voer een normale term in, bijvoorbeeld `museum`, en verstuur de herozoekbalk.
  - **Verwacht resultaat:** De zoekpagina opent met de ingevoerde term zichtbaar in het zoekveld en in de resultaatkop.
  - **Resultaat:** …

- [ ] **HOME-03 — P1 — Stadkaart opent Ontdek met stadcontext**
  - **Pagina:** `/`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Scroll naar de steden en open een beschikbare stad, bijvoorbeeld Utrecht of Zwolle.
  - **Verwacht resultaat:** Ontdek opent met de gekozen stad als context en toont de resultaten of de toepasselijke lege status voor die stad.
  - **Resultaat:** …

## Zoeken

- [ ] **SEARCH-01 — P0 — Zoekopdracht vanaf zoekpagina**
  - **Pagina:** `/zoeken`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Zoek op `museum` en verstuur.
  - **Verwacht resultaat:** De URL en het invoerveld bevatten de term; de resultaatkop noemt de term en er verschijnen passende kaarten of een duidelijke lege status.
  - **Resultaat:** …

- [ ] **SEARCH-02 — P0 — Combineer filters en sortering**
  - **Pagina:** `/zoeken?query=museum`
  - **Voorwaarde:** een zoekopdracht met resultaten.
  - **Stappen:** Open **Filters**, kies een beschikbare locatie en een type, pas toe en wissel daarna de sortering.
  - **Verwacht resultaat:** De filterchips en URL worden bijgewerkt; alleen resultaten die aan de gekozen filters voldoen blijven zichtbaar; sortering verandert zonder de zoekterm of filters kwijt te raken.
  - **Resultaat:** …

- [ ] **SEARCH-03 — P1 — Filters wissen vanuit lege resultaten**
  - **Pagina:** `/zoeken?query=museum`
  - **Voorwaarde:** een zoekopdracht met resultaten.
  - **Stappen:** Kies een combinatie van filters die geen resultaten geeft. Kies **Wis filters**.
  - **Verwacht resultaat:** De lege status noemt dat niets is gevonden; na wissen verdwijnen de filterchips en worden de niet-gefilterde zoekresultaten hersteld.
  - **Resultaat:** …

- [ ] **SEARCH-04 — P1 — Meer resultaten laden**
  - **Pagina:** Een zoekresultaat met meer dan twaalf resultaten, indien beschikbaar.
  - **Voorwaarde:** meer dan twaalf resultaten zichtbaar volgens de kop.
  - **Stappen:** Kies **Laad meer**.
  - **Verwacht resultaat:** Er worden extra kaarten toegevoegd; bestaande resultaten, zoekterm en filters blijven staan.
  - **Resultaat:** …

- [ ] **SEARCH-05 — P2 — Populaire en vervolgzoekopdrachten**
  - **Pagina:** `/zoeken`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Open een populaire zoekterm en daarna een snelkoppeling onder de resultaten, bijvoorbeeld Vandaag of Gratis.
  - **Verwacht resultaat:** Elke snelkoppeling opent een zoekresultaat met de passende zoekterm en eventuele filter in de URL.
  - **Resultaat:** …

## Ontdek

- [ ] **DISCOVER-01 — P0 — Kies stad en rond de keuzehulp af**
  - **Pagina:** `/ontdek`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Kies een aangeboden stad en doorloop de keuzes voor gezelschap, moment en sfeer; open daarna de resultaten.
  - **Verwacht resultaat:** De resultaten tonen de gekozen stad en keuzecontext; **Keuzes aanpassen** opent de keuzehulp opnieuw.
  - **Resultaat:** …

- [ ] **DISCOVER-02 — P1 — Resultaatfilters toepassen en herstellen**
  - **Pagina:** `/ontdek?city=utrecht` (of een andere beschikbare stad)
  - **Voorwaarde:** resultaten geladen.
  - **Stappen:** Open **Filters**, kies één of meer beschikbare opties, pas toe en verwijder ze daarna via wissen.
  - **Verwacht resultaat:** De resultaatlijst en filterteller veranderen pas na toepassen; na wissen zijn alle passende resultaten weer zichtbaar.
  - **Resultaat:** …

- [ ] **DISCOVER-03 — P1 — Paginering/laden van extra kaarten**
  - **Pagina:** `/ontdek?city=utrecht` (of stad met meer dan zes resultaten)
  - **Voorwaarde:** de knop voor meer resultaten is zichtbaar.
  - **Stappen:** Kies **Toon meer**.
  - **Verwacht resultaat:** Zes extra kaarten worden toegevoegd zonder stad, keuzes of actieve resultaatfilters te verliezen.
  - **Resultaat:** …

- [ ] **DISCOVER-04 — P1 — Detail vanuit kaart en lijst**
  - **Pagina:** Een Ontdek-resultaatpagina.
  - **Voorwaarde:** minstens één kaart met locatie.
  - **Stappen:** Open een kaart vanuit de lijst. Ga terug en selecteer vervolgens dezelfde of een andere marker op de kaart.
  - **Verwacht resultaat:** De detailpagina opent voor het geselecteerde uitje; kaartselectie en lijstselectie blijven op hetzelfde resultaat gericht.
  - **Resultaat:** …

- [ ] **DISCOVER-05 — P2 — Lege status en vervolgkeuze**
  - **Pagina:** Een Ontdek-resultaatpagina.
  - **Voorwaarde:** kies veilige bestaande filters/keuzes die nul resultaten geven, indien beschikbaar.
  - **Stappen:** Controleer de lege status en kies de actie om filters te wissen of een andere stad te kiezen.
  - **Verwacht resultaat:** De lege status is begrijpelijk; wissen herstelt resultaten en stad kiezen leidt terug naar de stadskeuze.
  - **Resultaat:** …

## Inspiratie en detail

- [ ] **INSPIRE-01 — P0 — Wizard naar aanbevelingen**
  - **Pagina:** `/inspiratie`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Kies een aangeboden stad en doorloop de vragen voor gezelschap, moment en sfeer tot de voorvertoning; open alle resultaten.
  - **Verwacht resultaat:** De voorvertoning en resultaten horen bij de gekozen stad; de resultatenkop toont de gekozen context.
  - **Resultaat:** …

- [ ] **INSPIRE-02 — P1 — Stad kiezen via invoerveld en toetsenbord**
  - **Pagina:** `/inspiratie`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Typ een deel van een ondersteunde stadsnaam, kies met pijl omlaag en `Enter`; open daarna de lijst opnieuw en druk `Escape`.
  - **Verwacht resultaat:** De geselecteerde stad wordt gebruikt en staat in de URL; `Escape` sluit alleen de suggestielijst.
  - **Resultaat:** …

- [ ] **INSPIRE-03 — P1 — Inspiratiedetail en praktische links**
  - **Pagina:** Een resultaat uit `/inspiratie`.
  - **Voorwaarde:** een detailkaart beschikbaar.
  - **Stappen:** Open een detail, controleer titel, locatie, praktische informatie en tags. Open **Zoek actuele informatie** en **Bekijk route**.
  - **Verwacht resultaat:** Het detail past bij de gekozen kaart; externe acties openen veilig in een nieuw tabblad; terugnavigeren behoudt de inspiratiecontext.
  - **Resultaat:** …

- [ ] **INSPIRE-04 — P1 — Bewaren vanaf inspiratiedetail**
  - **Pagina:** Een inspiratiedetail.
  - **Voorwaarde:** eerst uitgelogd, daarna ingelogd met een testaccount.
  - **Stappen:** Klik uitgelogd op het hart. Log in, open hetzelfde detail, bewaar het en open `/saved`; verwijder het daar weer.
  - **Verwacht resultaat:** Uitgelogd leidt bewaren naar inloggen. Ingelogd verandert de bewaarstatus direct; het item verschijnt onder opgeslagen plaatsen en verdwijnt na verwijderen.
  - **Resultaat:** …

## Jaarkalender

- [ ] **CAL-01 — P0 — Navigeer maanden en ga terug naar vandaag**
  - **Pagina:** `/jaarkalender`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Kies vorige maand, volgende maand en daarna **Vandaag**.
  - **Verwacht resultaat:** De maandtitel en kalenderinhoud veranderen correct; **Vandaag** zet de actuele maand terug.
  - **Resultaat:** …

- [ ] **CAL-02 — P1 — Filter op stad, categorie en maand**
  - **Pagina:** `/jaarkalender`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Kies een stad via de locatiedialoog, een categorie en een maand via de maandkiezer; voer de zoekactie uit. Wis daarna filters.
  - **Verwacht resultaat:** Kalender, URL en maandtitel volgen de selecties; **Wis filters** herstelt de standaardweergave.
  - **Resultaat:** …

- [ ] **CAL-03 — P1 — Dag- en detailnavigatie**
  - **Pagina:** `/jaarkalender`
  - **Voorwaarde:** een dag met activiteiten beschikbaar.
  - **Stappen:** Open een dag met activiteiten en open vervolgens een activiteit.
  - **Verwacht resultaat:** De dagpagina toont activiteiten voor die datum; de detailpagina hoort bij de gekozen activiteit en biedt een duidelijke route terug naar de kalender/dag.
  - **Resultaat:** …

- [ ] **CAL-04 — P2 — Lege kalenderstatus**
  - **Pagina:** `/jaarkalender`
  - **Voorwaarde:** kies alleen bestaande interfacefilters die een lege maand opleveren, indien beschikbaar.
  - **Stappen:** Controleer de melding en open de aangeboden vervolgactie naar Ontdek of Inspiratie.
  - **Verwacht resultaat:** De gekozen stad/categorie wordt in de lege melding uitgelegd; de vervolgactie opent een bruikbare vervolgpagina met de stadscontext waar beschikbaar.
  - **Resultaat:** …

## Festivals

- [ ] **FEST-01 — P0 — Festival-ingang en kalenderweergave**
  - **Pagina:** `/festivals`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Open `/festivals` en wissel met vorige/volgende maand in de kalender.
  - **Verwacht resultaat:** `/festivals` leidt naar de festivalkalender; de maandtitel en dagen veranderen zonder dat de kalender breekt.
  - **Resultaat:** …

- [ ] **FEST-02 — P1 — Zoeken, wissen en genre filteren**
  - **Pagina:** `/festivals/kalender`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Zoek op een bestaande term, wis de term met het kruis en kies daarna een genre in **Filters**.
  - **Verwacht resultaat:** Zoeken en genre staan in de URL; alleen passende festivalevenementen blijven zichtbaar; wissen herstelt de volledige kalender en plaatst de focus terug in het zoekveld.
  - **Resultaat:** …

- [ ] **FEST-03 — P1 — Detail vanuit festivalkalender**
  - **Pagina:** `/festivals/kalender`
  - **Voorwaarde:** een klikbare festivalpil beschikbaar.
  - **Stappen:** Open een festivalpil op desktop en mobiel.
  - **Verwacht resultaat:** De juiste festivaldetailpagina opent; de titel en datum komen overeen met de gekozen kalenderpil.
  - **Resultaat:** …

- [ ] **FEST-04 — P2 — Lege festivalzoekopdracht**
  - **Pagina:** `/festivals/kalender`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Verstuur een leeg zoekveld. Zoek daarna op een unieke, niet-bestaande term en kies de actie om de zoekterm te wissen.
  - **Verwacht resultaat:** Een leeg veld geeft een duidelijke validatiemelding zonder routewijziging; een onbekende term geeft een lege kalenderstatus en wissen herstelt de resultaten.
  - **Resultaat:** …

## Bewaard, account en login

- [ ] **SAVED-01 — P0 — Uitgelogde bewaaractie**
  - **Pagina:** Een zoek-, Ontdek- of inspiratieresultaat met een bewaaractie.
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Kies **Bewaar** of het hart.
  - **Verwacht resultaat:** De actie opent `/login` en opent niet tegelijk de resultaatkaart.
  - **Resultaat:** …

- [ ] **SAVED-02 — P0 — Bewaren en verwijderen van een lokaal opgeslagen plaats**
  - **Pagina:** Een inspiratiedetail of Ontdek-detail zonder backendfavoriet.
  - **Voorwaarde:** ingelogd met testaccount.
  - **Stappen:** Bewaar een item, open `/saved`, open het item vanuit de lijst en verwijder het daarna.
  - **Verwacht resultaat:** De bewaarstatus wisselt direct; het item staat in **Opgeslagen plaatsen**, opent het juiste detail en verdwijnt na verwijderen.
  - **Resultaat:** …

- [ ] **SAVED-03 — P1 — Lege en gefilterde favorietenlijst**
  - **Pagina:** `/saved`
  - **Voorwaarde:** ingelogd testaccount; voer dit ook uit zonder opgeslagen items wanneer mogelijk.
  - **Stappen:** Controleer de lege status. Met items: gebruik beschikbaarheid/type/zoekfilter en kies daarna filters wissen.
  - **Verwacht resultaat:** Zonder items staat er een uitnodiging naar Ontdek. Met filters verandert de teller; wissen herstelt alle favorieten.
  - **Resultaat:** …

- [ ] **AUTH-01 — P0 — Ongeldige e-mail/wachtwoord-login**
  - **Pagina:** `/login`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Vul een ongeldig testaccount in en verstuur.
  - **Verwacht resultaat:** Een begrijpelijke foutmelding verschijnt; het formulier blijft bruikbaar en er wordt geen ingelogde status getoond.
  - **Resultaat:** …

- [ ] **AUTH-02 — P0 — Inloggen, account en uitloggen**
  - **Pagina:** `/login`
  - **Voorwaarde:** geldige testinlog beschikbaar.
  - **Stappen:** Log in, open `/account`, open vanaf daar de bewaarde items en log uit.
  - **Verwacht resultaat:** Account toont naam/e-mail indien beschikbaar; bewaarde items zijn bereikbaar; uitloggen zet de navigatie en accountpagina terug naar de uitgelogde toestand.
  - **Resultaat:** …

- [ ] **AUTH-03 — P2 — Afgeschermde pagina als uitgelogde gebruiker**
  - **Pagina:** `/saved` en `/account`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Open beide routes rechtstreeks.
  - **Verwacht resultaat:** Beide pagina's leggen uit dat inloggen nodig is en bieden een werkende link naar `/login`.
  - **Resultaat:** …

## Mobiel en toegankelijk gedrag

- [ ] **MOBILE-01 — P0 — Menu openen, sluiten en navigeren**
  - **Pagina:** `/` op 375 px en 430 px.
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Open het hamburgermenu, navigeer naar Zoeken en ga terug. Open opnieuw en sluit via `Escape`.
  - **Verwacht resultaat:** Het menu blokkeert paginascroll zolang het open is; een menu-link sluit het menu; `Escape` sluit het menu en zet de focus terug op de menuknop.
  - **Resultaat:** …

- [ ] **MOBILE-02 — P1 — Focus blijft in overlays**
  - **Pagina:** `/zoeken?query=museum`, daarna `/ontdek?city=utrecht`.
  - **Voorwaarde:** mobiel viewport; resultaten beschikbaar.
  - **Stappen:** Open achtereenvolgens het zoekfilterpaneel en het Ontdek-filtervenster. Gebruik `Tab`, `Shift+Tab` en `Escape`.
  - **Verwacht resultaat:** Focus blijft binnen elke overlay; `Escape` sluit deze; na sluiten staat focus terug op de knop waarmee de overlay werd geopend.
  - **Resultaat:** …

- [ ] **MOBILE-03 — P1 — Ontdek-kaartoverlay en markerselectie**
  - **Pagina:** `/ontdek?city=utrecht` (of andere stad met markers), op 375 px en 430 px.
  - **Voorwaarde:** resultaten met locaties.
  - **Stappen:** Kies **Kaartweergave**, selecteer een marker en ga terug naar de lijst met de terugknop en apart met `Escape`.
  - **Verwacht resultaat:** De kaart opent als volledige overlay zonder achtergrondscroll; markerselectie selecteert het juiste resultaat; beide sluitacties herstellen de lijst en focus op de kaartknop.
  - **Resultaat:** …

- [ ] **MOBILE-04 — P1 — Horizontaal scrollbare filters en knoppen**
  - **Pagina:** `/zoeken?query=museum` en een resultatenpagina van Inspiratie.
  - **Voorwaarde:** mobiel viewport.
  - **Stappen:** Scroll horizontaal door actieve zoekfilters en vervolgknoppen; controleer daarna de inspiratie- of resultaatfilters.
  - **Verwacht resultaat:** Horizontale rijen blijven binnen de viewport, zijn met aanraking bereikbaar en veroorzaken geen horizontale scroll van de hele pagina.
  - **Resultaat:** …

- [ ] **MOBILE-05 — P2 — Overgang naar desktop sluit open overlay**
  - **Pagina:** `/` en een Ontdek-resultaatpagina.
  - **Voorwaarde:** start op minder dan 1024 px.
  - **Stappen:** Open het mobiele menu, vergroot naar minstens 1024 px. Herhaal met de mobiele kaartoverlay.
  - **Verwacht resultaat:** Het mobiele menu sluit bij desktopbreedte en laat geen scroll-lock achter; de kaart gaat naar de desktopweergave zonder vastgelopen overlay.
  - **Resultaat:** …

## Veilige fout- en herstelcontroles

- [ ] **ERROR-01 — P1 — Zoekresultaten zonder resultaten**
  - **Pagina:** `/zoeken`
  - **Voorwaarde:** uitgelogd.
  - **Stappen:** Zoek op een unieke, onwaarschijnlijke term, bijvoorbeeld `zzznietbestaandtest`.
  - **Verwacht resultaat:** Een leesbare lege status verschijnt met **Opnieuw zoeken**; die actie zet focus terug op het zoekveld.
  - **Resultaat:** …

- [ ] **ERROR-02 — P1 — Onbekende route**
  - **Pagina:** een nieuw tabblad.
  - **Voorwaarde:** geen.
  - **Stappen:** Open `/bestaat-niet-handmatige-test`.
  - **Verwacht resultaat:** De 404-pagina meldt dat de pagina niet bestaat of is verplaatst en toont geen technische foutdetails.
  - **Resultaat:** …

- [ ] **ERROR-03 — P2 — Beschadigde of ontbrekende resultaatafbeelding**
  - **Pagina:** zoek- of Ontdek-resultaten.
  - **Voorwaarde:** voer alleen uit als een bestaande kaart tijdens normaal gebruik een niet-ladende afbeelding toont; verander geen data of netwerkverkeer.
  - **Stappen:** Controleer de betreffende kaart en open desgewenst het detail.
  - **Verwacht resultaat:** De kaart blijft leesbaar en klikbaar; titel, metadata en actie blijven bruikbaar zonder verspringende layout.
  - **Resultaat:** …

- [ ] **ERROR-04 — P2 — Herstelactie bij zichtbare laadfout**
  - **Pagina:** `/zoeken` of `/ontdek`.
  - **Voorwaarde:** alleen uitvoeren wanneer de applicatie zelf een foutstatus toont; simuleer geen API-fout en wijzig geen productiegegevens.
  - **Stappen:** Lees de foutmelding en kies **Opnieuw proberen**.
  - **Verwacht resultaat:** De foutstatus is begrijpelijk; de herstelactie start opnieuw laden en houdt de gebruiker op dezelfde functionele route.
  - **Resultaat:** …

## Gevonden risico's tijdens code-inspectie

### RISK-01 — Dubbele vervolgactie in de lege festival-lijst

- **Route:** `/festivals/lijst`
- **Oorzaak:** de lege status rendert tweemaal dezelfde link **Open festivalkalender**.
- **Reproduceren:** open `/festivals/lijst`, zoek op een unieke niet-bestaande term en bekijk de acties in de lege status.
- **Impact:** de gebruiker ziet twee identieke acties, wat onnodig verwarrend is en ruimte inneemt op mobiel.
- **Kleine vervolgtaak:** verwijder één van de dubbele links in `frontend/app/festivals/lijst/FestivalsListClient.tsx` en voeg desgewenst een testcontrole voor unieke acties toe.

## Testrun-overzicht

| Datum | Omgeving/build | Browser en viewport | Ingelogd testaccount | Uitgevoerd door | Bevindingen/tickets |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

