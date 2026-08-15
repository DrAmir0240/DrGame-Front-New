"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Camera, Loader2 } from "lucide-react";

import { PageHeader } from "@/components/shared";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";
import { useCompleteProfile } from "./apis";
import type { CompleteProfileFormData } from "./types";

export default function CompleteProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const mutation = useCompleteProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormData>();

  useEffect(() => {
    if (!profilePic) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(profilePic);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePic]);

  const onSubmit = (data: CompleteProfileFormData) => {
    mutation.mutate(
      { ...data, profile_pic: profilePic },
      {
        onSuccess: () => {
          router.push("/");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="تکمیل پروفایل"
        description="برای استفاده از تمام امکانات، اطلاعات زیر را تکمیل کنید"
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>اطلاعات هویتی</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={preview || "/images/avatar-placeholder.png"}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-primary/10"
                />

                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setProfilePic(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="نام"
                required
                error={errors.first_name?.message}
                {...register("first_name", {
                  required: "نام الزامی است",
                })}
              />

              <Input
                label="نام خانوادگی"
                required
                error={errors.last_name?.message}
                {...register("last_name", {
                  required: "نام خانوادگی الزامی است",
                })}
              />

              <Input
                label="عنوان"
                required
                error={errors.title?.message}
                {...register("title", {
                  required: "عنوان الزامی است",
                })}
              />

              <Input
                label="نام گیرنده"
                required
                error={errors.receiver_name?.message}
                {...register("receiver_name", {
                  required: "نام گیرنده الزامی است",
                })}
              />

              <Input
                label="شماره گیرنده"
                required
                error={errors.receiver_phone?.message}
                {...register("receiver_phone", {
                  required: "شماره گیرنده الزامی است",
                })}
              />

              <Input
                label="استان"
                required
                error={errors.province?.message}
                {...register("province", {
                  required: "استان الزامی است",
                })}
              />

              <Input
                label="شهر"
                required
                error={errors.city?.message}
                {...register("city", {
                  required: "شهر الزامی است",
                })}
              />

              <Input
                label="کد پستی"
                required
                error={errors.postal_code?.message}
                {...register("postal_code", {
                  required: "کد پستی الزامی است",
                })}
              />
            </div>

            <div>
              <Textarea
                label="آدرس"
                required
                error={errors.address?.message}
                {...register("address", {
                  required: "آدرس الزامی است",
                })}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال ثبت...
                </>
              ) : (
                "تکمیل پروفایل"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
