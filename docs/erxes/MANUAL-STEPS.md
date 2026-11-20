# Qn cosmetics (Dr.Rashel & Estelin Mongolia): erxes manual steps

Owner of every step below: **Terbish**, with the shop for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → qncosmetics-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for this shop yet ("erxes 3.0: NOT SET"). Create the workspace first.

> **Security warning.** The public Zochil shop API for qncosmetics.mn returns the shop's **Pocket client id / client
> secret / terminal id** and a **Facebook page token** to anyone who opens the site. They were never copied into this
> repository and were never used. Ask the shop to **rotate the Pocket credentials** (Pocket merchant portal) and the
> **Facebook page token**, and ask Zochil to stop exposing them.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 247 products, 479 shade / type variants, 3 groups, 23 shelves, 7 brands, MNT prices and 137 sale prices, 949 photos | import the CSVs (1.1) |
| [1.2] QPay | done: QPay invoice + status check through the erxes payment plugin | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: Ulaanbaatar 8,000₮ (the Zochil checkout option), 24–72 h, no summer camps, no-returns terms, status list | delivery product, pipeline stages; **confirm the fee** (1.4) |
| [1.5] Full journey test | validation verified (`npm run test:order`, 29 checks) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: qncosmetics.mn (Zochil shop 7735), read 2026-11-20: **247 enabled products**, **479 variants** (89 products
have shades, numbers or types), MNT prices 3,750₮–165,000₮, up to 8 photos per product, banners, the shop's brand
logos, FAQ, about text. Facebook page: Qn Beauty cosmetics.

- Groups follow what the shop sells (its own about text): **Арьс арчилгаа** (Dr.Rashel, Estelin, 96), **Нүүр будалт**
  (Phoera, Imagic, Gabrini, Beauty Glazed, 129), **Үс арчилгаа** (Sinko, 22). Shelves come from the shop's Zochil
  sub-categories, then from the product name (маск, тонер, уруул, сормуус…). Brand comes from the shop's brand
  categories (9 products have no brand on Zochil and are shown without one).
- Skin concerns (батга, гэрэлтүүлэх, чийгшүүлэх, үрчлээ, эмзэг арьс) are tagged only when the product name says so.
- Option titles: the shop sometimes typed the product name as the option title («Plump gloss», «Toner»); they are
  shown as Өнгө / Номер / Төрөл / Хэмжээ / Сүрчиг. The values are the shop's own.
- Sale prices: 137 products have a Zochil «before» price (up to −73%).
- Stock: Zochil counts stock on only 4 products (all at 0, shown sold out); the rest are not capped (open question 4).
- Old Zochil URLs (`/products/<category>/<id>`, brand categories, `/about`, `/faq`, …) redirect to the new pages.

Steps:

1. Run `npm run export:erxes` (already run; files in `docs/erxes/`).
2. **Products & Services → Categories → Import**: `qncosmetics-categories.csv` (QN → groups → shelves → QN-DELIVERY).
3. **Products & Services → Import**: `qncosmetics-products.csv`. One row per variant, code `QN-<productId>` or
   `QN-<productId>-<variantId>` (the same id the website sends with every order line), unit price and price before
   sale in MNT, brand.
4. Spot-check 10 products (price, shade) against qncosmetics.mn.
