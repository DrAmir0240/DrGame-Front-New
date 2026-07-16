import type { MovementDirection } from "../shared/types";

export interface InventoryMovement {
  id: number;
  product: number;
  product_entity: number | null;
  direction: MovementDirection;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface MovementFormData {
  product: number | null;
  product_entity: number | null;
  direction: MovementDirection;
}

export const DIRECTION_MAP: Record<
  MovementDirection,
  { label: string; color: string }
> = {
  in: {
    label: "ورودی",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  out: { label: "خروجی", color: "bg-red-100 text-red-700 border-red-200" },
};

export const directionOptions = [
  { value: "all", label: "همه" },
  { value: "in", label: "ورودی" },
  { value: "out", label: "خروجی" },
];
