import type * as React from "react";
import type * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export type AlertDialogOverlayProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> & {
  className?: string;
};

export type AlertDialogContentProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
  className?: string;
  children?: React.ReactNode;
};

export type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type AlertDialogTitleProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> & {
  className?: string;
  children?: React.ReactNode;
};

export type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> & {
  className?: string;
  children?: React.ReactNode;
};

export type AlertDialogActionProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
  className?: string;
  children?: React.ReactNode;
};

export type AlertDialogCancelProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & {
  className?: string;
  children?: React.ReactNode;
};
