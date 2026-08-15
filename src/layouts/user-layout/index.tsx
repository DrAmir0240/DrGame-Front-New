"use client";

import React from 'react';

import {Sidebar} from '@/components/layout/user/sidebar';
import Header from '@/components/layout/user/header';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';

interface PanelLayoutProps {
  children: React.ReactNode;
}

function PanelContent({ children }: PanelLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <div className={collapsed ? "md:mr-[70px] transition-all duration-300" : "md:mr-[260px] transition-all duration-300"}>
      <Header />

      <main className="p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}

export const UserLayout = ({ children }: PanelLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-neutral-50">
        <Sidebar />

        <PanelContent>
          {children}
        </PanelContent>
      </div>
    </SidebarProvider>
  );
}
