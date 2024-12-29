import baseConfig, { restrictEnvAccess } from "@@/eslint-config/base";
import nextjsConfig from "@@/eslint-config/nextjs";
import reactConfig from "@@/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
