"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@@/ui/utils";

const Separator: React.FC<
  React.ComponentPropsWithRef<typeof SeparatorPrimitive.Root>
> = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) => (
  <SeparatorPrimitive.Root
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className,
    )}
    {...props}
  />
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
