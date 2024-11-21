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
    "<rootDir>/src/**/*.test.ts",
    "<rootDir>/src/**/*.test.tsx",
  ],

  // Cobertura de teste
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}", // Inclui todos os arquivos de código da pasta src
    "!<rootDir>/src/**/index.ts", // Exclui index.ts
    "!<rootDir>/src/**/index.tsx", // Exclui index.tsx
    "!<rootDir>/src/**/*.d.ts", // Exclui definições de tipo
    "!<rootDir>/src/test/**/*", // Exclui a pasta de testes
  ],
  coverageThreshold: {
    global: {
      lines: 85, // Percentual mínimo global de linhas cobertas que devemos atingir.
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/.vercel/",
    "/coverage/",
    "/public/",
    "/.vscode/",
    "/.github/",
    "/.git/",
    "/.idea/",
    "/utils/",
    "/styles/",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

/**
 * Essa configuração de teste funciona de forma espelhada.
 * Cada pasta de teste deve ter um arquivo de teste com o mesmo nome, mas com a extensão ".test.ts ou .test.tsx"`.
 */
