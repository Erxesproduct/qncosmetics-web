"use client";

import { getLiteVariant, isSoldOut } from "@/lib/lite";
import { createStore } from "@/lib/store";

/** One cart line per variant (Zochil product, or product + shade / type). */
export type CartItem = { id: string; qty: number };
export const MAX_QTY = 10;

/** Most units a customer can order: stock when counted, never more than MAX_QTY. */
export function maxQty(id: string) {
  const v = getLiteVariant(id);
  if (!v || isSoldOut(v)) return 0;
  return v.k == null ? MAX_QTY : Math.min(MAX_QTY, v.k);
}

const EMPTY: CartItem[] = [];
const store = createStore<CartItem[]>("qn.cart.v1", EMPTY, (raw) =>
  Array.isArray(raw)
    ? raw
        .filter((i): i is CartItem => !!i && typeof i.id === "string" && Number.isInteger(i.qty) && i.qty > 0 && maxQty(i.id) > 0)
        .map((i) => ({ id: i.id, qty: Math.min(i.qty, maxQty(i.id)) }))
    : EMPTY,
);

export const useCart = store.use;

export const cart = {
  add(id: string, qty = 1) {
    const cap = maxQty(id);
    if (cap <= 0) return;
    const items = store.get();
    const has = items.some((i) => i.id === id);
    store.set(has ? items.map((i) => (i.id === id ? { ...i, qty: Math.min(cap, i.qty + qty) } : i)) : [...items, { id, qty: Math.min(cap, qty) }]);
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("qn:added", { detail: { id } }));
  },
  setQty(id: string, qty: number) {
    const items = store.get();
    store.set(qty <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty: Math.min(maxQty(id), qty) } : i)));
  },
  clear() {
    store.set(EMPTY);
  },
};

export const cartCount = (list: CartItem[]) => list.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (list: CartItem[]) => list.reduce((s, i) => s + (getLiteVariant(i.id)?.p ?? 0) * i.qty, 0);
