import { nextJsConfig } from "@repo/eslint-config/next-js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  // App-specific: enable type-checked rules only for TS/TSX files (lean profile)
  ...tseslint.configs.recommendedTypeChecked.map((c) => ({
    ...c,
    files: ["**/*.ts", "**/*.tsx"],
  })),
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
      // Too noisy for this project; allow numbers/booleans in templates
      "@typescript-eslint/restrict-template-expressions": "off",
      // Arrow shorthand returning void is acceptable in UI event handlers
      "@typescript-eslint/no-confusing-void-expression": "off",
    },
  },
  // Overrides for generated or framework-integrated directories/files
  {
    files: ["convex/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
  {
    files: ["next.config.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "convex/_generated/**",
      // Avoid linting the flat config itself with type-aware rules
      "eslint.config.mjs",
      // Ignore other JS config files that don't need TS-aware linting
      "postcss.config.mjs",
      "*.config.js",
      "*.config.cjs",
      "*.config.mjs",
    ],
  },
];


