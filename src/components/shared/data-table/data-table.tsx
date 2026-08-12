import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";


export type DataTableColumn<T> = {
  header: React.ReactNode;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  rowClassName?: (row: T) => string | undefined;
}


export const DataTable = <T extends object>({
  columns,
  data,
  isLoading,
  onRowClick,
  emptyMessage = "داده‌ای یافت نشد",
  rowClassName,
}: DataTableProps<T>)=> {
  if (isLoading) {
    return (
      <div className=" rounded-xl border border-neutral-200 overflow-hidden">
        <Table >
          <TableHeader>
            <TableRow className="bg-neutral-0">
              {columns.map((col, i) => (
                <TableHead key={i} className="text-right font-medium">
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className=" rounded-xl border bg-neutral-0 border-neutral-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-100">
            {columns.map((col, i) => (
              <TableHead key={i} className="text-right font-medium">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.length > 0 ? (
            data.map((row, i) => (
              <TableRow
                key={(row as any).id ?? i}
                className={cn(
                  onRowClick ? "cursor-pointer hover:bg-muted/50" : "",
                  rowClassName?.(row)
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, j) => (
                  <TableCell key={j}>
                    {col.render
                      ? col.render(row)
                      : col.accessor
                      ? (row as any)[col.accessor]
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-10 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}