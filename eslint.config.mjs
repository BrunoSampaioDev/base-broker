import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/modules/*/components/**",
                "@/modules/*/hooks/**",
                "@/modules/*/services/**",
                "@/modules/*/types/**",
              ],
              message:
                "Import from the module's public API (@/modules/<name>) instead of reaching into its internals.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/", "out/", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
