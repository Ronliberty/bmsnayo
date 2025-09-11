import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js recommended rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Production-safe rule overrides
  {
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",        // allow 'any' but warn
      "@typescript-eslint/no-empty-object-type": "warn",  // allow empty interfaces/types
      "@typescript-eslint/no-unused-vars": "warn",        // warn for unused vars
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",

      // React / Next.js
      "react/react-in-jsx-scope": "off",                  // not needed in Next.js 13+
      "react/prop-types": "off",                          // TypeScript replaces prop-types

      // General rules
      "no-console": "warn",
      "no-debugger": "warn"
    },

    // Ignore build/generated folders
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
