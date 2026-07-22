"use client";

import { useState } from "react";
import type { OrderPrefix } from "../../../types";
import CategorySection from "./CategorySection";

interface Props {
  roles: { id: number; role_name: string }[];
}

const subTabs: { key: OrderPrefix; label: string }[] = [
  { key: "sony-account", label: "اکانت سونی" },
  { key: "product", label: "کالا" },
  { key: "repair", label: "تعمیرات" },
];

export default function ConfigTab({ roles }: Props) {
  const [activeTab, setActiveTab] = useState<OrderPrefix>("sony-account");

  return (
    <div>
      <div className="flex gap-1 border-b border-neutral-200 mb-6">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-neutral-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <CategorySection orderPrefix={activeTab} roles={roles} />
    </div>
  );
}
