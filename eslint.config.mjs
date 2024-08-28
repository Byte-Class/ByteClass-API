import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Note: you must disable the base rule as it can report incorrect errors
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warning",
    },
  },
];
