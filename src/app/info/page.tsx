import type { Metadata } from "next";
import Image from "next/image";
import { ChatIcon, ClockIcon, FacebookIcon, MailIcon, PhoneIcon, PinIcon, QrIcon, TruckIcon } from "@/components/icons";
import { BRANCHES, business, COUNTRYSIDE_BRANCHES, faq, ORDER_STATUSES } from "@/content/business";
import { shop } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, салбарууд",
  description: `${business.zone.name}: ${formatPrice(business.zone.price)}, 24–72 цагт. QPay. 7 салбар, ${business.hours}. Түгээмэл асуулт.`,
  alternates: { canonical: "/info" },
};

export default function InfoPage() {
  const blocks = [
    { id: "delivery", Icon: TruckIcon, tone: "bg-peach-l", title: "Хүргэлт", items: [`${business.zone.name}: ${formatPrice(business.zone.price)}.`, business.rules.delivery, business.rules.countryside] },
    { id: "payment", Icon: QrIcon, tone: "bg-gold-l", title: "Төлбөр", items: [business.rules.payment, "QPay: аль ч банкны аппаар QR уншуулж төлнө.", business.rules.ebarimt, business.rules.credit] },
    { id: "terms", Icon: ChatIcon, tone: "bg-rose-l", title: "Үйлчилгээний нөхцөл, буцаалт", items: [business.rules.terms, business.rules.noReturn] },
    { id: "wholesale", Icon: PhoneIcon, tone: "bg-mint-l", title: "Бөөний болон гэрээт худалдаа", items: [business.rules.wholesale, (shop.about as string[])[1]] },
  ];
  return (
    <div className="pb-28 md:pb-16">
      <section className="glow overflow-hidden bg-sand [--g1:#ffd2bd] [--g2:#f6d9a8]">
        <div className="wrap pt-10 pb-10 md:pt-14 md:pb-14">
          <p className="eyebrow">Мэдээлэл</p>
          <h1 className="mt-3 max-w-3xl text-[38px] md:text-[60px]">
            Хүргэлт, төлбөр, <span className="it text-peach-d">салбарууд</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] text-ink-2">{(shop.about as string[])[0]}</p>
        </div>
      </section>

      <div className="wrap">
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {blocks.map(({ id, Icon, tone, title, items }) => (
            <section key={id} id={id} className={`scroll-mt-44 rounded-[28px] p-6 md:p-8 ${tone}`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white">
                <Icon size={22} />
              </span>
              <h2 className="mt-4 text-[26px]">{title}</h2>
              <ul className="mt-3 space-y-2 text-[15px] text-ink-2">
                {items.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-ink-3" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section id="branches" className="mt-6 grid scroll-mt-44 gap-6 overflow-hidden rounded-[30px] bg-ink p-6 text-white md:p-10 lg:grid-cols-[1.4fr_1fr]" aria-labelledby="branches-h">
          <div>
            <p className="eyebrow text-gold-l">Тестерээр өнгөө туршаад аваарай</p>
            <h2 id="branches-h" className="mt-3 text-[30px] md:text-[42px]">
              7 салбар, <span className="it text-gold-l">5 аймагт</span>
            </h2>
            <p className="mt-3 flex items-center gap-2 text-white/70">
              <ClockIcon size={17} /> {business.hours}. Худалдааны төвийн амралтын өдөр амарна.
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {BRANCHES.map((b) => (
                <li key={b.name} className="rounded-[18px] bg-white/[0.07] p-4 ring-1 ring-white/10">
                  <b className="flex items-center gap-2 text-[15px]">
                    <PinIcon size={16} className="text-gold-l" /> {b.name}
                  </b>
                  <span className="mt-1 block text-[14px] text-white/75">{b.place}</span>
                  {b.off && <span className="mt-1 block text-[12.5px] text-gold-l">{b.off}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[14px] font-semibold text-white/85">Орон нутагт</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {COUNTRYSIDE_BRANCHES.map((b) => (
                <li key={b} className="rounded-full bg-white/10 px-3 py-1.5 text-[13px] text-white/80">
                  {b}
                </li>
              ))}
            </ul>
            <a href={`tel:${business.branchPhone.tel}`} className="btn btn-gold mt-7">
              <PhoneIcon size={17} /> Салбарын лавлах {business.branchPhone.display}
            </a>
          </div>
          <div className="relative min-h-[280px] overflow-hidden rounded-[24px] bg-white/5">
            <Image src="/brand/store.webp" alt="Dr.Rashel Mongolia гоо сайхны дэлгүүр" fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
          </div>
        </section>

        <section className="card mt-6 p-6 md:p-8" aria-labelledby="flow">
          <h2 id="flow" className="text-[26px]">
            Захиалгын <span className="it text-rose-d">явц</span>
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ORDER_STATUSES.map((s, i) => (
              <li key={s.id} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[14px] font-semibold text-gold-l">{i + 1}</span>
                <span>
                  <b className="block font-semibold">{s.name}</b>
                  <span className="text-[14px] text-ink-2">{s.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq" className="mt-6 scroll-mt-44" aria-labelledby="faq-h">
          <h2 id="faq-h" className="text-[30px] md:text-[40px]">
            Түгээмэл <span className="it text-lilac-d">асуулт</span>
          </h2>
          <div className="mt-5 grid gap-3">
            {faq.map((x) => (
              <details key={x.q} className="group card p-5 open:pb-6 md:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold">
                  {x.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand text-[18px] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] whitespace-pre-line text-ink-2">{x.a.replace(/\n{2,}/g, "\n")}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Холбоо барих">
          {[
            { href: `tel:${business.phone.tel}`, Icon: PhoneIcon, v: business.phone.display },
            { href: `tel:${business.branchPhone.tel}`, Icon: PhoneIcon, v: business.branchPhone.display },
            { href: `mailto:${business.email}`, Icon: MailIcon, v: business.email },
            { href: business.facebook, Icon: FacebookIcon, v: "Qn Beauty cosmetics" },
          ].map(({ href, Icon, v }) => (
            <a key={v} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex min-w-0 items-center gap-3 rounded-[22px] bg-white p-4 ring-1 ring-line hover:ring-ink">
              <Icon size={20} className="shrink-0" />
              <b className="truncate font-semibold">{v}</b>
            </a>
          ))}
        </section>
      </div>
    </div>
  );
}
