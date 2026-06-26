import type * as React from "react";
import type * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

export type ScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
  viewportClassName?: string;
};

export type ScrollBarProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
  orientation?: "vertical" | "horizontal";
};
