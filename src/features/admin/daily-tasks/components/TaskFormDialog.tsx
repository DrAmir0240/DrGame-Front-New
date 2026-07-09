"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { PersianDatePicker } from "@/components/shared";
import type { Task } from "../../tasks/types";
import { useDailyTaskChoices } from "../apis";
import VoiceRecorder from "../../tasks/components/VoiceRecorder";

interface FormValues {
  title: string;
  description: string;
  priority: string;
  employee: string;
  has_reward: boolean;
  reward_amount: string;
  start_date: string;
  start_time: string;
  deadline: string;
  deadline_time: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isPending: boolean;
  editTask?: Task | null;
  defaultType?: "Personal" | "Organize";
}

export default function DailyTaskFormDialog({ open, onClose, onSubmit, isPending, editTask, defaultType = "Personal" }: Props) {
  const { data: choices } = useDailyTaskChoices();
  const isOrganize = defaultType === "Organize";
  const [voiceFile, setVoiceFile] = useState<File | null>(null);

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      employee: "",
      has_reward: false,
      reward_amount: "",
      start_date: "",
      start_time: "",
      deadline: "",
      deadline_time: "",
    },
  });

  const hasReward = watch("has_reward");

  useEffect(() => {
    if (!choices) return;
    if (editTask) {
      const startTime = editTask.start_date?.includes("T") ? editTask.start_date.split("T")[1]?.slice(0, 5) : "";
      const deadlineTime = editTask.due_date?.includes("T") ? editTask.due_date.split("T")[1]?.slice(0, 5) : "";
      reset({
        title: editTask.title,
        description: editTask.description || "",
        priority: editTask.priority === "urgent" ? "immediate" : editTask.priority,
        employee: editTask.assigned_to_id || "",
        has_reward: false,
        reward_amount: "",
        start_date: editTask.start_date?.split("T")[0] || "",
        start_time: startTime,
        deadline: editTask.due_date?.split("T")[0] || "",
        deadline_time: deadlineTime,
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: choices.priority_choices[0]?.value || "",
        employee: "",
        has_reward: false,
        reward_amount: "",
        start_date: "",
        start_time: "",
        deadline: "",
        deadline_time: "",
      });
    }
    setVoiceFile(null);
  }, [editTask, open, choices, reset]);

  function onFormSubmit(values: FormValues) {
    const payload: any = {
      title: values.title,
      description: values.description,
      priority: values.priority,
      start_date: values.start_time ? `${values.start_date} ${values.start_time}:00` : values.start_date,
      deadline: values.deadline_time ? `${values.deadline} ${values.deadline_time}:00` : values.deadline,
      status: editTask ? undefined : "planed",
      voice: voiceFile,
    };
    if (isOrganize) {
      payload.employee = values.employee ? Number(values.employee) : undefined;
      payload.has_reward = values.has_reward;
      if (values.has_reward) payload.reward_amount = Number(values.reward_amount);
    }
    onSubmit(payload);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editTask ? "ویرایش وظیفه روزانه" : isOrganize ? "وظیفه روزانه سازمانی جدید" : "وظیفه روزانه جدید"}
      className="max-w-md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
          <Button type="submit" form="daily-task-form" disabled={isPending}>
            {editTask ? "ذخیره" : "ایجاد"}
          </Button>
        </>
      }
    >
      <form id="daily-task-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          id="daily-task-title"
          label="عنوان"
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">توضیحات</label>
          <textarea
            {...register("description")}
            rows={2}
            className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-600"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">اولویت <span className="mr-1 text-error-500">*</span></label>
          <Controller
            name="priority"
            control={control}
            rules={{ required: "اولویت الزامی است" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(choices?.priority_choices || []).map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.priority && <p className="text-xs text-error-500">{errors.priority.message}</p>}
        </div>
        {isOrganize && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">کارمند <span className="mr-1 text-error-500">*</span></label>
              <Controller
                name="employee"
                control={control}
                rules={{ required: "کارمند الزامی است" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="انتخاب کارمند" /></SelectTrigger>
                    <SelectContent>
                      {(choices?.employees || []).map((e) => (
                        <SelectItem key={e.id} value={String(e.id)}>{e.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.employee && <p className="text-xs text-error-500">{errors.employee.message}</p>}
            </div>
            <div className="flex items-center gap-2">
              <input
                id="daily-has-reward"
                type="checkbox"
                {...register("has_reward")}
                className="h-4 w-4 rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
              />
              <label htmlFor="daily-has-reward" className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                دارای پاداش
              </label>
            </div>
            {hasReward && (
              <Input
                id="daily-reward-amount"
                label="مبلغ پاداش"
                type="number"
                {...register("reward_amount")}
              />
            )}
          </>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Controller
              name="start_date"
              control={control}
              rules={{ required: "تاریخ شروع الزامی است" }}
              render={({ field }) => (
                <PersianDatePicker label="تاریخ شروع" required value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.start_date && <p className="text-xs text-error-500">{errors.start_date.message}</p>}
            <input
              type="time"
              {...register("start_time")}
              className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="deadline"
              control={control}
              rules={{ required: "مهلت الزامی است" }}
              render={({ field }) => (
                <PersianDatePicker label="مهلت" required value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.deadline && <p className="text-xs text-error-500">{errors.deadline.message}</p>}
            <input
              type="time"
              {...register("deadline_time")}
              className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm"
            />
          </div>
        </div>
        <VoiceRecorder onChange={setVoiceFile} />
      </form>
    </Dialog>
  );
}
