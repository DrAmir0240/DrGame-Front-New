import type * as React from "react";
import type * as SheetPrimitive from "@radix-ui/react-dialog";

export type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>;
export type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
  side?: "top" | "bottom" | "left" | "right";
};
export type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>;
export type SheetTitleProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>;
export type SheetDescriptionProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>;
