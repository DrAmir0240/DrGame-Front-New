import type * as React from "react";
import type * as PopoverPrimitive from "@radix-ui/react-popover";

export type PopoverContentProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  className?: string;
};
