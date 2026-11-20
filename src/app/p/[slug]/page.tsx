import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { ChatIcon, ClockIcon, QrIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { ProductBuy } from "@/components/product-buy";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, byPopularity, fromPrice, getBrand, getConcern, getGroup, getProduct, products, sku, TONE, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** The shop's first line is often the product's English name («Sinko Styling – Curly Defining Cream 300ml»). */
const latinName = (p: Product) => (p.lines[0] && /^[\x20-\x7e–’]+$/.test(p.lines[0]) && p.lines[0].length < 90 ? p.lines[0] : null);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const brand = getBrand(p.brand);
  const text = p.lines.filter((l) => l !== latinName(p) && l.length > 20)[0];
  const description = [brand?.name, text].filter(Boolean).join(": ").slice(0, 160) || `${p.title}: ${getGroup(p.group)?.name}`;
  const title = brand && !p.title.toLowerCase().includes(brand.name.toLowerCase()) ? `${p.title} · ${brand.name}` : p.title;
  return { title, description, alternates: { canonical: `/p/${p.slug}` }, openGraph: { title, description, images: p.images[0] ? [{ url: p.images[0].src }] : undefined } };
}

const HEAD = /^(найрлага|найрлагын онцлог|гол найрлага|үйлчилгээ|үйлчилгээ, давуу тал|давуу тал|онцлог|хэрэглэх заавар|хэрэглэх арга|хэрэглэх нь|анхааруулга|анхаарах|тохиромжтой|хэнд тохиромжтой|арьсны төрөл|хадгалах)/i;

/** The shop's text: a short line ending in «:» (or a known heading word) starts a block; short lines become a list. */
function Story({ lines }: { lines: string[] }) {
  const blocks: { h: string | null; items: string[] }[] = [{ h: null, items: [] }];
  for (const l of lines) {
    const m = l.match(/^(.{3,40}?):\s*(.+)$/);
    if (m && HEAD.test(m[1])) blocks.push({ h: m[1], items: [m[2]] });
    else if ((/:$/.test(l) && l.length < 50) || (HEAD.test(l) && l.length < 40)) blocks.push({ h: l.replace(/:$/, ""), items: [] });
    else blocks.at(-1)!.items.push(l);
  }
  return (
    <div className="space-y-6">
      {blocks
        .filter((b) => b.h || b.items.length)
        .map((b, i) => (
          <div key={i}>
            {b.h && <h3 className="text-[17px] font-bold tracking-tight">{b.h}</h3>}
            {b.items.length > 0 &&
              (b.items.length > 1 && b.items.every((x) => x.length < 140) ? (
                <ul className="mt-2.5 space-y-2">
                  {b.items.map((x) => (
                    <li key={x} className="flex gap-3 text-[15px] text-ink-2">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {x.replace(/^\d+[.)]\s*/, "")}
                    </li>
                  ))}
                </ul>
              ) : (
                b.items.map((x) => (
                  <p key={x} className="mt-2 text-[15px] text-ink-2">
                    {x}
                  </p>
                ))
              ))}
          </div>
        ))}
    </div>
  );
}

