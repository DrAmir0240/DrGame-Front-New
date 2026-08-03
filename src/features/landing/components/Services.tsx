"use client";

import { Monitor, Palette, Cpu } from "lucide-react";
import { services } from "../constants";

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="w-8 h-8" />,
  Palette: <Palette className="w-8 h-8" />,
  Cpu: <Cpu className="w-8 h-8" />,
};

export default function Services() {
  return (
    <section id="about" className="relative py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs text-primary-600 dark:text-primary-300">دسته‌بندی محصولات</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            پرفروش‌ترین
            <span className="text-primary-500"> دسته‌بندی‌ها</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            محبوب‌ترین محصولات و خدمات ما در دنیای گیمینگ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl  hover:border-primary-500/20 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-[0.06] group-hover:opacity-[0.1] transition-opacity`}
              />

              <div className="relative p-8">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 text-white shadow-lg`}
                >
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-foreground font-bold text-xl mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-primary-500 text-sm font-medium group-hover:gap-3 transition-all">
                  <span>مشاهده</span>
                  <span className="text-lg">←</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
