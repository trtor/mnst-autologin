import type { Config } from "@jest/types";
require("dotenv").config();

export default async (): Promise<Config.InitialOptions> => {
  return {
    // clearMocks: true,
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    roots: ["<rootDir>"],
    testPathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/node_modules/"],
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    // globalSetup: "<rootDir>/test/jest-global-setup.ts",
    // globalTeardown: "<rootDir>/test/jest-global-teardown.ts",
  };
};
