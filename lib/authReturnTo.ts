const APPLICATION_ORIGIN = "https://uitjes.invalid";
const MAX_RETURN_TO_LENGTH = 2048;

function decodeForValidation(value: string) {
  let decoded = value;

  // Query parameters are decoded once by URLSearchParams. Decode a couple of
  // additional layers for validation so an encoded protocol-relative URL
  // cannot bypass the internal-route check.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      return null;
    }
  }

  return decoded;
}

/**
 * Accept only application-relative routes for post-login navigation.
 * The original value is returned so its query string and hash are preserved.
 */
export function getSafeReturnTo(value: string | null) {
  if (!value || value.length > MAX_RETURN_TO_LENGTH || value !== value.trim()) {
    return null;
  }

  const decoded = decodeForValidation(value);
  if (!decoded || /[\u0000-\u001f\u007f]/.test(decoded)) return null;
  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.startsWith("/\\")) {
    return null;
  }

  try {
    const parsed = new URL(decoded, APPLICATION_ORIGIN);
    return parsed.origin === APPLICATION_ORIGIN ? value : null;
  } catch {
    return null;
  }
}

/** Returns null when direct login should retain its existing page behaviour. */
export function getPostLoginDestination(
  returnTo: string | null,
  fallback: string,
) {
  const safeReturnTo = getSafeReturnTo(returnTo);
  if (safeReturnTo) return safeReturnTo;
  return returnTo === null ? null : fallback;
}

/** Builds Allauth's existing `next` URL only from an already safe route. */
export function getGoogleLoginHref(
  apiBase: string,
  applicationOrigin: string,
  returnTo: string | null,
) {
  const href = new URL("/accounts/google/login/", apiBase);
  href.searchParams.set("process", "login");

  const safeReturnTo = getSafeReturnTo(returnTo);
  if (safeReturnTo) {
    href.searchParams.set("next", new URL(safeReturnTo, applicationOrigin).toString());
  }

  return href.toString();
}
