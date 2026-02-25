"use client";

import { useEffect, useState } from "react";
import { fetchMe } from "@/src/lib/auth";

export default function Me() {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((user) => setMe(user))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!me) return <div>Niet ingelogd</div>;

  return <pre>{JSON.stringify(me, null, 2)}</pre>;
}