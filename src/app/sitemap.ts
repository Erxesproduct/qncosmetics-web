import type { MetadataRoute } from "next";
import { brands, catalogInfo, groups, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(catalogInfo.updatedAt);
  const page = (path: string, priority: number) => ({ url: absoluteUrl(path), lastModified, priority });
  return [
    page("/", 1),
    page("/shop", 0.9),
    page("/info", 0.6),
    ...groups.map((g) => page(`/shop?g=${g.id}`, 0.8)),
    ...brands.map((b) => page(`/shop?b=${b.id}`, 0.7)),
    ...products.map((p) => page(`/p/${p.slug}`, 0.8)),
  ];
}
