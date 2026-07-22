"use client";

import { cn } from "@/lib/utils";
import type { Employee } from "../types";

interface Props {
  employee: Employee;
  isSelected: boolean;
  onClick: () => void;
}

export default function EmployeeListItem({ employee, isSelected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg text-right transition-all",
        isSelected
          ? "bg-primary-50 border border-primary-200"
          : "hover:bg-neutral-50 border border-transparent"
      )}
    >
      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
        {employee.profile_picture ? (
          <img
            src={employee.profile_picture}
            alt={employee.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          employee.first_name?.[0]
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{employee.full_name}</p>
        <p className="text-xs text-muted-foreground">{employee.employee_id}</p>
      </div>
      {employee.roles_detail?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {employee.roles_detail.slice(0, 2).map((role) => (
            <span
              key={role.id}
              className="text-[10px] px-1.5 py-0.5 rounded bg-secondary-100 text-secondary-700 border border-secondary-200"
            >
              {role.role_name}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
