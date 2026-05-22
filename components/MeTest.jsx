"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, getStoredTokens } from "@/lib/jwtAuth";
export default function MeTest() {
const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = getStoredTokens();
    Promise.resolve(tokens?.access ? getCurrentUser(tokens.access) : null)
      .then((user) => setMe(user))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!me) return <div>Niet ingelogd</div>;

  return <pre>{JSON.stringify(me, null, 2)}</pre>;
}
