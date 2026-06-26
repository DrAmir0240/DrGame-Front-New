import type * as React from "react";

export type PaginationProps = React.HTMLAttributes<HTMLElement>;
export type PaginationContentProps = React.HTMLAttributes<HTMLUListElement>;
export type PaginationItemProps = React.HTMLAttributes<HTMLLIElement>;
export type PaginationLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
};
export type PaginationPreviousProps = PaginationLinkProps;
export type PaginationNextProps = PaginationLinkProps;
export type PaginationEllipsisProps = React.HTMLAttributes<HTMLSpanElement>;
