import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Old Zochil URLs keep working: /products/<categoryId|null>/<productId> → /p/<slug>, /products/<categoryId> → /shop?….
const catalog = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "catalog.json"), "utf8")) as { products: { id: number; slug: string }[]; categoryRedirects: Record<string, string> };
const productRedirects = catalog.products.map((p) => ({ source: `/products/:category/${p.id}`, destination: `/p/${p.slug}`, permanent: true }));
const categoryRedirects = Object.entries(catalog.categoryRedirects).map(([id, destination]) => ({ source: `/products/${id}`, destination, permanent: true }));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Photos are pre-sized WebP (480 px thumbs, up to 1000 px large, stored by content hash), so they are served as-is.
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: true },
      ...productRedirects,
      ...categoryRedirects,
      { source: "/products/:category(\\d+|null)", destination: "/shop", permanent: false },
      { source: "/category/:path*", destination: "/shop", permanent: false },
      { source: "/saled-products", destination: "/shop?sale=1", permanent: true },
      { source: "/brands/:path*", destination: "/shop#brands", permanent: false },
      { source: "/posts/:path*", destination: "/", permanent: false },
      { source: "/shopping-cart", destination: "/cart", permanent: true },
      { source: "/checkout", destination: "/cart", permanent: true },
      { source: "/about", destination: "/info", permanent: true },
      { source: "/faq", destination: "/info#faq", permanent: true },
      { source: "/terms", destination: "/info#terms", permanent: true },
      { source: "/contact", destination: "/info", permanent: true },
      { source: "/wishlist", destination: "/hearts", permanent: true },
      { source: "/accounts/:path*", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/img/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
