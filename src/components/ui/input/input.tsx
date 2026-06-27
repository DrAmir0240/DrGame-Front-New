import * as React from "react";

import { cn } from "@/lib/utils";
import type { InputProps } from "./types";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, required, leftSection, rightSection, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            {label}
            {required && <span className="mr-1 text-error-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftSection && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {leftSection}
            </div>
          )}
          {rightSection && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {rightSection}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md px-3 border border-neutral-200 bg-transparent py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-600 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              leftSection && "pl-10",
              rightSection && "pr-10",
              !leftSection && !rightSection && "px-3",
              error && "border-error-500 focus-visible:ring-error-500",
              className,
            )}
            required={required}
            {...props}
          />
        </div>

        {error && <p className="text-xs text-error-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
