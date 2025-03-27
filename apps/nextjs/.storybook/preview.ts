import type { Preview } from "@storybook/react";

import "../src/app/globals.css";

import { RootDecorator } from "~/utils/storybook/RootDecorator";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      // DOC: https://storybook.js.org/docs/get-started/frameworks/nextjs#set-nextjsappdirectory-to-true
      appDirectory: true,
    },
  },
  decorators: [RootDecorator],
};

export default preview;
