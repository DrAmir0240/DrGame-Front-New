import type * as React from "react";
import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  className?: string;
  children?: React.ReactNode;
};
