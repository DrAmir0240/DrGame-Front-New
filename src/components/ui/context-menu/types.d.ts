import type * as React from "react";
import type * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export type ContextMenuSubTriggerProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
};

export type ContextMenuSubContentProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> & {
  className?: string;
  children?: React.ReactNode;
};

export type ContextMenuContentProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> & {
  className?: string;
  children?: React.ReactNode;
};

export type ContextMenuItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
};

export type ContextMenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> & {
  className?: string;
  children?: React.ReactNode;
};

export type ContextMenuRadioItemProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> & {
  className?: string;
  children?: React.ReactNode;
};

export type ContextMenuLabelProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
  className?: string;
  inset?: boolean;
};

export type ContextMenuSeparatorProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator> & {
  className?: string;
};

export type ContextMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  children?: React.ReactNode;
};
