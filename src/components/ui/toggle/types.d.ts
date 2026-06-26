import type * as React from "react";
import type * as TogglePrimitive from "@radix-ui/react-toggle";

export type ToggleProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
};
