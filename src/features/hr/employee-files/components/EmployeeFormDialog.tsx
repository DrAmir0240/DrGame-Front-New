"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  Button,
  Input,
  Checkbox,
} from "@/components/ui";
import PersianDatePicker from "@/components/shared/date-picker/persian-date-picker";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import {
  useCreateEmployee,
  useUpdateEmployee,
} from "../apis";
import type {
  EmployeeDetail,
  EmployeeFormData,
} from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  employee?: EmployeeDetail | null;
}

const defaultForm: EmployeeFormData = {
  user: 0,
  first_name: "",
  last_name: "",
  national_code: "",
  birth_date: "",
  employee_id: "",
  has_commission: false,
  commission_amount: 0,
  roles: [],
};

export default function EmployeeFormDialog({
  open,
  onClose,
  onSaved,
  employee,
}: Props) {
  const isEdit = !!employee;

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<EmployeeFormData>({
    defaultValues: defaultForm,
  });

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  useEffect(() => {
    if (employee) {
      reset({
        user: 0,
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        national_code: employee.national_code || "",
        birth_date: employee.birth_date || "",
        employee_id: employee.employee_id || "",
        has_commission: employee.has_commission,
        commission_amount: employee.commission_amount,
        roles: employee.roles || [],
      });
    } else {
      reset(defaultForm);
    }
  }, [employee, open, reset]);

  const loading = createMutation.isPending || updateMutation.isPending;
  const hasCommission = watch("has_commission");

  function onSubmit(data: EmployeeFormData) {
    if (isEdit && employee) {
      updateMutation.mutate(
        { id: employee.id, ...data },
        { onSuccess: onSaved }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: onSaved,
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={isEdit ? "ویرایش کارمند" : "کارمند جدید"}
      className="max-w-lg"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            form="employee-form"
            disabled={loading}
            className="flex-1"
          >
            {loading
              ? "در حال ذخیره..."
              : isEdit
                ? "بروزرسانی"
                : "ذخیره"}
          </Button>
        </div>
      }
    >
      <form
        id="employee-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="نام"
            error={errors.first_name?.message}
            {...register("first_name", { required: "نام الزامی است" })}
          />
          <Input
            label="نام خانوادگی"
            error={errors.last_name?.message}
            {...register("last_name", { required: "نام خانوادگی الزامی است" })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="کد ملی"
            {...register("national_code")}
          />
          <Input
            label="کد پرسنلی"
            {...register("employee_id")}
          />
        </div>
        <Controller
          name="birth_date"
          control={control}
          render={({ field }) => (
            <PersianDatePicker
              label="تاریخ تولد"
              placeholder="تاریخ تولد"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {!isEdit && (
          <Input
            label="شناسه کاربر"
            type="number"
            {...register("user", { valueAsNumber: true })}
          />
        )}
        <Controller
          name="has_commission"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={(v) => field.onChange(!!v)}
              />
              <label className="text-sm">
                پورسانت دارد
              </label>
            </div>
          )}
        />
        {hasCommission && (
          <Input
            label="مبلغ پورسانت"
            type="number"
            {...register("commission_amount", { valueAsNumber: true })}
          />
        )}
      </form>
    </Dialog>
  );
}
