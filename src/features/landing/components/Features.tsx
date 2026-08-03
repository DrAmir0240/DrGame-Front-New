"use client";

import {
  Gamepad2,
  Wrench,
  ShoppingBag,
  Headphones,
  Shield,
  Zap,
} from "lucide-react";
import { features } from "../constants";

const iconMap: Record<string, React.ReactNode> = {
  Gamepad2: <Gamepad2 className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
};

const colorMap: Record<string, string> = {
  Gamepad2: "from-primary-500/20 to-primary-600/10 text-primary-600 dark:text-primary-400 border-primary-500/20",
  Wrench: "from-warning-500/20 to-warning-600/10 text-warning-600 dark:text-warning-400 border-warning-500/20",
  ShoppingBag: "from-success-500/20 to-success-600/10 text-success-600 dark:text-success-400 border-success-500/20",
  Headphones: "from-info-500/20 to-info-600/10 text-info-600 dark:text-info-400 border-info-500/20",
  Shield: "from-secondary-500/20 to-secondary-600/10 text-secondary-600 dark:text-secondary-400 border-secondary-500/20",
  Zap: "from-error-500/20 to-error-600/10 text-error-600 dark:text-error-400 border-error-500/20",
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 bg-background">
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs text-primary-600 dark:text-primary-300">خدمات ما</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            همه چیز برای
            <span className="text-primary-500"> گیمرها</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            از خرید اکانت و کنسول گرفته تا تعمیرات و پشتیبانی، تمام نیازهای
            گیمینگ شما را پوشش می‌دهیم
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-card border border-neutral-400 dark:border-neutral-600 hover:border-primary-500/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[feature.icon]} border flex items-center justify-center mb-4`}
              >
                {iconMap[feature.icon]}
              </div>
              <h3 className="text-foreground font-bold text-base mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
