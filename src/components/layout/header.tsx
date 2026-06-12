'use client';

import React from 'react';
import { Bell, Search, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {


  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="جستجو..."
            className="pr-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />

          <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center">
            ۳
          </span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pr-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>

              <span className="text-sm hidden sm:inline">
                {'مدیر'}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>پروفایل</DropdownMenuItem>
            <DropdownMenuItem>تنظیمات</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive"
            >
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}