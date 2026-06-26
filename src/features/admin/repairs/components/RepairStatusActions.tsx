"use client";

import { Button } from "@/components/ui";
import type { RepairOrder, RepairStatus } from "../types";
import { statusActions } from "../constants";

interface Props {
  order: RepairOrder;
  onStatusChange: (id: number, status: RepairStatus) => void;
}

export default function RepairStatusActions({ order, onStatusChange }: Props) {
  const actions = statusActions[order.status];

  if (!actions?.length) return null;

  return (
    <div className="flex gap-1 flex-wrap">
      {actions.map((a) => (
        <Button
          key={a.next}
          size="sm"
          variant="outline"
          className="text-xs h-7"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(order.id, a.next);
          }}
        >
          {a.label}
        </Button>
      ))}
    </div>
  );
}
