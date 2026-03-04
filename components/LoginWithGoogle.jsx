"use client";

import { getApiBase } from "@/lib/api";

export default function LoginWithGoogle() {
  function handleLogin() {
    window.location.href = `${getApiBase()}/accounts/google/login/?process=login`;
  }

  return <button onClick={handleLogin}>Login met Google</button>;
}