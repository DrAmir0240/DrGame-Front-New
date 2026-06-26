import type * as React from 'react';

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive';
  className?: string;
  children?: React.ReactNode;
};

export type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type AlertDescriptionProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};
