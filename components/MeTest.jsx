"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
export default function MeTest() {
const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/auth/user/`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) return null;
        if (!res.ok) throw new Error("me request failed");
        return res.json();
      })
      .then((user) => setMe(user))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!me) return <div>Niet ingelogd</div>;

  return <pre>{JSON.stringify(me, null, 2)}</pre>;
}