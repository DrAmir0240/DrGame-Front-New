import type * as React from "react";
import type * as TooltipPrimitive from "@radix-ui/react-tooltip";

export type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
  sideOffset?: number;
};
