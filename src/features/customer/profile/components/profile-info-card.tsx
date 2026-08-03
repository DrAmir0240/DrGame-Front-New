"use client";

import { Pencil, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Button, Input } from "@/components/ui";


import type { Profile } from "../types";
import { useUpdateProfile } from "../apis";

interface Props {
  profile: Profile;
}

export default function PersonalInfoCard({
  profile,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<Profile>({
    defaultValues: profile,
  });

  useEffect(() => {
    reset(profile);
  }, [profile, reset]);

  const onSubmit =  (values: Profile) => {
    updateProfile.mutate(values);

    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(profile);
    setIsEditing(false);
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>اطلاعات شخصی</CardTitle>

        {!isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={18} />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleSubmit(onSubmit)}
             
            >
              <Save size={18} className="text-success" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
            >
              <X size={18} className="text-error" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="نام"
            disabled={!isEditing}
            {...register("first_name")}
          />

          <Input
            label="نام خانوادگی"
            disabled={!isEditing}
            {...register("last_name")}
          />

          <Input
            label="شماره موبایل"
            disabled
            {...register("phone")}
          />

          <Input
            label="ایمیل"
            disabled={!isEditing}
            {...register("email")}
          />

          <Input
            label="کد پستی"
            disabled={!isEditing}
            {...register("postal_code")}
          />

          <div className="md:col-span-2">
            <Input
              label="آدرس"
              disabled={!isEditing}
              {...register("address")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}