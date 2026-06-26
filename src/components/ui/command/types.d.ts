import type * as React from "react";
import type { Command as CommandPrimitive } from "cmdk";

export type CommandProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive> & {
  className?: string;
  children?: React.ReactNode;
};

export type CommandDialogProps = {
  className?: string;
  children?: React.ReactNode;
};

export type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
  className?: string;
};

export type CommandListProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> & {
  className?: string;
  children?: React.ReactNode;
};

export type CommandEmptyProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> & {
  className?: string;
  children?: React.ReactNode;
};

export type CommandGroupProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> & {
  className?: string;
  children?: React.ReactNode;
};

export type CommandSeparatorProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator> & {
  className?: string;
};

export type CommandItemProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
  className?: string;
  children?: React.ReactNode;
};

export type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  children?: React.ReactNode;
};
