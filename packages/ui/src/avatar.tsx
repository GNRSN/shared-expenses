"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@@/ui";

const Avatar: React.FC<
  React.ComponentPropsWithRef<typeof AvatarPrimitive.Root>
> = ({ className, ...props }) => (
  <AvatarPrimitive.Root
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
);

const AvatarImage: React.FC<
  React.ComponentPropsWithRef<typeof AvatarPrimitive.Image>
> = ({ className, ...props }) => (
  <AvatarPrimitive.Image
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
);

const AvatarFallback: React.FC<
  React.ComponentPropsWithRef<typeof AvatarPrimitive.Fallback>
> = ({ className, ...props }) => (
  <AvatarPrimitive.Fallback
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
);

export { Avatar, AvatarImage, AvatarFallback };
