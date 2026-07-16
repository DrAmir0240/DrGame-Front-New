export type SupplierType = "real" | "legal";

export type MovementDirection = "in" | "out";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const LIMIT = 10;
