import type * as React from "react";

export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  children?: React.ReactNode;
};
