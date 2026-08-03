import type { Metadata } from "next";
import { dana } from "@/config/fonts/fonts";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { PhoneProvider } from "@/contexts/PhoneContext";
import { ToasterProvider } from "@/providers/ToasterProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Dr Game | دکتر گیم",
  description: "",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={dana.variable} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <QueryProvider>
            <PhoneProvider>{children}</PhoneProvider>
          </QueryProvider>
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
