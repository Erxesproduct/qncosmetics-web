# Qn cosmetics web store (Dr.Rashel & Estelin Mongolia)

Next.js 16 storefront that replaces the Zochil shop at qncosmetics.mn: Dr.Rashel and Estelin skin care (Dubai),
Phoera, Imagic, Gabrini and Beauty Glazed make-up, Sinko hair care (Australia), from the official Mongolian distributor.

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (no erxes needed)
npm run export:erxes   # docs/erxes/qncosmetics-*.csv for the erxes product import
```

- Catalog: `src/data/catalog.json` (+ `lite.json` for the cart and search), built from Zochil shop 7735 on 2026-11-20.
  Photos in `public/img/<hash>.webp`, the shop's banners and brand logos in `public/brand/`.
- Business rules (Ulaanbaatar 8,000₮, 24–72 h, no summer camps, QPay 100% before confirmation, no returns, 7 branches,
  FAQ): `src/content/business.ts`.
- Orders go to erxes (form submission → Sales card), QPay through the erxes payment plugin. Until the `ERXES_*`
  variables (`.env.example`) are set, `/api/orders` answers `503 not_configured` and the checkout shows the phone.
- Manual erxes steps and open questions: `docs/erxes/MANUAL-STEPS.md`.

Look «Glow Edit» (2026): no single brand colour. Peach for skin care, rose for make-up, mint for hair, lilac for skin
concerns, on warm cream with espresso and the Dr.Rashel / Estelin gold. Big tight Onest headlines with one Cormorant
italic word (both have Ө/Ү), bento hero, moving brand strip, soft colour blobs. Pages: home (bento, three worlds,
bestsellers, 5-step routine, skin concerns, sale, brands, branches), shop (group, brand, shelf, concern, sale, search,
sort, pages), product (shade chips, sale price, colour note), instant search, cart / checkout, order status, saved
items, info (delivery, payment, terms, wholesale, branches, FAQ).
