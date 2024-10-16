import "@testing-library/jest-dom";
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/__tests__/**/*.ts?(x)",
    "<rootDir>/src/test/**/*.test.ts",
    "<rootDir>/src/test/**/*.test.tsx",
  ],
  roots: ["<rootDir>/src"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

/**
 * Essa configuração de teste funciona de forma espelhada.
 * Cada pasta de teste deve ter um arquivo de teste com o mesmo nome, mas com a extensão "spec"`.
 */
