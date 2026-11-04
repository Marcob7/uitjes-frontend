import assert from "node:assert/strict";
import test from "node:test";

import { getFocusTrapTarget } from "./focusTrap";

test("focus trap returns focus to the first control when it has escaped a dialog", () => {
  assert.equal(
    getFocusTrapTarget({
      focusIsWithinDialog: false,
      focusIsFirst: false,
      focusIsLast: false,
      shiftKey: false,
    }),
    "first",
  );
});

test("focus trap wraps forward from the last control", () => {
  assert.equal(
    getFocusTrapTarget({
      focusIsWithinDialog: true,
      focusIsFirst: false,
      focusIsLast: true,
      shiftKey: false,
    }),
    "first",
  );
});

test("focus trap wraps backward from the first control", () => {
  assert.equal(
    getFocusTrapTarget({
      focusIsWithinDialog: true,
      focusIsFirst: true,
      focusIsLast: false,
      shiftKey: true,
    }),
    "last",
  );
});

test("focus trap leaves normal tab navigation unchanged", () => {
  assert.equal(
    getFocusTrapTarget({
      focusIsWithinDialog: true,
      focusIsFirst: false,
      focusIsLast: false,
      shiftKey: false,
    }),
    null,
  );
});
