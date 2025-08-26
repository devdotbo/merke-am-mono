import { nextJsConfig } from "@repo/eslint-config/next-js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  // App-specific: enable type-checked rules (requires tsconfig) and React Compiler-friendly linting
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        // Ensure ESLint uses this app's tsconfig for type-aware rules
        project: "./tsconfig.json",
      },
    },
  },
  {
    plugins: { react: pluginReact },
    rules: {
      // React Compiler guidance: never use array index as a key
      "react/no-array-index-key": "error",
      // Help avoid unstable context values (inline objects)
      "react/jsx-no-constructed-context-values": "warn",
    },
  },
  {
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "convex/_generated/**",
    ],
  },
];


