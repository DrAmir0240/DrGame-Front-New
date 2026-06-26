import type * as React from "react";
import type * as AccordionPrimitive from "@radix-ui/react-accordion";

export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  className?: string;
  children?: React.ReactNode;
};

export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  className?: string;
  children?: React.ReactNode;
};

export type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  className?: string;
  children?: React.ReactNode;
};

export type AccordionContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  className?: string;
  children?: React.ReactNode;
};
