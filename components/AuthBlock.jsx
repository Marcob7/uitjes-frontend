"use client";

import { useEffect, useState } from "react";
import { apiGetAuth, API_BASE } from "@/lib/api";

export default function AuthBlock() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetAuth("/api/auth/user/")
      .then(setMe)
      .finally(() => setLoading(false));
  }, []);

  function login() {
    window.location.href = `${API_BASE}/accounts/google/login/?process=login`;
  }

  function logout() {
    window.location.href = `${API_BASE}/accounts/logout/`;
  }

  if (loading) return <p role="status" aria-live="polite">Account laden</p>;

  if (!me) {
    return (
      <div style={{ marginBottom: 16 }}>
        <button type="button" onClick={login}>Login met Google</button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <div>Ingelogd als: <b>{me.username}</b></div>
      <button type="button" onClick={logout} style={{ marginTop: 8 }}>
        Uitloggen
      </button>
    </div>
  );
}
