"use client";

export default function LoginWithGoogle() {
  const djangoBase =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  function handleLogin() {
    window.location.href = `${djangoBase}/accounts/google/login/?process=login`;
  }

  return (
    <button onClick={handleLogin}>
      Login met Google
    </button>
  );
}