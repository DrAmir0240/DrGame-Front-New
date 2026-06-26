import type * as React from 'react';

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  children?: React.ReactNode;
};
