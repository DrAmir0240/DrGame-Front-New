import type * as React from "react";
import type { FieldValues, FieldPath } from "react-hook-form";

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

export type FormItemContextValue = {
  id: string;
};

export type FormItemProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type FormControlProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement> & {
  className?: string;
  children?: React.ReactNode;
};
