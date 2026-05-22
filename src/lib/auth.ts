import { getCurrentUser, getStoredTokens } from "@/lib/jwtAuth";

export async function fetchMe() {
  const tokens = getStoredTokens();
  if (tokens?.access) {
    const jwtUser = await getCurrentUser(tokens.access);
    if (jwtUser) return jwtUser;
  }

  return null;
}
