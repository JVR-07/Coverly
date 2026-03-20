import type { Config } from "jest";

const config: Config = {
  projects: [
    {
      displayName: "node",
      testMatch: [
        "<rootDir>/tests/api/**/*.test.ts",
        "<rootDir>/tests/auth.test.ts",
      ],
      testEnvironment: "node",
      transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
    },
    {
      displayName: "jsdom",
      testMatch: ["<rootDir>/tests/components/**/*.test.tsx"],
      testEnvironment: "jest-environment-jsdom",
      transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
    },
  ],
};

export default config;
