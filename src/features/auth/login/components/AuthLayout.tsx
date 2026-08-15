"use client";

import Link from "next/link";
import type { ReactNode, ComponentType } from "react";
import { Home } from "lucide-react";

interface AuthLayoutProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle?: ReactNode;
  footer?: ReactNode;
  homeButton?: boolean;
  children: ReactNode;
}

export default function AuthLayout({ icon: Icon, title, subtitle, footer, homeButton, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {homeButton && (
        <Link
          href="/"
          className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Home className="w-4 h-4" />
          خانه
        </Link>
      )}

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
