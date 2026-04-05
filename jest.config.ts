import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/test/**",
    "!app/layout.tsx",
    "!app/page.tsx",
    "!app/types/**",
    "!app/components/index.tsx",
  ],
  coveragePathIgnorePatterns: ["<rootDir>/app/test/"],
};

export default createJestConfig(config);
