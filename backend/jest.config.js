export default {
  transform: {},
  testEnvironment: "node",
  verbose: true,
  extensionsToTreatAsEsm: [".js"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
