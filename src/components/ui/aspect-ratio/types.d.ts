import type * as React from "react";
import type * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

export type AspectRatioProps = React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> & {
  className?: string;
  children?: React.ReactNode;
};
