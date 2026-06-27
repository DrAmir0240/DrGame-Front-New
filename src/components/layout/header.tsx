"use client";

import React from "react";
import { Bell, Search, User, LogOut, Settings, UserCircle } from "lucide-react";

import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { useGetAuthQuery } from "@/layouts/admin-layout/apis/use-get-auth.query";


export default function Header() {
  const { data: user } = useGetAuthQuery();

  return (
    <header className="h-16 border-b border-neutral-200 bg-neutral-0 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="جستجو..."
            className="pr-10 bg-neutral-100 shadow-none border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />

          <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-error rounded-full text-[10px] text-white flex items-center justify-center">
            ۳
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pr-2">
              {user?.user_pic ? (
                <img
                  src={user.user_pic}
                  alt={user.user_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
              <span className="text-sm hidden sm:inline">
                {user?.user_name || user?.phone}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem className="gap-2">
              <UserCircle className="w-4 h-4" />
              پروفایل
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="w-4 h-4" />
              تنظیمات
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-error gap-2">
              <LogOut className="w-4 h-4" />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
