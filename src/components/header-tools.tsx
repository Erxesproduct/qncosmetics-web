"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { cartCount, useCart } from "@/lib/cart";
import { getLiteVariant } from "@/lib/lite";
import { useHearts } from "@/lib/wishlist";
import { Logo } from "./brand";
import { BagIcon, CloseIcon, GridIcon, HeartIcon, HomeIcon, MenuIcon, PhoneIcon, SearchIcon } from "./icons";
import { Search } from "./search";

const Badge = ({ n }: { n: number }) =>
  n > 0 ? <span className="pop-in absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose px-1 text-[11.5px] font-bold text-white tabular-nums">{n}</span> : null;

export function CartButton() {
  const n = cartCount(useCart());
  return (
    <Link href="/cart" className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-sand" aria-label={`Сагс: ${n} бараа`}>
      <BagIcon size={22} />
      <Badge n={n} />
    </Link>
  );
}

export function HeartsButton() {
  const n = useHearts().length;
  return (
    <Link href="/hearts" className="relative hidden h-11 w-11 place-items-center rounded-full hover:bg-sand sm:grid" aria-label={`Хадгалсан: ${n}`}>
      <HeartIcon size={21} />
      <Badge n={n} />
    </Link>
  );
}

function useCloseOnNavigate(open: boolean, setOpen: (b: boolean) => void) {
  const path = usePathname();
  const [seen, setSeen] = useState(path);
  if (seen !== path) {
    setSeen(path);
    setOpen(false);
  }
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);
}

/** Phones: a search button that opens a full-width search sheet. */
export function MobileSearch() {
  const [open, setOpen] = useState(false);
  useCloseOnNavigate(open, setOpen);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand md:hidden" aria-label="Хайх">
        <SearchIcon size={21} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal aria-label="Хайх">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="Хаах" />
          <div className="rise absolute inset-x-0 top-0 flex items-center gap-2 rounded-b-[28px] bg-cream p-3 pt-4">
            <Search autoFocus className="flex-1" />
            <button type="button" onClick={() => setOpen(false)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white" aria-label="Хайлт хаах">
              <CloseIcon size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function MobileMenu({ items }: { items: { href: string; label: string; dot: string }[] }) {
  const [open, setOpen] = useState(false);
  useCloseOnNavigate(open, setOpen);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="-ml-2 grid h-11 w-11 place-items-center rounded-full hover:bg-sand lg:hidden" aria-label="Цэс нээх" aria-expanded={open}>
        <MenuIcon size={22} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal aria-label="Цэс">
          <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="Хаах" />
          <div className="rise absolute inset-y-0 left-0 flex w-[min(86vw,360px)] flex-col overflow-y-auto rounded-r-[32px] bg-cream p-6">
            <div className="flex items-center justify-between gap-2">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white" aria-label="Цэс хаах">
                <CloseIcon size={20} />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1" aria-label="Цэс">
              <Link href="/shop" className="rounded-2xl px-4 py-3 text-[21px] font-bold tracking-tight hover:bg-sand">
                Бүх бараа
              </Link>
              {items.map((n) => (
                <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[21px] font-bold tracking-tight hover:bg-sand">
                  <span className={`h-2.5 w-2.5 rounded-full ${n.dot}`} aria-hidden />
                  {n.label}
                </Link>
              ))}
              <Link href="/info" className="rounded-2xl px-4 py-3 text-[16px] text-ink-2 hover:bg-sand">
                Хүргэлт, төлбөр, салбарууд
              </Link>
            </nav>
            <a href={`tel:${business.phone.tel}`} className="btn btn-light mt-auto">
              <PhoneIcon size={17} /> {business.phone.display}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/** Thumb-reach bar for phones. */
export function BottomBar() {
  const path = usePathname();
  const n = cartCount(useCart());
  const h = useHearts().length;
  const items = [
    { href: "/", label: "Нүүр", Icon: HomeIcon, on: path === "/" },
    { href: "/shop", label: "Дэлгүүр", Icon: GridIcon, on: path.startsWith("/shop") || path.startsWith("/p/") },
    { href: "/hearts", label: "Хадгалсан", Icon: HeartIcon, on: path === "/hearts", n: h },
    { href: "/cart", label: "Сагс", Icon: BagIcon, on: path === "/cart", n },
  ];
  if (path.startsWith("/p/")) return null; // the product page has its own sticky add-to-cart bar
  return (
    <nav aria-label="Доод цэс" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-[26px] bg-ink/95 p-1.5 shadow-[0_12px_40px_-12px_rgb(29_21_18/0.6)] backdrop-blur md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
      {items.map(({ href, label, Icon, on, n: c }) => (
        <Link key={href} href={href} aria-current={on ? "page" : undefined} className={`relative flex flex-col items-center gap-0.5 rounded-[20px] py-2 text-[11.5px] font-semibold transition ${on ? "bg-white text-ink" : "text-white/75"}`}>
          <span className="relative">
            <Icon size={21} />
            {!!c && <span className="absolute -top-1.5 -right-2.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose px-1 text-[10.5px] font-bold text-white">{c}</span>}
          </span>
          {label}
        </Link>
      ))}
    </nav>
  );
}

/** «Added to cart» note, from the `qn:added` event the cart sends. */
export function AddedToast() {
  const [item, setItem] = useState<{ id: string; key: number } | null>(null);
  useEffect(() => {
    let t = 0;
    const on = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail.id;
      setItem({ id, key: Date.now() });
      window.clearTimeout(t);
      t = window.setTimeout(() => setItem(null), 3200);
    };
    window.addEventListener("qn:added", on);
    return () => {
      window.removeEventListener("qn:added", on);
      window.clearTimeout(t);
    };
  }, []);
  const v = item ? getLiteVariant(item.id) : null;
  if (!item || !v) return null;
  return (
    <div key={item.key} role="status" className="pop-in fixed inset-x-3 bottom-24 z-50 mx-auto flex max-w-md items-center gap-3 rounded-[22px] bg-ink p-3 pr-4 text-white shadow-2xl md:bottom-8">
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-sand">{v.t && <Image src={v.t} alt="" fill sizes="56px" className="object-cover" />}</span>
      <span className="min-w-0 flex-1 text-[14px] leading-snug">
        <b className="block">Сагсанд нэмлээ</b>
        <span className="block truncate text-white/70">
          {v.n}
          {v.z ? ` · ${v.z}` : ""}
        </span>
      </span>
      <Link href="/cart" className="btn btn-gold min-h-10 shrink-0 px-4 text-[14px]">
        Сагс
      </Link>
    </div>
  );
}
