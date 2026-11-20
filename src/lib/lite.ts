import data from "@/data/lite.json";

/** One per buyable variant: i key, s slug, n title, z option label, p price, o compareAt, k stock (null = not counted), t thumb. */
export type LiteVariant = { i: string; s: string; n: string; z: string | null; p: number; o: number | null; k: number | null; t: string | null };
/** One per product: s slug, n title, b brand, g group, p lowest price, a available, t thumb, v variant key (when there is nothing to choose). */
export type LiteProduct = { s: string; n: string; b: string | null; g: string; p: number; a: 0 | 1; t: string | null; v: string | null };

export const liteVariants = data.v as LiteVariant[];
export const liteProducts = data.p as LiteProduct[];
const byId = new Map(liteVariants.map((v) => [v.i, v]));
export const getLiteVariant = (id: string) => byId.get(id);
export const isSoldOut = (v: Pick<LiteVariant, "k">) => v.k === 0;
