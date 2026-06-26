import type * as React from "react";
import type * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

export type CollapsibleProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> & {
  className?: string;
  children?: React.ReactNode;
};

export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger> & {
  className?: string;
  children?: React.ReactNode;
};

export type CollapsibleContentProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent> & {
  className?: string;
  children?: React.ReactNode;
};
