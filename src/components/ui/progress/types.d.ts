import type * as React from "react";

export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
};
