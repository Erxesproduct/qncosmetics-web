import Image from "next/image";
import Link from "next/link";
import { available, choiceLabel, cover, discount, fromPrice, getBrand, second, singleVariant, TONE, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { CardActions } from "./card-actions";

export function ProductCard({ p }: { p: Product }) {
  const img = cover(p);
  const img2 = second(p);
  const out = !available(p);
  const off = discount(p);
  const price = fromPrice(p);
  const was = p.variants.find((v) => v.price === price)?.compareAt ?? null;
  const brand = getBrand(p.brand);
  const choices = choiceLabel(p);
  const tone = TONE[p.group] ?? TONE.skin;
  return (
    <article className="group relative flex flex-col">
      <Link href={`/p/${p.slug}`} className={`relative block aspect-square overflow-hidden rounded-[24px] ${tone.soft}`}>
        {img && (
          <Image
            src={img.src}
            alt={p.title}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition duration-700 group-hover:scale-[1.04] ${out ? "opacity-60 saturate-50" : ""} ${img2 ? "group-hover:opacity-0" : ""}`}
          />
        )}
        {img2 && <Image src={img2.src} alt="" fill sizes="(min-width: 1280px) 300px, 50vw" className="object-cover opacity-0 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100" />}
        <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {out ? (
            <span className="tag bg-white/95 text-ink-2">Дууссан</span>
          ) : (
            <>
              {off > 0 && <span className="tag bg-rose text-white">−{off}%</span>}
              {p.best >= 0 && p.best < 10 && <span className="tag bg-white/95 text-ink">★ Их борлуулалттай</span>}
            </>
          )}
        </span>
      </Link>
      <CardActions slug={p.slug} variantId={out ? null : singleVariant(p)} title={p.title} />
      <div className="mt-3 px-1">
        <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-3">
          <span className={`h-1.5 w-1.5 rounded-full ${tone.bg}`} aria-hidden />
          {brand?.name ?? p.sub}
          {choices && <span className="font-medium">· {choices}</span>}
        </p>
        <Link href={`/p/${p.slug}`} className="mt-1 line-clamp-2 text-[15px] leading-snug font-medium hover:underline hover:decoration-1 hover:underline-offset-2">
          {p.title}
        </Link>
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
          <span className={`text-[17px] font-bold tracking-tight tabular-nums ${off ? "text-rose-d" : ""}`}>
            {new Set(p.variants.map((v) => v.price)).size > 1 && <span className="mr-1 text-[12.5px] font-medium text-ink-3">–аас</span>}
            {formatPrice(price)}
          </span>
          {was && <s className="text-[13px] text-ink-3 tabular-nums">{formatPrice(was)}</s>}
        </p>
      </div>
    </article>
  );
}
