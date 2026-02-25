"use client";

export default function LoginWithGoogle() {
  const djangoBase = "http://localhost:8000";

  function handleLogin() {
    window.location.href = `${djangoBase}/accounts/google/login/?process=login`;
  }

  return (
    <button onClick={handleLogin}>
      Login met Google
    </button>
  );
}