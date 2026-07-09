import type { Metadata } from "next";
import { dana } from "@/config/fonts/fonts";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { PhoneProvider } from "@/contexts/PhoneContext";
import { ToasterProvider } from "@/providers/ToasterProvider";

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
    <html lang="fa" dir="rtl" className={dana.variable}>
      <body className="min-h-full flex flex-col">
        <QueryProvider><PhoneProvider>{children}</PhoneProvider></QueryProvider>
        <ToasterProvider />
        </body>
    </html>
  );
}
