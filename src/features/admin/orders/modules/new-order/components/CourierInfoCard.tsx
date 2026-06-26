"use client";

import { Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";

interface Props {
  courierName: string;
  courierPhone: string;
  courierFee: number;
  notes: string;
  onCourierChange: (field: string, value: string | number) => void;
  onNotesChange: (value: string) => void;
}

export default function CourierInfoCard({ courierName, courierPhone, courierFee, notes, onCourierChange, onNotesChange }: Props) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات پیک</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="نام پیک" value={courierName}
            onChange={(e) => onCourierChange("courierName", e.target.value)} />
          <Input placeholder="شماره پیک" value={courierPhone}
            onChange={(e) => onCourierChange("courierPhone", e.target.value)} />
          <Input type="number" placeholder="هزینه پیک" value={courierFee}
            onChange={(e) => onCourierChange("courierFee", Number(e.target.value))} />
        </CardContent>
      </Card>
      <div className="space-y-2">
        <textarea
          className="flex min-h-[60px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors"
          placeholder="یادداشت"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </>
  );
}
