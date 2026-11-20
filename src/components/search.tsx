"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { liteProducts } from "@/lib/lite";
import { SearchIcon } from "./icons";

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/[.\-]/g, " ").replace(/\s+/g, " ").trim();
const INDEX = liteProducts.map((p) => ({ p, hay: norm(`${p.n} ${p.b ?? ""}`) }));

/** Instant search over the whole catalog (name + brand), right in the header. Enter opens the full results. */
export function Search({ className = "", autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(-1);
  const router = useRouter();
  const id = useId();
  const box = useRef<HTMLInputElement>(null);

  const hits = useMemo(() => {
    const words = norm(q).split(" ").filter(Boolean);
    if (!words.length) return [];
    return INDEX.filter((x) => words.every((w) => x.hay.includes(w)))
      .sort((a, b) => b.p.a - a.p.a)
      .slice(0, 7)
      .map((x) => x.p);
  }, [q]);

  const go = (href: string) => {
    setOpen(false);
    box.current?.blur();
    router.push(href);
  };

  return (
    <form
      role="search"
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (at >= 0 && hits[at]) return go(`/p/${hits[at].s}`);
        if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <label htmlFor={id} className="sr-only">
        Бараа хайх
      </label>
      <SearchIcon size={19} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
      <input
        ref={box}
        id={id}
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setAt(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setAt((i) => Math.min(hits.length - 1, i + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setAt((i) => Math.max(-1, i - 1));
          } else if (e.key === "Escape") setOpen(false);
        }}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder="Маск, серум, будаг түгжигч, Sinko…"
        role="combobox"
        aria-expanded={open && hits.length > 0}
        aria-controls={`${id}-list`}
        aria-activedescendant={at >= 0 ? `${id}-${at}` : undefined}
        className="h-12 w-full rounded-full bg-white pr-4 pl-11 text-[15px] font-medium text-ink shadow-[inset_0_0_0_1.5px_var(--color-line)] transition outline-none placeholder:font-normal placeholder:text-ink-3 focus:shadow-[inset_0_0_0_2px_var(--color-ink)]"
      />
      {open && q.trim() && (
        <div className="rise absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-[24px] bg-white shadow-[0_24px_60px_-20px_rgb(29_21_18/0.4)] ring-1 ring-line">
          {hits.length ? (
            <ul id={`${id}-list`} role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
              {hits.map((p, i) => (
                <li key={p.s} id={`${id}-${i}`} role="option" aria-selected={i === at}>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(`/p/${p.s}`)} className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left transition ${i === at ? "bg-sand" : "hover:bg-cream"}`}>
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand">{p.t && <Image src={p.t} alt="" fill sizes="48px" className="object-cover" />}</span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-[14.5px] font-semibold">{p.n}</span>
                      <span className="text-[13px] text-ink-3">
                        {p.b ? `${p.b} · ` : ""}
                        {p.a ? formatPrice(p.p) : "Дууссан"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(`/shop?q=${encodeURIComponent(q.trim())}`)} className="mt-1 w-full rounded-2xl bg-sand px-3 py-2.5 text-center text-[14px] font-semibold hover:bg-gold-l">
                  «{q.trim()}»: бүх илэрц →
                </button>
              </li>
            </ul>
          ) : (
            <p className="p-5 text-center text-[14.5px] text-ink-2">«{q.trim()}» олдсонгүй. Брэнд эсвэл өөр үгээр хайгаарай.</p>
          )}
        </div>
      )}
    </form>
  );
}
