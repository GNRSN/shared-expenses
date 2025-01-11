import baseConfig, { restrictEnvAccess } from "@@/eslint-config/base";
import nextjsConfig from "@@/eslint-config/nextjs";
import reactConfig from "@@/eslint-config/react";
import storybookConfig from "@@/eslint-config/storybook";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
  ...storybookConfig,
];
