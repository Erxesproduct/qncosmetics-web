"use client";

import { useMemo, useState } from "react";
import { cart, maxQty } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { hearts, useHearts } from "@/lib/wishlist";
import { BagIcon, HeartIcon, MinusIcon, PlusIcon } from "./icons";

type V = { id: string; label: string | null; opts: Record<string, string>; price: number; compareAt: number | null; stock: number | null };
type O = { title: string; values: string[] };

/** Options (shade, type…), quantity and «add to cart», with a sticky bar on phones. */
export function ProductBuy({ slug, title, options, variants }: { slug: string; title: string; options: O[]; variants: V[] }) {
  const out = (v: V) => v.stock === 0;
  // pre-select every option that has a single value; otherwise the customer chooses
  const [sel, setSel] = useState<Record<string, string>>(() => Object.fromEntries(options.filter((o) => o.values.length === 1).map((o) => [o.title, o.values[0]])));
  const [qty, setQty] = useState(1);
  const [warn, setWarn] = useState(false);
  const saved = useHearts().includes(slug);

  const chosen = useMemo(() => (options.length ? variants.find((v) => options.every((o) => v.opts[o.title] === sel[o.title])) : variants[0]) ?? null, [options, variants, sel]);
  const missing = options.filter((o) => !sel[o.title]);
  /** a value is possible if some buyable variant has it together with the other choices made so far */
  const possible = (title: string, value: string) => variants.some((v) => !out(v) && v.opts[title] === value && options.every((o) => o.title === title || !sel[o.title] || v.opts[o.title] === sel[o.title]));
  const allOut = variants.every(out);
  const price = chosen?.price ?? variants[0].price;
  const compareAt = chosen?.compareAt ?? variants[0].compareAt;
  const cap = chosen ? maxQty(chosen.id) : 10;

  const add = () => {
    if (!chosen || out(chosen)) {
      setWarn(true);
      document.getElementById("options")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    cart.add(chosen.id, qty);
    setWarn(false);
  };

  const button = (big: boolean) => (
    <button type="button" onClick={add} disabled={allOut} className={`btn btn-ink whitespace-nowrap ${big ? "h-14 flex-1 text-[16px]" : "h-12 flex-1 px-4 text-[14.5px]"}`}>
      <BagIcon size={19} /> {allOut ? "Дууссан" : chosen && out(chosen) ? "Энэ сонголт дууссан" : "Сагсанд нэмэх"}
    </button>
  );

  return (
    <>
      <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
        <span className={`text-[34px] font-bold tracking-tight tabular-nums ${compareAt ? "text-rose-d" : ""}`}>{formatPrice(price)}</span>
        {compareAt && (
          <>
            <s className="text-[17px] text-ink-3 tabular-nums">{formatPrice(compareAt)}</s>
            <span className="tag bg-rose text-white">−{Math.round((1 - price / compareAt) * 100)}%</span>
          </>
        )}
      </p>

      <div id="options" className="mt-6 space-y-5">
        {options.map((o) => (
          <fieldset key={o.title}>
            <legend className="flex w-full items-center justify-between text-[15px] font-semibold">
              <span>
                {o.title}
                {sel[o.title] && <span className="font-normal text-ink-2">: {sel[o.title]}</span>}
              </span>
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-label={o.title}>
              {o.values.map((val) => {
                const ok = possible(o.title, val);
                const on = sel[o.title] === val;
                return (
                  <button
                    key={val}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-disabled={!ok || undefined}
                    onClick={() => {
                      setSel((s) => ({ ...s, [o.title]: on && o.values.length > 1 ? "" : val }));
                      setQty(1);
                      setWarn(false);
                    }}
                    className={`chip min-w-12 justify-center ${val.length <= 3 ? "text-[15px] font-semibold" : ""}`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        {warn && missing.length > 0 && (
          <p role="alert" className="pop-in rounded-2xl bg-rose-l px-4 py-2.5 text-[14.5px] font-semibold text-rose-d">
            {missing.map((o) => o.title).join(", ")} сонгоно уу.
          </p>
        )}
      </div>

      <div className="mt-6 hidden items-center gap-3 md:flex">
        {!allOut && (
          <div className="flex h-14 items-center rounded-full bg-sand">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-14 w-12 place-items-center" aria-label="Цөөлөх">
              <MinusIcon size={16} />
            </button>
            <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty((q) => Math.min(cap || 10, q + 1))} className="grid h-14 w-12 place-items-center" aria-label="Нэмэх">
              <PlusIcon size={16} />
            </button>
          </div>
        )}
        {button(true)}
        <button type="button" onClick={() => hearts.toggle(slug)} aria-pressed={saved} aria-label={saved ? "Хадгалснаас хасах" : "Хадгалах"} className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ring-1 ring-line transition hover:ring-rose ${saved ? "bg-rose-l text-rose-d" : "bg-white"}`}>
          <HeartIcon size={21} filled={saved} />
        </button>
      </div>

      {/* phones: sticky bar in thumb reach */}
      <div className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-[26px] bg-white/95 p-2 shadow-[0_12px_40px_-12px_rgb(29_21_18/0.4)] ring-1 ring-line backdrop-blur md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
        <button type="button" onClick={() => hearts.toggle(slug)} aria-pressed={saved} aria-label={saved ? "Хадгалснаас хасах" : "Хадгалах"} className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${saved ? "bg-rose-l text-rose-d" : "bg-sand"}`}>
          <HeartIcon size={20} filled={saved} />
        </button>
        <span className="min-w-0 px-1">
          <span className="block truncate text-[12px] text-ink-3">{chosen?.label ?? (missing.length ? `${missing[0].title} сонгоно уу` : title)}</span>
          <b className="block text-[17px] font-bold tabular-nums">{formatPrice(price * qty)}</b>
        </span>
        {button(false)}
      </div>
    </>
  );
}
