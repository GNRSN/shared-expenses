import type { HTMLElementType } from "react";

import { cn } from "@@/ui/utils";

function Skeleton({
  className,
  as: TagName = "div",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: HTMLElementType }) {
  return (
    <TagName
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    >
      {/*
       * Empty character so that font styling can be used to match height, e.g. titles
       * REVIEW: Enable/disable with prop?
       */}
      &nbsp;
    </TagName>
  );
}

export { Skeleton };
