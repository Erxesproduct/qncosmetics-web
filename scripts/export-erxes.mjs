// node scripts/export-erxes.mjs → docs/erxes/qncosmetics-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `QN-${id.toUpperCase()}`;

// categories: QN → the three worlds (skin, makeup, hair) → their shelves, plus delivery. Brands are a product field.
const cats = [["code", "name", "parent code"], ["QN", "Qn cosmetics", ""]];
for (const g of c.groups) {
  cats.push([code(g.id), g.name, "QN"]);
  for (const [i, s] of g.subs.entries()) cats.push([`${code(g.id)}-${i + 1}`, s.name, code(g.id)]);
}
cats.push(["QN-DELIVERY", "Хүргэлт", "QN"]);
writeFileSync(path.join(out, "qncosmetics-categories.csv"), csv(cats));

const brandName = (id) => c.brands.find((b) => b.id === id)?.name ?? "";
const subCode = (p) => {
  const g = c.groups.find((x) => x.id === p.group);
  const i = (g?.subs ?? []).findIndex((s) => s.name === p.sub);
  return i >= 0 ? `${code(p.group)}-${i + 1}` : code(p.group);
};
const rows = [["code", "name", "category code", "type", "unit price", "price before sale", "brand", "options", "stock (Zochil)", "zochil product id", "image (website path)"]];
for (const p of c.products)
  for (const v of p.variants)
    rows.push([
      `QN-${v.id}`,
      [p.title, v.label].filter(Boolean).join(" · ").slice(0, 200),
      subCode(p),
      "product",
      v.price,
      v.compareAt ?? "",
      brandName(p.brand),
      Object.entries(v.opts ?? {}).map(([k, x]) => `${k}=${x}`).join("; "),
      v.stock ?? "",
      p.id,
      p.images[0]?.src ?? "",
    ]);
writeFileSync(path.join(out, "qncosmetics-products.csv"), csv(rows));

// the shop's one Zochil delivery option
const z = c.shop.zone;
writeFileSync(
  path.join(out, "qncosmetics-delivery.csv"),
  csv([
    ["code", "name", "category code", "type", "unit price", "source"],
    ["QN-DELIVERY-UB", `Хүргэлт: ${z.title} (${z.description})`, "QN-DELIVERY", "service", z.price, "Zochil checkout delivery option (no free-delivery limit). The FAQ says 5,000₮ and the delivery rule 7,000₮: owner to confirm."],
  ]),
);
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery 1`);
