/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
export default {
  preset: 'ts-jest/presets/default-esm-legacy',
  testTimeout: 30 * 1000,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: ["src/**/*.ts", "!**/node_modules/**"],
  coveragePathIgnorePatterns: ["node_modules/"],
  testEnvironment: "node",
  testRegex: "/test/.*\\.test\\.(mjs?|js?|ts?)$",
  moduleFileExtensions: ["mjs", "ts", "js", "json"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  reporters: ["default", ["jest-junit", { outputDirectory: "coverage" }]],
};
