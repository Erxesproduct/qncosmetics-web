import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { Logo } from "./brand";
import { CartButton, HeartsButton, MobileMenu, MobileSearch } from "./header-tools";
import { Search } from "./search";

export const NAV = [
  { href: "/shop?g=skin", label: "Арьс арчилгаа", dot: "bg-peach" },
  { href: "/shop?g=makeup", label: "Нүүр будалт", dot: "bg-rose" },
  { href: "/shop?g=hair", label: "Үс арчилгаа", dot: "bg-mint" },
  { href: "/shop?sale=1", label: "Хямдрал", dot: "bg-gold" },
  { href: "/#routine", label: "Арчилгааны дараалал", dot: "bg-lilac" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="overflow-hidden bg-ink text-[12.5px] leading-9 font-medium text-white/85">
        <div className="wrap flex h-9 items-center justify-center gap-5 truncate sm:justify-between">
          <span className="truncate">
            УБ хотод 24–72 цагт хүргэнэ · {formatPrice(business.zone.price)} · QPay
          </span>
          <span className="hidden items-center gap-5 sm:flex">
            {business.promise.map((p) => (
              <span key={p} className="text-gold-l">
                ✦ {p}
              </span>
            ))}
          </span>
        </div>
      </div>
      <div className="border-b border-line/80 bg-cream/90 backdrop-blur-md">
        <div className="wrap flex h-[68px] items-center gap-3 md:h-[76px] md:gap-6">
          <MobileMenu items={NAV} />
          <Link href="/" className="shrink-0" aria-label="Qn cosmetics: нүүр хуудас">
            <Logo />
          </Link>
          <Search className="mx-auto hidden w-full max-w-[460px] md:block" />
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <MobileSearch />
            <HeartsButton />
            <CartButton />
          </div>
        </div>
        <nav aria-label="Үндсэн цэс" className="hidden border-t border-line/60 lg:block">
          <div className="wrap flex h-12 items-center gap-1">
            <Link href="/shop" className="rounded-full px-3.5 py-1.5 text-[14.5px] font-semibold hover:bg-sand">
              Бүх бараа
            </Link>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[14.5px] font-medium text-ink-2 transition hover:bg-sand hover:text-ink">
                <span className={`h-2 w-2 rounded-full ${n.dot}`} aria-hidden />
                {n.label}
              </Link>
            ))}
            <Link href="/info#branches" className="ml-auto rounded-full px-3.5 py-1.5 text-[14px] font-medium text-ink-2 hover:bg-sand">
              7 салбар
            </Link>
            <a href={`tel:${business.phone.tel}`} className="rounded-full px-3.5 py-1.5 text-[14px] font-semibold hover:bg-sand">
              {business.phone.display}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
