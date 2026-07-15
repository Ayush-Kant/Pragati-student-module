import test from "node:test";
import assert from "node:assert/strict";

import { resolveStudentReference } from "../src/utils/studentReferenceResolver.js";

test("resolves a student reference that matches a users.id", () => {
  const users = [{ id: 7, auth_user_id: 42 }];

  assert.equal(resolveStudentReference(7, users), 7);
});

test("resolves a student reference that matches an auth_users.id", () => {
  const users = [{ id: 7, auth_user_id: 42 }];

  assert.equal(resolveStudentReference(42, users), 7);
});

test("returns null when no user row matches the provided reference", () => {
  const users = [{ id: 7, auth_user_id: 42 }];

  assert.equal(resolveStudentReference(99, users), null);
});
