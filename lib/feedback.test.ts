import assert from "node:assert/strict";
import test from "node:test";

import { getFeedbackSubmitError } from "./feedback";

test("feedback submit errors remain actionable without exposing API details", () => {
  assert.match(getFeedbackSubmitError(0), /Geen verbinding/);
  assert.match(getFeedbackSubmitError(400), /Controleer je invoer/);
  assert.match(getFeedbackSubmitError(401), /Vernieuw de pagina/);
  assert.match(getFeedbackSubmitError(429), /Wacht even/);
  assert.match(getFeedbackSubmitError(500), /tijdelijk niet beschikbaar/);
  assert.equal(
    getFeedbackSubmitError(418),
    "Je feedback kon niet worden verstuurd. Probeer het opnieuw."
  );
});
