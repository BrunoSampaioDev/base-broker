import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "modules/**/*.{ts,tsx}",
    "!app/layout.tsx",
    "!app/page.tsx",
    "!modules/**/types/**",
    "!modules/shared/test/**",
  ],
  coveragePathIgnorePatterns: ["<rootDir>/modules/shared/test/"],
};

export default createJestConfig(config);
