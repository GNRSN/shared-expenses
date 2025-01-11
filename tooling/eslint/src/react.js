import { fixupPluginRules } from "@eslint/compat";
import reactPlugin from "eslint-plugin-react";
import compilerPlugin from "eslint-plugin-react-compiler";
import hooksPlugin from "eslint-plugin-react-hooks";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      // fixes: https://eslint.org/docs/latest/use/troubleshooting/v9-rule-api-changes
      react: fixupPluginRules(reactPlugin),
      "react-compiler": compilerPlugin,
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      "react-compiler/react-compiler": "error",
      "react/prop-types": "off",
    },
    languageOptions: {
      globals: {
        React: "writable",
      },
    },
    settings: {
      react: {
        // Only necessary to suppress warning
        version: "detect",
      },
    },
  },
];
