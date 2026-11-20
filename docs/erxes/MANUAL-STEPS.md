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

## 1.2 Payment (QPay)

Zochil rule, word for word: «Захиалсан бараа бүтээгдэхүүний төлбөрийг 100% төлж баталгаажуулна.» Zochil has QPay on,
but its QPay, Pocket and LendPay checkout methods all show `checkout_status: disabled`. The website:

- records the order in erxes first, then creates a QPay invoice with the erxes payment plugin (`generateInvoiceUrl`,
  public). The customer pays on the erxes payment page and returns to `/order/<reference>`, which asks `invoicesCheck`
  every 5 s.
- never asks for money for an order staff cannot see. Credit (Lend.mn, Pocketzero, 6 instalments) is described on
  /info as available in the branches; it is not offered online.

Steps:

1. Get the shop's own QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`) (open question 3).
2. **Settings → Payments → Add → QPay (v2)**: enter them. Make a 100₮ test invoice in erxes.
3. Copy the payment method's `_id` into Vercel as `ERXES_PAYMENT_IDS`.
4. **Not yet tested** against a real QPay merchant. Do not call payments working until step 2 and 1.5 pass.

## 1.3 eBarimt

The website never makes a receipt. The checkout asks «Хувь хүн» or «Байгууллага» (7-digit registry number, checked on
the server) and writes it on the order. The receipt is issued in erxes by staff after payment.

1. Collect from the shop: company or person name and TIN (Zochil `regno` is empty), district code, VAT status,
   product classification codes (cosmetics).
2. Register for **PosAPI 3.0** (ebarimt.mn) and install the PosAPI service.
3. **Settings → eBarimt**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline.
4. For every paid order: issue the receipt once (goods + delivery fee) and send the lottery number.

## 1.4 Delivery zones, fees and order statuses

Website (done), from the Zochil delivery option, delivery rule, FAQ and terms:

| Zochil | Website |
| --- | --- |
| Checkout option «Улаанбаатар / Үндсэн хүргэлт», **8,000₮**, no free limit (`price_limit` 0) | 8,000₮ on every order |
| Delivery rule: «24-72цагын дотор … Хот дотор **7000₮** … Зуслан лагерлуу хүргэлт хийгдэхгүй» | 24–72 h and «no camps» shown everywhere; the rule text is shown word for word on /info |
| FAQ: «УБ хот дотор **5000₮** … 24-48цагийн дотор» | FAQ shown word for word on /info |
| Countryside switch on, but no option or fee | not offered online; the site asks to call 8602-1100 first (open question 2) |
| Terms (agreement required): check colour and type, no returns | required checkbox at checkout; colour note on shade products; /info |

**The three fees disagree (8,000 / 7,000 / 5,000₮).** The website charges what the Zochil checkout charged (8,000₮).
Change it in `src/content/business.ts` (it reads `catalog.shop.zone`) and in the erxes delivery product once the shop
confirms (open question 1).

erxes:

1. Import `docs/erxes/qncosmetics-delivery.csv` (`QN-DELIVERY-UB` 8,000₮).
2. **Sales → Boards → «Онлайн захиалга» → pipeline «Вэбсайт»**, stages (as on the website):
   Төлбөр хүлээгдэж байна → Баталгаажсан → Бэлдэж байна → Хүргэлтэд гарсан → Хүргэгдсэн, plus Цуцлагдсан.
3. **Frontline → Forms → (order form) → Settings**: create a sales card in «Төлбөр хүлээгдэж байна» for every
   submission. Staff move it to «Баталгаажсан» when the QPay invoice shows paid.
4. SMS: Zochil has two order SMS templates (registered / confirmed). Recreate them in erxes (Automations → SMS).
