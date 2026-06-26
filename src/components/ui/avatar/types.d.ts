import type * as React from "react";
import type * as AvatarPrimitive from "@radix-ui/react-avatar";

export type AvatarProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  className?: string;
  children?: React.ReactNode;
};

export type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
  className?: string;
  children?: React.ReactNode;
};

export type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
  className?: string;
  children?: React.ReactNode;
};
