import storybookPlugin from "eslint-plugin-storybook";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [...storybookPlugin.configs["flat/recommended"]];
