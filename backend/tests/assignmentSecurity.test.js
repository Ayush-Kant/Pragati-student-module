import test from "node:test";
import assert from "node:assert/strict";

import { resolveAssignmentStudentId } from "../src/utils/assignmentHelpers.js";
import errorMiddleware from "../middleware/errorMiddleware.js";

test("resolves a student reference through the shared assignment helper", async () => {
  const dbClient = {
    query: async () => ({
      rows: [{ id: 7, auth_user_id: 42 }],
    }),
  };

  const resolvedId = await resolveAssignmentStudentId({ id: 42, role: "student" }, null, dbClient);

  assert.equal(resolvedId, 7);
});

test("hides internal error details from clients", () => {
  const req = {};
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  errorMiddleware(new Error("SQLSTATE 23505: duplicate key value"), req, res, () => {});

  assert.equal(res.statusCode, 500);
  assert.equal(res.body.success, false);
  assert.equal(res.body.message, "Internal server error");
});
