import "server-only";

import data from "@/data/catalog.json";

export type Variant = {
  /** "<zochilProductId>" or "<zochilProductId>-<zochilVariantId>". erxes product code QN-<id>. */
  id: string;
  /** option values joined («104в», «Vanilla mint balm»), null for products without options */
  label: string | null;
  opts: Record<string, string>;
  price: number;
  compareAt: number | null;
  /** Zochil stock where the shop counts it; null = not counted (orderable), 0 = sold out */
  stock: number | null;
};
export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Option = { title: string; values: string[] };
export type Product = {
  id: number;
  slug: string;
  title: string;
  /** dr-rashel | estelin | sinko | phoera | imagic | beauty-glazed | gabrini, from the shop's own categories */
  brand: string | null;
  /** skin | makeup | hair */
  group: string;
  sub: string;
  /** skin concerns named in the product name (ingredient or claim) */
  concerns: string[];
  lines: string[];
  options: Option[];
  variants: Variant[];
  /** place on the shop's own bestseller list, -1 when not on it */
  best: number;
  createdAt: string;
  images: Photo[];
};
export type Group = { id: string; name: string; line: string; count: number; subs: { name: string; count: number }[] };
export type Brand = { id: string; name: string; origin: string | null; group: string; line: string; count: number };
export type Concern = { id: string; name: string; count: number };

export const products = data.products as Product[];
export const groups = data.groups as Group[];
export const brands = data.brands as Brand[];
export const concerns = data.concerns as Concern[];
export const shop = data.shop;
export const catalogInfo = { source: data.source, shopId: data.shopId, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getVariant = (id: string) => byVariant.get(id);
export const getGroup = (id: string) => groups.find((g) => g.id === id);
export const getBrand = (id: string | null) => (id ? brands.find((b) => b.id === id) : undefined);
export const getConcern = (id: string) => concerns.find((c) => c.id === id);
export const sku = (id: string) => `QN-${id}`;

export const soldOut = (v: Pick<Variant, "stock">) => v.stock === 0;
export const available = (p: Product) => p.variants.some((v) => !soldOut(v));
export const fromPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const cheapest = (p: Product) => p.variants.reduce((a, b) => (b.price < a.price ? b : a));
export const onSale = (p: Product) => p.variants.some((v) => v.compareAt);
export const discount = (p: Product) => Math.max(0, ...p.variants.map((v) => (v.compareAt ? Math.round((1 - v.price / v.compareAt) * 100) : 0)));
export const singleVariant = (p: Product) => (p.variants.length === 1 && !soldOut(p.variants[0]) ? p.variants[0].id : null);
export const cover = (p: Product) => p.images[0]?.thumb ?? null;
export const second = (p: Product) => p.images[1]?.thumb ?? null;
/** «5 өнгө», «3 төрөл» on a card */
export const choiceLabel = (p: Product) => (p.options.length === 1 && p.options[0].values.length > 1 ? `${p.options[0].values.length} ${p.options[0].title.toLowerCase()}` : null);

/** In stock first, then the shop's bestseller order, then the deepest sale, then newest. */
const rank = (p: Product) => (p.best < 0 ? 999 : p.best);
export const byPopularity = (a: Product, b: Product) => Number(available(b)) - Number(available(a)) || rank(a) - rank(b) || discount(b) - discount(a) || b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
export const popular = [...products].sort(byPopularity);
export const bestsellers = popular.filter((p) => p.best >= 0 && available(p));
export const newest = [...products].filter(available).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
export const deals = [...products].filter((p) => available(p) && onSale(p)).sort((a, b) => discount(b) - discount(a) || rank(a) - rank(b));

/** The colour of each world: peach skin care, rose make-up, mint hair. */
export const TONE: Record<string, { bg: string; soft: string; text: string; g1: string; g2: string }> = {
  skin: { bg: "bg-peach", soft: "bg-peach-l", text: "text-peach-d", g1: "#ffc9ad", g2: "#ffe0a8" },
  makeup: { bg: "bg-rose", soft: "bg-rose-l", text: "text-rose-d", g1: "#f9b4c8", g2: "#d9c6ff" },
  hair: { bg: "bg-mint", soft: "bg-mint-l", text: "text-mint-d", g1: "#a8e6d4", g2: "#cfe9ff" },
};

/** A simple skin routine with the shop's own shelves, for people who do not know where to start. */
export const ROUTINE = [
  { n: 1, sub: "Цэвэрлэгээ", title: "Цэвэрлэх", line: "Өглөө, орой: угаагч хөөс, гель" },
  { n: 2, sub: "Тонер, серум", title: "Тонер, серум", line: "Арьсаа бэлдэж, идэвхтэй найрлагаа шингээнэ" },
  { n: 3, sub: "Тос, крем", title: "Чийгшүүлэх", line: "Тос, крем, капсул тос" },
  { n: 4, sub: "Нарны тос", title: "Хамгаалах", line: "Өдөр бүр, өвөл ч гэсэн" },
  { n: 5, sub: "Маск", title: "Долоо хоногт 1–2 удаа", line: "Даавуун, шаварлаг, унтлагын маск" },
] as const;
