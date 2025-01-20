import type { Decorator } from "@storybook/react";

import { ThemeProvider } from "@@/ui/theme";
import { cn } from "@@/ui/utils";

import { StorybookTrpcProvider } from "~/trpc/storybook";
import { defaultFontsClassName } from "~/utils/fonts";

export const RootDecorator: Decorator = (Story, context) => {
  return (
    <div
      className={cn(
        "bg-background font-sans text-foreground antialiased",
        defaultFontsClassName,
      )}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
      >
        <StorybookTrpcProvider>
          <Story {...context} />
        </StorybookTrpcProvider>
      </ThemeProvider>
    </div>
  );
};
