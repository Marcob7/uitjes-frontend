export const loginErrorCodes = [
  "invalidCredentials",
  "network",
  "server",
  "google",
  "generic",
] as const;

export type LoginErrorCode = (typeof loginErrorCodes)[number];

export class LoginError extends Error {
  constructor(public readonly code: LoginErrorCode) {
    super(code);
    this.name = "LoginError";
  }
}

export function getLoginErrorCode(error: unknown): LoginErrorCode {
  return error instanceof LoginError ? error.code : "generic";
}

/**
 * Maps stable API status codes to copy keys. Never expose an API response body
 * or message to the UI: those details are not a user-facing contract.
 */
export function loginErrorCodeForStatus(status: number): LoginErrorCode {
  if (status === 401 || status === 403) return "invalidCredentials";
  if (status >= 500) return "server";
  return "generic";
}

/**
 * OAuth failures are only trusted when the callback uses one of these explicit,
 * frontend-owned values. Unknown provider query values deliberately fall back.
 */
export function oauthLoginErrorCode(value: string | null): LoginErrorCode | null {
  switch (value) {
    case "google_failed":
    case "oauth_failed":
    case "access_denied":
    case "cancelled":
      return "google";
    default:
      return null;
  }
}
