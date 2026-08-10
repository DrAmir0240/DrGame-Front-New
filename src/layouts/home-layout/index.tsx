import React from 'react';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};
