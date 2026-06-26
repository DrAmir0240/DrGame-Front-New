import * as React from "react";

import { cn } from "@/lib/utils";
import type { TextareaProps } from "./types";

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            {label}
          </label>
        )}

        <textarea
          id={id}
          ref={ref}
          className={cn(
            "flex min-h-[60px] w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
