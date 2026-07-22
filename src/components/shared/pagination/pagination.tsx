"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  count: number;
  limit: number;
  onPageChange: (p: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  count,
  limit,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between text-xs text-muted-foreground ${className ?? ""}`}>
      <span>
        {page * limit + 1}-{Math.min((page + 1) * limit, count)} از {count}
      </span>
      <div className="flex gap-1">
        <button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="px-2 py-1 rounded border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50"
        >
          قبلی
        </button>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="px-2 py-1 rounded border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50"
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
