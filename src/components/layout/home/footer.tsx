import { Gamepad2 } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "محصولات",
    links: [
      { label: "بازی‌ها", href: "/games" },
      { label: "اکانت بازی", href: "/products" },
      { label: "کنسول بازی", href: "/products" },
      { label: "لوازم جانبی", href: "/products" },
    ],
  },
  {
    title: "خدمات",
    links: [
      { label: "تعمیرات کنسول", href: "#" },
      { label: "تعمیر گیم‌پد", href: "#" },
      { label: "مشاوره خرید", href: "#" },
      { label: "گارانتی محصولات", href: "#" },
    ],
  },
  {
    title: "دسترسی سریع",
    links: [
      { label: "درباره ما", href: "/about-us" },
      { label: "سبد خرید", href: "/cart" },
      { label: "سوالات متداول", href: "#" },
      { label: "حریم خصوصی", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-muted/50 border-t border-neutral-200 dark:border-neutral-600">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">
                دکتر<span className="text-primary-500">گیم</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              فروشگاه تخصصی محصولات گیمینگ با بیش از ۵ سال سابقه در خدمت
              گیمرهای ایرانی
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group, idx) => (
            <div key={idx}>
              <h4 className="text-foreground font-bold text-sm mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link, lidx) => (
                  <li key={lidx}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-neutral-400 dark:border-neutral-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} دکترگیم. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              توسط تیم دکترگیم ساخته شده
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
