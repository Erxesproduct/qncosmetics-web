"use client";

import { liteProducts } from "@/lib/lite";
import { createStore } from "@/lib/store";

/** Hearted products (slugs), kept in this browser only. */
const known = new Set(liteProducts.map((p) => p.s));
const EMPTY: string[] = [];
const store = createStore<string[]>("qn.hearts.v1", EMPTY, (raw) => (Array.isArray(raw) ? raw.filter((s): s is string => typeof s === "string" && known.has(s)).slice(0, 100) : EMPTY));

export const useHearts = store.use;
export const hearts = {
  toggle(slug: string) {
    const list = store.get();
    store.set(list.includes(slug) ? list.filter((s) => s !== slug) : [slug, ...list]);
  },
};
