import assert from "node:assert/strict";
import test from "node:test";

import {
  getGoogleLoginHref,
  getPostLoginDestination,
  getSafeReturnTo,
} from "./authReturnTo";

test("returnTo accepts internal locale routes and preserves their query", () => {
  assert.equal(
    getSafeReturnTo("/nl/ontdek/museum?city=utrecht&source=zoeken#details"),
    "/nl/ontdek/museum?city=utrecht&source=zoeken#details",
  );
});

test("returnTo rejects external, protocol-relative, and unsafe encoded URLs", () => {
  for (const candidate of [
    "https://example.com",
    "//example.com",
    "javascript:alert(1)",
    "%68%74%74%70%73%3A%2F%2Fexample.com",
    "%252F%252Fevil.example",
    "/%255c%255cevil.example",
  ]) {
    assert.equal(getSafeReturnTo(candidate), null, candidate);
  }
});

test("Google login uses Allauth next only for a safe returnTo", () => {
  const href = getGoogleLoginHref(
    "https://api.example.test",
    "https://uitjes.example.test",
    "/en/zoeken?query=kunst",
  );
  const parsed = new URL(href);
  assert.equal(parsed.pathname, "/accounts/google/login/");
  assert.equal(parsed.searchParams.get("process"), "login");
  assert.equal(parsed.searchParams.get("next"), "https://uitjes.example.test/en/zoeken?query=kunst");

  const unsafe = new URL(
    getGoogleLoginHref("https://api.example.test", "https://uitjes.example.test", "//evil.example"),
  );
  assert.equal(unsafe.searchParams.has("next"), false);
});

test("JWT destination uses valid returnTo, preserves direct login, and falls back safely", () => {
  assert.equal(
    getPostLoginDestination("/nl/saved?filter=all", "/nl"),
    "/nl/saved?filter=all",
  );
  assert.equal(getPostLoginDestination(null, "/nl"), null);
  assert.equal(getPostLoginDestination("https://evil.example", "/nl"), "/nl");
});
