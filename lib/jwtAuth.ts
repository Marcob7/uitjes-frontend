import { getApiBase } from "@/lib/config";

export type JwtTokens = {
  access: string;
  refresh: string;
};

export type JwtUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_authenticated: boolean;
};

const TOKEN_STORAGE_KEY = "uitjes.jwt.tokens";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

async function readJsonResponse(res: Response) {
  return res.json().catch(() => null);
}

export function getStoredTokens(): JwtTokens | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<JwtTokens>;
    if (!parsed.access || !parsed.refresh) return null;

    return {
      access: parsed.access,
      refresh: parsed.refresh,
    };
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens: JwtTokens) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(TOKEN_STORAGE_KEY);
}

export async function loginWithJwt(identifier: string, password: string): Promise<JwtTokens> {
  const trimmedIdentifier = identifier.trim();
  const payload = trimmedIdentifier.includes("@")
    ? { email: trimmedIdentifier, password }
    : { username: trimmedIdentifier, password };

  let res: Response;

  try {
    res = await fetch(`${getApiBase()}/api/auth/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Kan de backend nu niet bereiken. Probeer het straks opnieuw.");
  }

  const data = await readJsonResponse(res);

  if (!res.ok || !data?.access || !data?.refresh) {
    throw new Error(data?.detail || "Inloggen is niet gelukt. Controleer je gegevens.");
  }

  return {
    access: data.access,
    refresh: data.refresh,
  };
}

export async function refreshJwtToken(refresh: string): Promise<string> {
  let res: Response;

  try {
    res = await fetch(`${getApiBase()}/api/auth/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({ refresh }),
    });
  } catch {
    throw new Error("Sessie vernieuwen is niet gelukt.");
  }

  const data = await readJsonResponse(res);

  if (!res.ok || !data?.access) {
    throw new Error("Sessie vernieuwen is niet gelukt.");
  }

  return data.access;
}

export async function getCurrentUser(accessToken: string): Promise<JwtUser | null> {
  let res: Response;

  try {
    res = await fetch(`${getApiBase()}/api/auth/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch {
    return null;
  }

  if (res.status === 401 || res.status === 403) return null;

  const data = await readJsonResponse(res);
  if (!res.ok || !data?.is_authenticated) {
    throw new Error("Gebruiker ophalen is niet gelukt.");
  }

  return data as JwtUser;
}

export function logout() {
  clearStoredTokens();
}
