# E2E-testen

De frontend heeft één minimale Playwright-rooktest die de homepagezoekopdracht
in Chromium doorloopt. Start hem vanuit `frontend`:

```powershell
npm install
npx playwright install chromium
npm run test:e2e
```

Playwright start zelf de Next.js-ontwikkelserver op `127.0.0.1:3100`, wacht tot
`/nl` bereikbaar is en ruimt de server na de test weer op. Er is één headless
Chromium-project en `reuseExistingServer` staat uit, zodat de test nooit per
ongeluk tegen een toevallig draaiende server test.

Bij een fout schrijft Playwright screenshots en traces naar `test-results/` en
het HTML-rapport naar `playwright-report/`. Beide mappen staan in `.gitignore`.
Open na een mislukte run het rapport met:

```powershell
npx playwright show-report
```

De rooktest controleert alleen stabiel browsergedrag: homepage laden,
zoekveld invullen, via de knop zoeken, navigatie naar `/nl/zoeken?query=museum`
en het behouden van de term in het zoekveld. Hij verwacht geen vaste
backendresultaten; de zoekpagina mag daarom een geldige resultaten-, lege of
foutstatus tonen.

Deze lokale Playwright-browser draait naast de testserver. Dit is onafhankelijk
van de geïsoleerde Codex-browser, die niet automatisch toegang heeft tot een
server op de lokale loopbackinterface.

In de huidige Codex-uitvoeringssandbox is loopback-listening geblokkeerd door
de omgevingsproxy (Next.js meldt dan `EADDRINUSE` en de proxy meldt
`ECONNREFUSED`). Daardoor kan `npm run test:e2e` daar niet volledig worden
uitgevoerd. Dit is geen testresultaat; voer hetzelfde commando uit in een
normale lokale PowerShell-sessie om de browserflow te draaien.
