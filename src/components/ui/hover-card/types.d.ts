import type * as React from "react";
import type * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export type HoverCardContentProps = React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> & {
  className?: string;
  children?: React.ReactNode;
};
