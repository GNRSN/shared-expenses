import { fileURLToPath } from "url";

/** @import {Config as PrettierConfig} from 'prettier'  */
/** @import {PluginOptions as TailwindConfig} from 'prettier-plugin-tailwindcss'  */
/** @import {PluginConfig as SortImportsConfig} from '@ianvs/prettier-plugin-sort-imports'  */

const config =
  /** @satisfies { PrettierConfig & SortImportsConfig & TailwindConfig } */ ({
    importOrderCaseSensitive: true,
    singleAttributePerLine: true,
    plugins: [
      "@ianvs/prettier-plugin-sort-imports",
      "prettier-plugin-tailwindcss",
    ],
    tailwindConfig: fileURLToPath(
      new URL("../../tooling/tailwind/web.ts", import.meta.url),
    ),
    tailwindFunctions: ["cn", "cva"],
    importOrder: [
      "<TYPES>",
      "^(react/(.*)$)|^(react$)|^(react-native(.*)$)",
      "^(next/(.*)$)|^(next$)",
      "^(expo(.*)$)|^(expo$)",
      "<THIRD_PARTY_MODULES>",
      "",
      "<TYPES>^@@",
      "^@@/(.*)$",
      "",
      "<TYPES>^[.|..|~]",
      "^~/",
      "^[../]",
      "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    importOrderTypeScriptVersion: "4.4.0",
    overrides: [
      {
        files: "*.json.hbs",
        options: {
          parser: "json",
        },
      },
      {
        files: "*.js.hbs",
        options: {
          parser: "babel",
        },
      },
    ],
  });

export default config;
