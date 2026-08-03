import React from 'react';

import {Sidebar} from '@/components/layout/admin/sidebar';
import Header from '@/components/layout/admin/header';

interface PanelLayoutProps {
  children: React.ReactNode;
}

export const  AdminLayout =({ children }: PanelLayoutProps)=> {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />

      <div className="md:mr-[260px] transition-all duration-300">
        <Header />

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}