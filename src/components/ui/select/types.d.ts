import type * as React from "react";
import type * as SelectPrimitive from "@radix-ui/react-select";

export type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
  label?: React.ReactNode;
};

export type SelectContentProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
  position?: "popper" | "item-aligned";
};

export type SelectLabelProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;
export type SelectItemProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;
export type SelectSeparatorProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;
export type SelectScrollUpButtonProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>;
export type SelectScrollDownButtonProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>;
export type SelectGroupProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>;
export type SelectValueProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>;
