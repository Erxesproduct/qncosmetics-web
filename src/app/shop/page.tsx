import type { Metadata } from "next";
import Link from "next/link";
import { Spark } from "@/components/brand";
import { CloseIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { available, brands, byPopularity, concerns, discount, fromPrice, getBrand, getConcern, groups, onSale, popular, TONE } from "@/lib/catalog";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const PER_PAGE = 48;
const SORTS = [
  { id: "", name: "Эрэлттэй" },
  { id: "new", name: "Шинэ" },
  { id: "sale", name: "Хямдрал их" },
  { id: "low", name: "Үнэ ↑" },
  { id: "high", name: "Үнэ ↓" },
];

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const g = groups.find((x) => x.id === one(sp.g));
  const b = getBrand(one(sp.b) || null);
  const title = b ? `${b.name}${b.origin ? ` (${b.origin})` : ""}` : g ? g.name : "Бүх бараа";
  const canonical = b ? `/shop?b=${b.id}` : g ? `/shop?g=${g.id}` : "/shop";
  return { title, description: b ? b.line : g ? g.line : "Dr.Rashel, Estelin, Sinko, Phoera, Imagic, Gabrini, Beauty Glazed: албан ёсны борлуулагчаас.", alternates: { canonical } };
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/[.\-]/g, " ").replace(/\s+/g, " ").trim();

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const f = { g: one(sp.g), s: one(sp.s), b: one(sp.b), c: one(sp.c), sale: one(sp.sale), q: one(sp.q).slice(0, 60), sort: one(sp.sort), page: one(sp.page) };
  const brand = getBrand(f.b || null);
  const group = groups.find((x) => x.id === (f.g || brand?.group));
  const concern = getConcern(f.c);

  let list = popular.filter((p) => {
    if (group && p.group !== group.id) return false;
    if (brand && p.brand !== brand.id) return false;
    if (f.s && p.sub !== f.s) return false;
    if (concern && !p.concerns.includes(concern.id)) return false;
    if (f.sale && !(onSale(p) && available(p))) return false;
    if (f.q) {
      const hay = norm(`${p.title} ${getBrand(p.brand)?.name ?? ""} ${p.sub} ${p.options.flatMap((o) => o.values).join(" ")}`);
      if (!norm(f.q).split(" ").every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const byAvail = (a: (typeof list)[number], b: (typeof list)[number]) => Number(available(b)) - Number(available(a));
  list =
    f.sort === "new"
      ? [...list].sort((a, b) => byAvail(a, b) || b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
      : f.sort === "sale"
        ? [...list].sort((a, b) => byAvail(a, b) || discount(b) - discount(a))
        : f.sort === "low"
          ? [...list].sort((a, b) => byAvail(a, b) || fromPrice(a) - fromPrice(b))
          : f.sort === "high"
            ? [...list].sort((a, b) => byAvail(a, b) || fromPrice(b) - fromPrice(a))
            : [...list].sort(byPopularity);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number.parseInt(f.page, 10) || 1));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const href = (patch: Partial<typeof f>) => {
    const next = { ...f, page: "", ...patch };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    const s = q.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const active = [f.s, f.b, f.c, f.sale, f.q].some(Boolean);
  const groupBrands = brands.filter((b) => !group || b.group === group.id);
  const tone = TONE[group?.id ?? "skin"];
  const title = brand ? brand.name : concern ? concern.name : group ? group.name : f.sale ? "Хямдралтай бараа" : f.q ? `«${f.q}»` : "Бүх бараа";
  const line = brand ? `${brand.origin ? `${brand.origin} · ` : ""}${brand.line}` : concern ? "Нэр, найрлагад нь энэ зорилго бичигдсэн арьс арчилгаа" : group?.line;

  return (
    <div className="pb-16">
      <section className={`glow overflow-hidden ${group ? tone.soft : "bg-sand"}`} style={{ ["--g1" as string]: tone.g1, ["--g2" as string]: tone.g2 }}>
        <div className="wrap pt-8 pb-8 md:pt-12 md:pb-10">
          <p className="eyebrow">{list.length} бараа</p>
          <h1 className="mt-2 text-[38px] md:text-[60px]">{title}</h1>
          {line && <p className="mt-2 max-w-2xl text-[16px] text-ink-2">{line}</p>}
        </div>
      </section>

      <div className="wrap">
        <div className="-mx-4 border-b border-line/60 bg-white px-4 py-3 md:mx-0 md:mt-5 md:rounded-[24px] md:border md:px-4">
          <Scroller small label="Ангилал" as="nav" className="no-scrollbar flex gap-2 overflow-x-auto">
            <Link href={href({ g: "", s: "", b: "", c: "" })} className="chip" aria-current={!group ? "true" : undefined}>
              Бүгд
            </Link>
            {groups.map((g) => (
              <Link key={g.id} href={href({ g: g.id, s: "", b: "", c: g.id === "skin" ? f.c : "" })} className="chip" aria-current={group?.id === g.id && !brand ? "true" : undefined}>
                <span className={`h-2 w-2 rounded-full ${TONE[g.id].bg}`} aria-hidden />
                {g.name} <span className="text-[12px] opacity-60">{g.count}</span>
              </Link>
            ))}
            <span className="mx-1 w-px shrink-0 bg-line" aria-hidden />
            <Link href={href({ sale: f.sale ? "" : "1" })} className="chip" aria-current={f.sale ? "true" : undefined}>
              % Хямдралтай
            </Link>
          </Scroller>

          <Scroller small label="Брэнд" className="no-scrollbar mt-2.5 flex items-center gap-1.5 overflow-x-auto">
            <span className="shrink-0 pr-1 text-[13px] text-ink-3">Брэнд</span>
            {groupBrands.map((b) => (
              <Link key={b.id} href={href({ b: f.b === b.id ? "" : b.id, g: f.b === b.id ? f.g : "", s: "" })} className="chip min-h-9 px-3 text-[13.5px]" aria-current={f.b === b.id ? "true" : undefined}>
                {b.name}
              </Link>
            ))}
          </Scroller>

          {group && group.subs.length > 1 && (
            <Scroller small label="Төрөл" className="no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto">
              <span className="shrink-0 pr-1 text-[13px] text-ink-3">Төрөл</span>
              {group.subs.map((s) => (
                <Link key={s.name} href={href({ s: f.s === s.name ? "" : s.name })} className="chip min-h-9 px-3 text-[13.5px]" aria-current={f.s === s.name ? "true" : undefined}>
                  {s.name}
                </Link>
              ))}
            </Scroller>
          )}

          {(!group || group.id === "skin") && (
            <Scroller small label="Арьсны асуудал" className="no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto">
              <span className="shrink-0 pr-1 text-[13px] text-ink-3">Асуудал</span>
              {concerns.map((c) => (
                <Link key={c.id} href={href({ c: f.c === c.id ? "" : c.id, g: f.c === c.id ? f.g : "skin", b: "" })} className="chip min-h-9 px-3 text-[13.5px]" aria-current={f.c === c.id ? "true" : undefined}>
                  {c.name}
                </Link>
              ))}
            </Scroller>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {f.q && (
              <Link href={href({ q: "" })} className="tag gap-1 bg-sand py-1.5 text-[13.5px] text-ink">
                «{f.q}» <CloseIcon size={13} />
              </Link>
            )}
            {active && (
              <Link href={href({ s: "", b: "", c: "", sale: "", q: "" })} className="text-[14px] font-semibold text-rose-d hover:underline">
                Шүүлтүүр арилгах
              </Link>
            )}
          </div>
          <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-sand p-1" role="group" aria-label="Эрэмбэ">
            {SORTS.map((s) => (
              <Link key={s.id} href={href({ sort: s.id })} aria-current={f.sort === s.id ? "true" : undefined} className={`shrink-0 rounded-full px-3 py-1.5 text-[13.5px] font-medium ${f.sort === s.id ? "bg-white shadow-sm" : "text-ink-2"}`}>
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        {shown.length ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {shown.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
            {pages > 1 && (
              <nav aria-label="Хуудас" className="mt-12 flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <Link key={n} href={href({ page: n === 1 ? "" : String(n) })} aria-current={n === page ? "page" : undefined} className={`grid h-11 min-w-11 place-items-center rounded-full px-3 font-semibold tabular-nums ${n === page ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:ring-ink"}`}>
                    {n}
                  </Link>
                ))}
              </nav>
            )}
          </>
        ) : (
          <div className="card mx-auto mt-10 max-w-lg p-10 text-center">
            <Spark className="mx-auto h-11 w-11 text-gold" />
            <p className="mt-5 text-[24px] font-bold tracking-tight">Энэ сонголтоор бараа олдсонгүй</p>
            <p className="mt-2 text-ink-2">Шүүлтүүрээ багасгаад үзээрэй, эсвэл 8602-1100 дугаарт залгаарай.</p>
            <Link href="/shop" className="btn btn-ink mt-6">
              Бүх бараа
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
