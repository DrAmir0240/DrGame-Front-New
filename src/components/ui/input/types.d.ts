import type * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  label?: React.ReactNode;
  error?: string;
};