function related(p: Product) {
  const pool = products.filter((x) => x.id !== p.id && available(x));
  const sameSub = pool.filter((x) => x.group === p.group && x.sub === p.sub);
  const sameBrand = pool.filter((x) => x.brand && x.brand === p.brand && !sameSub.includes(x));
  return [...sameSub.sort(byPopularity), ...sameBrand.sort(byPopularity)].slice(0, 12);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const rel = related(p);
  const brand = getBrand(p.brand);
  const group = getGroup(p.group);
  const tone = TONE[p.group] ?? TONE.skin;
  const latin = latinName(p);
  const story = p.lines.filter((l) => l !== latin);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    sku: sku(String(p.id)),
    image: p.images.slice(0, 3).map((i) => absoluteUrl(i.src)),
    description: story.slice(0, 3).join(" "),
    ...(brand ? { brand: { "@type": "Brand", name: brand.name } } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "MNT",
      price: fromPrice(p),
      availability: available(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/p/${p.slug}`),
    },
  };

  return (
    <div className="wrap pt-5 pb-28 md:pt-8 md:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Зам" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
        <Link href="/shop" className="hover:text-ink">
          Дэлгүүр
        </Link>
        <span>/</span>
        <Link href={`/shop?g=${p.group}`} className="hover:text-ink">
          {group?.name}
        </Link>
        <span>/</span>
        <Link href={`/shop?g=${p.group}&s=${encodeURIComponent(p.sub)}`} className="hover:text-ink">
          {p.sub}
        </Link>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-[180px] lg:self-start">
          <Gallery photos={p.images} title={p.title} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            {brand && (
              <Link href={`/shop?b=${brand.id}`} className={`tag ${tone.soft} ${tone.text} hover:underline`}>
                {brand.name}
                {brand.origin ? ` · ${brand.origin}` : ""}
              </Link>
            )}
            {!available(p) && <span className="tag bg-sand text-ink-2">Дууссан</span>}
            {p.best >= 0 && p.best < 10 && <span className="tag bg-gold-l text-ink">★ Их борлуулалттай</span>}
          </div>
          <h1 className="mt-3 text-[32px] md:text-[46px]">{p.title}</h1>
          {latin && <p className="mt-2 text-[15px] text-ink-3">{latin}</p>}

          <ProductBuy slug={p.slug} title={p.title} options={p.options} variants={p.variants} />

          {p.concerns.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-[13.5px] text-ink-3">Зорилго:</span>
              {p.concerns.map((c) => (
                <Link key={c} href={`/shop?g=skin&c=${c}`} className="tag bg-lilac-l py-1 text-[13px] text-lilac-d hover:underline">
                  {getConcern(c)?.name}
                </Link>
              ))}
            </div>
          )}

          {p.options.some((o) => o.title === "Өнгө" || o.title === "Номер") && (
            <p className="mt-6 flex gap-3 rounded-[20px] bg-rose-l p-4 text-[14px] text-ink-2">
              <ChatIcon size={19} className="mt-0.5 shrink-0 text-rose-d" />
              <span>
                <b className="text-ink">Өнгөө сайн шалгаарай.</b> Захиалсан бараанд буцаалт хийхгүй тул эргэлзвэл салбар дээр тестерээр туршиж эсвэл{" "}
                <a href={`tel:${business.phone.tel}`} className="font-semibold text-ink underline underline-offset-4">
                  {business.phone.display}
                </a>{" "}
                дугаараар зөвлөгөө аваарай.
              </span>
            </p>
          )}

          {story.length > 0 && (
            <section className="mt-8 border-t border-line pt-7" aria-label="Тайлбар">
              <Story lines={story} />
            </section>
          )}

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {[
              { Icon: TruckIcon, t: `${business.zone.name}: ${formatPrice(business.zone.price)}`, d: business.rules.noCamp },
              { Icon: ClockIcon, t: "24–72 цагт хүргэнэ", d: "Захиалга баталгаажсаны дараа" },
              { Icon: QrIcon, t: "QPay, 100% урьдчилж", d: "И-баримт erxes-ээс албан ёсоор" },
              { Icon: ShieldIcon, t: "Албан ёсны борлуулагч", d: business.promise.join(", ") },
            ].map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-3 rounded-[20px] bg-sand p-4">
                <Icon size={20} className="mt-0.5 shrink-0 text-gold" />
                <span className="text-[13.5px] text-ink-2">
                  <b className="block text-[14.5px] font-semibold text-ink">{t}</b>
                  {d}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-ink-3">Код: {sku(String(p.id))}</p>
        </div>
      </div>

      {rel.length > 0 && (
        <section className="mt-20" aria-labelledby="rel">
          <h2 id="rel" className="text-[28px] md:text-[38px]">
            Үүнтэй <span className="it text-rose-d">хамт</span> үзээрэй
          </h2>
          <Scroller label="Төстэй бараа" className="snap-row no-scrollbar -mx-4 mt-6 px-4 pb-2 md:mx-0 md:px-0">
            {rel.map((x) => (
              <div key={x.id} className="w-[46vw] max-w-[260px] sm:w-[230px]">
                <ProductCard p={x} />
              </div>
            ))}
          </Scroller>
        </section>
      )}
    </div>
  );
}
