import type * as React from "react";
import type * as MenubarPrimitive from "@radix-ui/react-menubar";

export type MenubarProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> & {
  className?: string;
  children?: React.ReactNode;
};

export type MenubarTriggerProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> & {
  className?: string;
  children?: React.ReactNode;
};

export type MenubarSubTriggerProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
};

export type MenubarSubContentProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> & {
  className?: string;
  children?: React.ReactNode;
};

export type MenubarContentProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> & {
  className?: string;
  children?: React.ReactNode;
};

export type MenubarItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
  className?: string;
  children?: React.ReactNode;
  inset?: boolean;
};

export type MenubarCheckboxItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> & {
  className?: string;
  children?: React.ReactNode;
};

export type MenubarRadioItemProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> & {
  className?: string;
  children?: React.ReactNode;
};

export type MenubarLabelProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
  className?: string;
  inset?: boolean;
};

export type MenubarSeparatorProps = React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator> & {
  className?: string;
};

export type MenubarShortcutProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  children?: React.ReactNode;
};
