import * as React from "react";

import { cn } from "@acme/ui";

const Card: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className,
    )}
    {...props}
  />
);

const CardHeader: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...props
}) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

const CardDescription: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...props
}) => (
  <div className={cn("text-sm text-muted-foreground", className)} {...props} />
);

const CardContent: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...props
}) => <div className={cn("p-6 pt-0", className)} {...props} />;

const CardFooter: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...props
}) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
