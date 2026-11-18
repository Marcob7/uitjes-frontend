/**
 * Maps feedback endpoint outcomes to user-safe, actionable copy.
 * Response bodies are deliberately not surfaced: they are not a UI contract.
 */
export function getFeedbackSubmitError(status: number): string {
  if (status === 0) {
    return "Geen verbinding met de server. Controleer je internetverbinding en probeer het opnieuw.";
  }

  if (status === 400) {
    return "Controleer je invoer en probeer het opnieuw.";
  }

  if (status === 401 || status === 403) {
    return "Je feedback kon niet worden verstuurd. Vernieuw de pagina en probeer het opnieuw.";
  }

  if (status === 429) {
    return "Je hebt te vaak geprobeerd. Wacht even en probeer het opnieuw.";
  }

  if (status >= 500) {
    return "De server is tijdelijk niet beschikbaar. Probeer het later opnieuw.";
  }

  return "Je feedback kon niet worden verstuurd. Probeer het opnieuw.";
}
