import Image from "next/image";
import Link from "next/link";
import { Spark } from "@/components/brand";
import { ArrowIcon, PinIcon, ShieldIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Scroller } from "@/components/scroller";
import { Search } from "@/components/search";
import { BRANCHES, business } from "@/content/business";
import { bestsellers, brands, concerns, deals, discount, groups, popular, products, ROUTINE, TONE, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

/** The shop's own brand logos (Zochil brand pages); the others get a wordmark. */
const LOGOS: Record<string, string> = { "dr-rashel": "/brand/brand-4345.webp", estelin: "/brand/brand-4346.webp", "beauty-glazed": "/brand/brand-4820.webp", gabrini: "/brand/brand-5073.webp" };
const GROUP_ART: Record<string, { src: string; pos: string }> = {
  skin: { src: "/brand/hero-skin.webp", pos: "object-[50%_20%]" },
  hair: { src: "/brand/sinko.webp", pos: "object-center" },
};

function Shelf({ id, title, accent, line, href, items, tone = "text-rose-d" }: { id: string; title: string; accent: string; line?: string; href: string; items: Product[]; tone?: string }) {
  if (!items.length) return null;
  return (
    <Reveal as="section" className="wrap mt-20 md:mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={id} className="text-[30px] md:text-[44px]">
            {title} <span className={`it ${tone}`}>{accent}</span>
          </h2>
          {line && <p className="mt-2 text-ink-2">{line}</p>}
        </div>
        <Link href={href} className="inline-flex items-center gap-1.5 text-[15px] font-semibold hover:underline">
          Бүгдийг үзэх <ArrowIcon size={16} />
        </Link>
      </div>
      <Scroller label={`${title} ${accent}`} className="snap-row no-scrollbar -mx-4 mt-6 px-4 pb-2 md:mx-0 md:px-0">
        {items.map((p) => (
          <div key={p.id} className="w-[46vw] max-w-[270px] sm:w-[240px]">
            <ProductCard p={p} />
          </div>
        ))}
      </Scroller>
    </Reveal>
  );
}

export default function Home() {
  const maxOff = Math.max(...deals.map(discount));
  const makeup = popular.filter((p) => p.group === "makeup" && (p.sub === "Уруул" || p.sub === "Нүүр"));
  const hair = popular.filter((p) => p.group === "hair");
  const routineCount = (sub: string) => products.filter((p) => p.group === "skin" && p.sub === sub).length;

  return (
    <>
      {/* Hero: a bento of the three worlds, with search in the middle of it */}
      <section className="wrap pt-5 md:pt-8">
        <div className="grid gap-3 md:grid-cols-12 md:gap-4">
          <div className="glow relative overflow-hidden rounded-[32px] bg-white p-6 ring-1 ring-line [--g1:#ffcfb8] [--g2:#f7bdd2] sm:p-8 md:col-span-7 md:row-span-2 md:p-12">
            <p className="eyebrow">Албан ёсны Монгол дахь борлуулагч</p>
            <h1 className="mt-4 text-[42px] leading-[0.98] sm:text-[56px] lg:text-[76px]">
              Арьсаа <span className="it text-peach-d">арчил</span>, өнгөө <span className="it text-rose-d">ол</span>.
            </h1>
            <p className="mt-5 max-w-lg text-[16.5px] text-ink-2">
              Дубайн Dr.Rashel, Estelin арьс арчилгаа, Америкийн Phoera, Imagic будалт, Австралийн Sinko үс арчилгаа. {products.length} бараа, {brands.length} брэнд, нэг дороос.
            </p>
            <Search className="mt-7 max-w-lg" />
            <div className="mt-5 flex flex-wrap gap-2">
              {business.promise.map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-[13px] font-medium">
                  <Spark className="h-3 w-3 text-gold" /> {p}
                </span>
              ))}
            </div>
          </div>

          <Link href="/shop?g=skin" className="group relative min-h-[240px] overflow-hidden rounded-[32px] bg-peach-l md:col-span-5 md:min-h-0">
            <Image src="/brand/hero-skin.webp" alt="Dr.Rashel арьс арчилгаа" fill priority sizes="(min-width: 768px) 42vw, 100vw" className="object-cover object-[50%_15%] transition duration-700 group-hover:scale-[1.04]" />
            <span className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-ink/75 to-transparent" />
            <span className="absolute top-5 right-5 left-5 flex items-start justify-between gap-3 text-white">
              <span>
                <span className="block text-[13px] font-semibold text-gold-l">Dr.Rashel · Estelin · Дубай</span>
                <span className="block text-[26px] font-bold tracking-tight">Арьс арчилгаа</span>
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:translate-x-1">
                <ArrowIcon size={18} />
              </span>
            </span>
          </Link>

          <div className="grid grid-cols-2 gap-3 md:col-span-5 md:gap-4">
            <Link href="/shop?sale=1&sort=sale" className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[28px] bg-rose p-5 text-white">
              <Spark className="absolute -top-4 -right-4 h-24 w-24 text-white/15 transition duration-700 group-hover:rotate-45" />
              <span className="text-[13px] font-semibold text-white/85">{deals.length} бараа хямдарсан</span>
              <span>
                <span className="block text-[44px] leading-none font-bold tracking-tight">−{maxOff}%</span>
                <span className="mt-1 block text-[15px] font-semibold">хүртэл хямдрал →</span>
              </span>
            </Link>
            <Link href="/shop?g=hair" className="group relative min-h-[180px] overflow-hidden rounded-[28px] bg-mint-l">
              <Image src="/brand/sinko.webp" alt="Sinko үс арчилгаа" fill sizes="(min-width: 768px) 20vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.05]" />
              <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-mint-d/85 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white">
                <span className="block text-[12px] font-semibold text-white/85">Sinko · Австрали</span>
                <span className="block text-[19px] font-bold tracking-tight">Үс арчилгаа</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <section aria-label="Брэндүүд" className="mt-10 overflow-hidden border-y border-line bg-white py-4 md:mt-14">
        <div className="marquee flex w-max gap-12 pr-12">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-12" aria-hidden={k === 1}>
              {brands.map((b) => (
                <Link key={b.id} href={`/shop?b=${b.id}`} tabIndex={k === 1 ? -1 : undefined} className="flex items-center gap-3 text-[22px] font-bold tracking-tight whitespace-nowrap text-ink/80 hover:text-ink md:text-[26px]">
                  <Spark className={`h-4 w-4 ${TONE[b.group].text}`} />
                  {b.name}
                  {b.origin && <span className="it text-[18px] font-medium text-ink-3">{b.origin}</span>}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Three worlds */}
      <section className="wrap mt-16 md:mt-24" aria-labelledby="worlds">
        <Reveal>
          <p className="eyebrow">Юу хайж байна?</p>
          <h2 id="worlds" className="mt-3 text-[32px] md:text-[48px]">
            Гурван <span className="it text-gold">ертөнц</span>, нэг дэлгүүр
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {groups.map((g, i) => {
            const t = TONE[g.id];
            const art = GROUP_ART[g.id];
            return (
              <Reveal key={g.id} delay={i * 90} className={`glow flex flex-col overflow-hidden rounded-[30px] ${t.soft}`}>
                <div style={{ ["--g1" as string]: t.g1, ["--g2" as string]: t.g2 }} className="flex h-full flex-col">
                  <Link href={`/shop?g=${g.id}`} className="group relative block aspect-[16/9] overflow-hidden">
                    {art ? (
                      <Image src={art.src} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className={`object-cover ${art.pos} transition duration-700 group-hover:scale-[1.04]`} />
                    ) : (
                      <span className="grid h-full grid-cols-3 gap-1.5 p-1.5">
                        {popular
                          .filter((p) => p.group === g.id && p.images[0])
                          .slice(0, 3)
                          .map((p) => (
                            <span key={p.id} className="relative overflow-hidden rounded-[20px] bg-white">
                              <Image src={p.images[0].thumb.src} alt="" fill sizes="160px" className="object-cover transition duration-700 group-hover:scale-[1.06]" />
                            </span>
                          ))}
                      </span>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <p className={`text-[13px] font-semibold ${t.text}`}>{g.count} бараа</p>
                    <h3 className="mt-1 text-[28px]">{g.name}</h3>
                    <p className="mt-1 text-[14.5px] text-ink-2">{g.line}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {g.subs
                        .filter((s) => s.name !== "Бусад")
                        .slice(0, 6)
                        .map((s) => (
                          <Link key={s.name} href={`/shop?g=${g.id}&s=${encodeURIComponent(s.name)}`} className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-ink-2 transition hover:bg-ink hover:text-white">
                            {s.name}
                          </Link>
                        ))}
                    </div>
                    <Link href={`/shop?g=${g.id}`} className="btn btn-ink mt-6 self-start">
                      {g.name} үзэх <ArrowIcon size={16} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Shelf id="best" title="Хамгийн их" accent="борлуулалттай" line="Дэлгүүрийн өөрийн шилдэг жагсаалтаас" href="/shop" items={bestsellers.slice(0, 12)} tone="text-gold" />

      {/* Routine */}
      <section id="routine" className="mt-20 scroll-mt-40 md:mt-28" aria-labelledby="routine-h">
        <div className="wrap">
          <Reveal className="glow overflow-hidden rounded-[36px] bg-peach-l p-6 [--g1:#ffbf9e] [--g2:#ffe2a6] md:p-12">
            <div className="grid gap-8">
              <div>
                <p className="eyebrow text-peach-d">Хаанаас эхлэхээ мэдэхгүй байна уу?</p>
                <h2 id="routine-h" className="mt-3 text-[34px] md:text-[50px]">
                  Арчилгааны <span className="it text-peach-d">5 алхам</span>
                </h2>
                <p className="mt-4 max-w-md text-[16px] text-ink-2">Арьс арчилгааны энгийн дараалал. Алхам бүр дээр дарж тухайн тавиурын бараагаа сонгоорой.</p>
              </div>
              <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {ROUTINE.map((r) => (
                  <li key={r.n}>
                    <Link href={`/shop?g=skin&s=${encodeURIComponent(r.sub)}`} className="group flex h-full flex-col rounded-[24px] bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgb(181_83_42/0.6)]">
                      <span className="it text-[44px] leading-none text-peach">{r.n}</span>
                      <b className="mt-3 block text-[16px] leading-tight font-bold">{r.title}</b>
                      <span className="mt-1.5 block flex-1 text-[13px] leading-snug text-ink-2">{r.line}</span>
                      <span className="mt-3 text-[12.5px] font-semibold text-peach-d group-hover:underline">{routineCount(r.sub)} бараа →</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Concerns */}
      <Reveal as="section" className="wrap mt-16 md:mt-20">
        <div className="flex flex-col gap-5 rounded-[32px] bg-lilac-l p-6 md:flex-row md:items-center md:p-10">
          <div className="md:w-[38%]">
            <h2 className="text-[28px] md:text-[38px]">
              Арьсны <span className="it text-lilac-d">асуудлаар</span> сонгох
            </h2>
            <p className="mt-2 text-[14.5px] text-ink-2">Бүтээгдэхүүний нэр, найрлагад тухайн зорилго бичигдсэнээр нь ангилсан.</p>
          </div>
          <div className="flex flex-1 flex-wrap gap-2.5">
            {concerns.map((c) => (
              <Link key={c.id} href={`/shop?g=skin&c=${c.id}`} className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[16px] font-semibold transition hover:bg-lilac-d hover:text-white">
                {c.name}
                <span className="rounded-full bg-lilac-l px-2 py-0.5 text-[12px] text-lilac-d group-hover:bg-white/20 group-hover:text-white">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      <Shelf id="deals" title="Хямдралтай" accent="бараа" line={`${deals.length} бараа хямдарсан, хамгийн их нь −${maxOff}%`} href="/shop?sale=1&sort=sale" items={deals.slice(0, 12)} />

      {/* Brands */}
      <section id="brands" className="wrap mt-20 scroll-mt-40 md:mt-28" aria-labelledby="brands-h">
        <Reveal>
          <h2 id="brands-h" className="text-[30px] md:text-[44px]">
            Манай <span className="it text-gold">брэндүүд</span>
          </h2>
          <p className="mt-2 max-w-2xl text-ink-2">Бүгдийг албан ёсны эрхтэйгээр оруулж ирдэг. Брэнд дээр дарж бүх барааг нь үзээрэй.</p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {brands.map((b, i) => {
            const t = TONE[b.group];
            return (
              <Reveal key={b.id} delay={(i % 4) * 70}>
                <Link href={`/shop?b=${b.id}`} className="group flex h-full flex-col overflow-hidden rounded-[26px] bg-white ring-1 ring-line transition hover:-translate-y-1 hover:ring-ink">
                  <span className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-[#140f0d]">
                    {LOGOS[b.id] ? (
                      <Image src={LOGOS[b.id]} alt={b.name} fill sizes="(min-width: 1024px) 300px, 50vw" className="object-contain p-4 transition duration-500 group-hover:scale-105" />
                    ) : (
                      <span className="px-3 text-center text-[24px] font-bold tracking-[0.08em] text-gold-l uppercase md:text-[28px]">{b.name}</span>
                    )}
                  </span>
                  <span className="flex flex-1 flex-col p-4">
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-3">
                      <span className={`h-1.5 w-1.5 rounded-full ${t.bg}`} />
                      {b.origin ?? "Нүүр будалт"} · {b.count} бараа
                    </span>
                    <span className="mt-1 text-[17px] font-bold tracking-tight">{b.name}</span>
                    <span className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-ink-2">{b.line}</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
          <Reveal delay={210}>
            <Link href="/info#wholesale" className="flex h-full min-h-[200px] flex-col justify-between rounded-[26px] bg-ink p-5 text-white transition hover:-translate-y-1">
              <ShieldIcon size={26} className="text-gold-l" />
              <span>
                <span className="block text-[18px] font-bold tracking-tight">Бөөний худалдаа</span>
                <span className="mt-1 block text-[13px] text-white/70">Гоо сайхны худалдаа эрхлэгчидтэй хамтран ажиллана: {business.phone.display}</span>
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <Shelf id="makeup" title="Уруул ба" accent="нүүрний будалт" href="/shop?g=makeup" items={makeup.slice(0, 12)} />
      <Shelf id="hair" title="Sinko" accent="үс арчилгаа" line="Сульфат, парабен, силикон агуулаагүй" href="/shop?g=hair" items={hair.slice(0, 12)} tone="text-mint-d" />

      {/* Branches */}
      <Reveal as="section" className="wrap mt-20 md:mt-28">
        <div className="grid overflow-hidden rounded-[36px] bg-ink text-white lg:grid-cols-2">
          <div className="relative min-h-[260px]">
            <Image src="/brand/store.webp" alt="Dr.Rashel Mongolia гоо сайхны дэлгүүр" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="p-7 md:p-12">
            <p className="eyebrow text-gold-l">Тестерээр туршаад аваарай</p>
            <h2 className="mt-3 text-[32px] md:text-[46px]">
              {BRANCHES.length} салбар, <span className="it text-gold-l">{business.hours.replace("Бүх салбар ", "")}</span>
            </h2>
            <ul className="mt-6 grid gap-2 text-[14.5px] text-white/80">
              {BRANCHES.slice(0, 5).map((b) => (
                <li key={b.name} className="flex gap-2.5">
                  <PinIcon size={17} className="mt-0.5 shrink-0 text-gold-l" />
                  <span>{b.place}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/info#branches" className="btn btn-gold">
                Бүх салбар
              </Link>
              <a href={`tel:${business.phone.tel}`} className="btn bg-white/10 text-white hover:bg-white/15">
                {business.phone.display}
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="wrap mt-16 grid gap-3 sm:grid-cols-3">
        {[
          { k: "Хүргэлт", v: `${formatPrice(business.zone.price)}, 24–72 цаг`, d: "Улаанбаатар хот дотор" },
          { k: "Төлбөр", v: "QPay", d: "Аль ч банкны аппаар" },
          { k: "И-баримт", v: "Хувь хүн, байгууллага", d: "Төлбөр баталгаажсаны дараа" },
        ].map((x) => (
          <div key={x.k} className="rounded-[24px] bg-white p-5 ring-1 ring-line">
            <p className="text-[13px] font-semibold text-ink-3">{x.k}</p>
            <p className="mt-1 text-[20px] font-bold tracking-tight">{x.v}</p>
            <p className="text-[14px] text-ink-2">{x.d}</p>
          </div>
        ))}
      </Reveal>
    </>
  );
}
