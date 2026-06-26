import type * as React from "react";
import type * as SeparatorPrimitive from "@radix-ui/react-separator";

export type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};
