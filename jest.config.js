module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/app.ts",
    "!<rootDir>/src/index.ts",
    "!<rootDir>/src/@types/**/*",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["html", "json", "text-summary"],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.test.ts"],
};
