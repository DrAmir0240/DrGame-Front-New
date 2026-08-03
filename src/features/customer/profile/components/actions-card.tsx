"use client";

import {
  KeyRound,
  LogOut,
  Package,
  Ticket,
  ChevronLeft,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { Button } from "@/components/ui";

interface ActionsCardProps {
  onChangePassword?: () => void;
  onOrders?: () => void;
  onTickets?: () => void;
  onLogout?: () => void;
}

export default function ActionsCard({
  onChangePassword,
  onOrders,
  onTickets,
  onLogout,
}: ActionsCardProps) {
  const actions = [
    {
      title: "تغییر رمز عبور",
      description: "رمز عبور حساب خود را تغییر دهید.",
      icon: KeyRound,
      onClick: onChangePassword,
    },
    {
      title: "سفارش‌های من",
      description: "مشاهده تاریخچه سفارش‌ها.",
      icon: Package,
      onClick: onOrders,
    },
    {
      title: "تیکت‌های پشتیبانی",
      description: "مدیریت و پیگیری تیکت‌ها.",
      icon: Ticket,
      onClick: onTickets,
    },
  ];

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>عملیات حساب</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={action.onClick}
              className="w-full flex items-center justify-between rounded-xl border p-4 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    {action.title}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>

              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          );
        })}

        <Button
          variant="destructive"
          className="w-full mt-3"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          خروج از حساب
        </Button>
      </CardContent>
    </Card>
  );
}