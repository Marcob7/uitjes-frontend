# Accountverwijdering en gegevensbeheer — audit

Datum: 13 november 2026  
Scope: bestaande frontend- en backendcode. Er zijn geen gebruikers, migraties, endpoints of frontendfunctionaliteit gewijzigd.

## Conclusie

Er is **geen projectendpoint of frontendflow voor zelfbediende accountverwijdering** gevonden. De bestaande `DELETE`-route verwijdert uitsluitend een favoriet van de ingelogde gebruiker; dit is geen accountverwijdering. De veiligste vervolgstap is daarom optie B: een kleine, expliciete backenduitbreiding met een server-afgeleide gebruiker, gevolgd door een bevestigde frontendactie. Deze audit implementeert die stap niet.

## Bestaande accountfunctionaliteit

`app/account/AccountPageClient.tsx` gebruikt `useAuth()`:

| Onderdeel | Aantoonbaar gedrag |
| --- | --- |
| Zichtbaar profiel | Voornaam of gebruikersnaam en e-mailadres uit `GET /api/auth/me/`. |
| Beschikbare acties | Naar opgeslagen items, FAQ en lokaal uitloggen. Geen profielwijziging, deactivering of accountverwijdering. |
| Ingelogde gebruiker | `AuthProvider` leest JWT-tokens uit `localStorage`, vraagt de gebruiker op via `/api/auth/me/` en vernieuwt zo nodig het access-token. |
| Uitloggen | Verwijdert `uitjes.jwt.tokens` uit de browser en wist de client-state. Er is geen backendlogout of token-intrekking in deze flow. |
| Fouten | Bij een mislukte gebruiker- of tokenverversingsaanvraag wordt de lokale auth-state gewist. Het loginformulier toont een foutmelding bij een mislukte aanmelding. De accountpagina heeft geen specifieke fout- of verwijderstatus. |

## Backendinventaris

| Mogelijkheid | Vaststelling |
| --- | --- |
| Huidige gebruiker | `GET /api/auth/me/`, JWT-authenticatie vereist. Geeft id, gebruikersnaam, e-mail, voor- en achternaam terug. |
| JWT aanmelden | `POST /api/auth/token/`; geeft access- en refresh-token uit voor een actief account. |
| Token vernieuwen | `POST /api/auth/token/refresh/`. |
| Favoriet verwijderen | `DELETE /api/favorites/<event_id>/`, JWT vereist; de view filtert op `request.user`. |
| Account verwijderen/deactiveren | Niet gevonden in `events.urls`, `backend.urls`, eigen views of eigen serializers. Geen `DELETE /api/auth/me/`, user-delete of deactivation endpoint. |
| Django Allauth | Geïnstalleerd, inclusief Google-provider en `/accounts/`-routes. De aanwezige Allauth-accounturls bevatten onder meer login, logout, e-mail- en wachtwoordbeheer en `reauthenticate/`, maar geen accountverwijderroute. |
| dj-rest-auth | Routes zijn opgenomen, maar er is in deze repository geen configuratie of projectview gevonden die hierop een veilige accountverwijdering aanbiedt. |

Een technische `DELETE` op een favoriet is dus nadrukkelijk geen veilig accountverwijderingsproces.

## Gegevensrelaties die uit de code blijken

| Gegeven | Opslag en relatie | Huidig gedrag bij accountverwijdering |
| --- | --- | --- |
| Gebruikersprofiel | Django-gebruiker; de frontend leest de velden via `/api/auth/me/`. Er is geen eigen profielmodel aangetroffen. | Geen productflow aanwezig; gedrag alleen bij een toekomstige serveractie te bepalen. |
| Backendfavorieten | `events.Favorite.user` is een foreign key naar `AUTH_USER_MODEL` met `on_delete=models.CASCADE`. | Bij daadwerkelijke fysieke verwijdering van die Django-gebruiker worden favorieten door de vastgelegde cascade verwijderd. Dit moet regressietestdekking krijgen. |
| Lokale opgeslagen plaatsen | Browser-`localStorage`, sleutel `savedPlaceCards`; bevat plaatsinformatie en tijdstip, zonder user-id of serverkoppeling. | Blijft nu op het apparaat staan. Een toekomstige verwijderflow moet expliciet besluiten of deze lokale data op het gebruikte apparaat wordt gewist. |
| JWT access-/refresh-tokens | Browser-`localStorage`, sleutel `uitjes.jwt.tokens`; refresh gebeurt via SimpleJWT. | Frontendlogout verwijdert alleen de browserkopie. Er is geen projectconfiguratie voor refresh-token-blacklisting of een server-side intrekkingsflow gevonden. |
| Nieuwsbriefinschrijving | `NewsletterSignup` bevat e-mail, voorkeurstad, frequentie, interesses, bron, status, IP/user-agent en datums; geen foreign key naar gebruiker. | Geen automatische relatie of cascade aantoonbaar. Of een gelijk e-mailadres moet worden afgemeld of verwijderd is een expliciete product- en backendbeslissing. |
| Feedback | `Feedback` bevat bericht, optioneel e-mailadres, pagina-URL, user-agent en datum; geen user foreign key. | Geen automatische relatie of cascade aantoonbaar. |

Er worden geen uitspraken gedaan over bewaartermijnen, juridische grondslagen of gegevens buiten deze repository.

