const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const loadModule = (relativePath) => {
  const absolutePath = path.join(__dirname, relativePath);
  const code = fs.readFileSync(absolutePath, "utf8");
  const module = { exports: {} };
  const context = {
    module,
    exports: module.exports,
    require,
    __dirname: path.dirname(absolutePath),
    __filename: absolutePath,
    process,
    console,
    Buffer,
  };

  vm.runInNewContext(code, context, { filename: absolutePath });
  return module.exports;
};

const { verifyCourseAccess, validateLessonAccess, validateResourceAccess } = loadModule("../src/utils/learningSecurity.js");
const { generateSecureResourceUrl, verifySecureResourceToken } = loadModule("../src/utils/resourceUtils.js");

const studentId = "123e4567-e89b-12d3-a456-426614174000";
const courseId = "123e4567-e89b-42d3-a456-426614174001";

test("validateLessonAccess returns a specific invalid-ID message", () => {
  const result = validateLessonAccess("not-a-uuid");

  assert.equal(result.success, false);
  assert.equal(result.status, 400);
  assert.equal(result.message, "Invalid Lesson ID");
});

test("validateResourceAccess returns a specific invalid-ID message", () => {
  const result = validateResourceAccess("not-a-uuid");

  assert.equal(result.success, false);
  assert.equal(result.status, 400);
  assert.equal(result.message, "Invalid Resource ID");
});

test("verifyCourseAccess blocks unauthorized access when the checker returns false", () => {
  const result = verifyCourseAccess(studentId, courseId, () => false);

  assert.equal(result.success, false);
  assert.equal(result.status, 403);
  assert.equal(result.message, "Student is not authorized to access this course");
});

test("resource tokens are signed and verifiable", () => {
  const result = generateSecureResourceUrl("resource-1", 60, "test-secret");

  assert.ok(result.token);
  assert.equal(result.resourceId, "resource-1");
  assert.equal(verifySecureResourceToken("resource-1", result.token, result.expiresAt, "test-secret"), true);
  assert.equal(verifySecureResourceToken("resource-1", "deadbeef", result.expiresAt, "test-secret"), false);
});
