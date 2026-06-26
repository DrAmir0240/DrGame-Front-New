import type * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { type VariantProps } from "class-variance-authority";

const toastVariants = {};

export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants>;

export type ToastActionElement = React.ReactElement<typeof ToastAction>;

interface ToastAction {}

export type { VariantProps };
