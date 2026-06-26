import type * as React from 'react';

export type BreadcrumbProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type BreadcrumbListProps = React.HTMLAttributes<HTMLOListElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type BreadcrumbItemProps = React.HTMLAttributes<HTMLLIElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type BreadcrumbLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export type BreadcrumbPageProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type BreadcrumbSeparatorProps = React.HTMLAttributes<HTMLLIElement> & {
  className?: string;
  children?: React.ReactNode;
};

export type BreadcrumbEllipsisProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  children?: React.ReactNode;
};
