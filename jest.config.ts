import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
    "<rootDir>/src/test/jest.setupTest.ts",
  ],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/__tests__/**/*.ts?(x)",
    "<rootDir>/src/**/*.test.ts",
    "<rootDir>/src/**/*.test.tsx",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

/**
 * Essa configuração de teste funciona de forma espelhada.
 * Cada pasta de teste deve ter um arquivo de teste com o mesmo nome, mas com a extensão ".test.ts ou .test.tsx"`.
 */
