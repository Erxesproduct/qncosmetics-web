"use client";

import { cart } from "@/lib/cart";
import { hearts, useHearts } from "@/lib/wishlist";
import { HeartIcon, PlusIcon } from "./icons";

/** Heart (save) and, when there is nothing to choose, a quick «add to cart». */
export function CardActions({ slug, variantId, title }: { slug: string; variantId: string | null; title: string }) {
  const on = useHearts().includes(slug);
  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2">
      <button
        type="button"
        onClick={() => hearts.toggle(slug)}
        aria-pressed={on}
        aria-label={on ? `${title}: хадгалснаас хасах` : `${title}: хадгалах`}
        className={`grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-sm transition hover:scale-110 ${on ? "text-rose" : "text-ink"}`}
      >
        <HeartIcon size={19} filled={on} />
      </button>
      {variantId && (
        <button type="button" onClick={() => cart.add(variantId)} aria-label={`${title}: сагсанд нэмэх`} className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white shadow-sm transition hover:scale-110">
          <PlusIcon size={18} />
        </button>
      )}
    </div>
  );
}
