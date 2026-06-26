import type * as React from "react";
import type * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

export type NavigationMenuProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
  className?: string;
  children?: React.ReactNode;
};

export type NavigationMenuListProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> & {
  className?: string;
  children?: React.ReactNode;
};

export type NavigationMenuTriggerProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {
  className?: string;
  children?: React.ReactNode;
};

export type NavigationMenuContentProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> & {
  className?: string;
  children?: React.ReactNode;
};

export type NavigationMenuViewportProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & {
  className?: string;
};

export type NavigationMenuIndicatorProps = React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator> & {
  className?: string;
};
