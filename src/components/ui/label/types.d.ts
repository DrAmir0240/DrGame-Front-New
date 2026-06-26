import type * as React from "react";
import type * as LabelPrimitive from "@radix-ui/react-label";

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  className?: string;
  children?: React.ReactNode;
};
