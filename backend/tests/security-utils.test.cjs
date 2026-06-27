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

test("verifyCourseAccess validates enrollment inputs without a callback", () => {
  const result = verifyCourseAccess(studentId, undefined);

  assert.equal(result.success, false);
  assert.equal(result.status, 400);
  assert.equal(result.message, "Course ID is required");
});

test("resource URLs reject missing or invalid resource identifiers", () => {
  assert.equal(generateSecureResourceUrl(undefined, 60, "test-secret"), null);
  assert.equal(generateSecureResourceUrl("not-a-uuid", 60, "test-secret"), null);
});

test("resource tokens require a secret and reject expired tokens", () => {
  const originalSecret = process.env.RESOURCE_TOKEN_SECRET;

  try {
    delete process.env.RESOURCE_TOKEN_SECRET;

    assert.throws(() => generateSecureResourceUrl("123e4567-e89b-12d3-a456-426614174002", 60), /RESOURCE_TOKEN_SECRET/);

    const result = generateSecureResourceUrl("123e4567-e89b-12d3-a456-426614174002", 60, "test-secret");
    assert.ok(result.token);
    assert.equal(verifySecureResourceToken("123e4567-e89b-12d3-a456-426614174002", result.token, Date.now() - 1000, "test-secret"), false);
  } finally {
    if (originalSecret === undefined) {
      delete process.env.RESOURCE_TOKEN_SECRET;
    } else {
      process.env.RESOURCE_TOKEN_SECRET = originalSecret;
    }
  }
});
