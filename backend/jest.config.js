export default {
  testEnvironment: "node",
  verbose: true,
  testMatch: ["<rootDir>/src/tests/**/*.test.js"],
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