## Beveiligingsvoorwaarden voor een toekomstige flow

1. De backend moet uitsluitend de geauthenticeerde `request.user` verwijderen of deactiveren; nooit een clientgestuurd gebruikers-id accepteren.
2. Toon vooraf een expliciete, duidelijke bevestiging dat de handeling mogelijk onomkeerbaar is. De knop mag pas na die bevestiging de server aanroepen.
3. Leg het gewenste beleid vast: fysieke verwijdering versus deactivering. Alleen fysieke verwijdering heeft voor `Favorite` de aantoonbare cascade; de gevolgen voor andere gegevens moeten vooraf worden bepaald.
4. Onderzoek en implementeer een passende recente-authenticatie-eis. Allauth heeft een `reauthenticate/`-route, maar deze is niet gekoppeld aan de huidige JWT-accountflow. Voor wachtwoord- en Google-gebruikers is een concreet backendcontract nodig.
5. Behandel tokenongeldigmaking server-side. De huidige access/refresh-flow kent alleen client-side wissen en in de aangetroffen settings geen blacklistconfiguratie. Een verwijdering mag niet leunen op alleen `localStorage.removeItem`.
6. Voer de serveractie atomair uit, geef geen persoonsgegevens in foutmeldingen terug en behandel netwerk-, 401/403- en serverfouten zonder de UI ten onrechte als verwijderd te tonen.
7. Wis na een bevestigde serversuccesrespons lokale JWT-tokens en, als daarvoor is gekozen, lokale `savedPlaceCards`; stuur daarna naar een publieke pagina met een neutrale succesmelding.

## Google-login

Google-login loopt via Django Allauth (`/accounts/` met Google-provider). Het verwijderen van een EventsPlanner-account moet alleen de EventsPlanner-gebruiker en diens gegevensrelaties raken. Het mag **nooit** een Google-account verwijderen. De bestaande Allauth-configuratie levert geen aangetroffen accountverwijderroute; voor Google-gebruikers moet de toekomstige backend dezelfde accountverwijdering op de ingelogde EventsPlanner-gebruiker toepassen en bepalen hoe recente authenticatie wordt bewezen.

## Implementatieopties

### Optie A — bestaande functionaliteit aansluiten

Niet beschikbaar. Er is geen veilige, bestaande accountverwijderroute of aantoonbare Allauth-route die de huidige frontend kan gebruiken.

### Optie B — minimale backenduitbreiding nodig (voorkeur)

Voeg een authenticated account-endpoint toe, bijvoorbeeld een servergedefinieerde `DELETE /api/account/`, zonder `user_id` in body of pad. Bevestig vooraf het contract voor:

- fysieke verwijdering of deactivering;
- vereiste recente authenticatie, inclusief Google-login;
- intrekking/blacklisting van refresh-tokens en beëindiging van eventuele sessies;
- behandeling van nieuwsbrief- en feedbackrecords zonder gebruikerrelatie;
- responsevorm voor succes en fouten.

Pas daarna kan de accountpagina een beperkte bevestigingsdialoog en één beveiligde aanroep krijgen. Dit blijft de kleinste veilige route, omdat het bestaande autorisatiepatroon (`request.user`) wordt hergebruikt.

## Toekomstig implementatieplan

1. Bevestig het backendcontract en het verwijder- versus deactiveringsbeleid met de product- en beveiligingsverantwoordelijke.
2. Implementeer een authenticated serverendpoint dat uitsluitend op `request.user` werkt, met de gekozen recente-authenticatiecontrole.
3. Definieer en test transactioneel de gevolgen voor favorieten, Allauth-identiteiten/sessies, refresh-tokens, nieuwsbrief- en feedbackrecords.
4. Voeg op de accountpagina een duidelijk als onomkeerbaar gemarkeerde verwijderactie met bevestigingsdialoog toe; geen gebruikers-id naar de client sturen of terugsturen.
5. Roep het endpoint aan, wis pas na serversucces lokale auth-state en eventuele expliciet gekozen lokale opslag, en navigeer naar een publieke bestemming.
6. Toon gerichte succes-, validatie-, authenticatie- en serverfoutmeldingen zonder gevoelige details.
7. Voeg gerichte backend- en frontendtests toe, inclusief: alleen eigen account, geannuleerde dialoog, mislukte herauthenticatie, tokenintrekking, cascade van favorieten en lokale cleanup.

## Handmatige controles voor de toekomstige taak

- Een ingelogde wachtwoordgebruiker bevestigt en annuleert de dialoog; annuleren verandert niets.
- Een ingelogde Google-gebruiker doorloopt dezelfde EventsPlanner-flow; het Google-account blijft onaangetast.
- De API weigert ontbrekende of verlopen authenticatie en negeert elke eventueel meegestuurde user-id.
- Na succes zijn accountpagina en backendfavorieten niet meer toegankelijk met de oude sessie; in een ander browserprofiel werkt een oud refresh-token niet meer.
- Lokale opgeslagen plaatsen worden gecontroleerd tegen het expliciet gekozen productbeleid.

## Validatie

Uit te voeren na deze documentwijziging: TypeScript, bestaande frontendtests, productiebuild en `git diff --check`. Er is geen Playwright gebruikt.
