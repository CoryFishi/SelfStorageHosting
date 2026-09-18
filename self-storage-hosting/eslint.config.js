import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores([".next", "node_modules"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended, next],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
  },
]);
