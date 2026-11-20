import Link from "next/link";
import { BRANCHES, business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { Logo } from "./brand";
import { ClockIcon, FacebookIcon, MailIcon, PhoneIcon, PinIcon, TruckIcon } from "./icons";

export function Footer() {
  const cards = [
    { href: `tel:${business.phone.tel}`, Icon: PhoneIcon, k: "Захиалга, бөөний худалдаа", v: business.phone.display },
    { href: `tel:${business.branchPhone.tel}`, Icon: PhoneIcon, k: "Салбарын лавлах", v: business.branchPhone.display },
    { href: business.facebook, Icon: FacebookIcon, k: "Facebook", v: "Qn Beauty cosmetics" },
    { href: `mailto:${business.email}`, Icon: MailIcon, k: "Имэйл", v: business.email },
  ];
  return (
    <footer id="contact" className="mt-20 bg-ink pb-28 text-white md:pb-0">
      <div className="wrap pt-14 pb-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.5fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-md text-[26px] leading-tight font-bold tracking-tight">
              Албан ёсны борлуулагчаас, <span className="it font-semibold text-gold-l">жинхэнэ</span> бүтээгдэхүүн.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {business.promise.map((p) => (
                <li key={p} className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/85">
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 text-[14.5px] text-white/75">
              <p className="flex items-start gap-3">
                <TruckIcon size={19} className="mt-0.5 shrink-0 text-gold-l" />
                {business.zone.name}: {formatPrice(business.zone.price)}, 24–72 цагт. {business.rules.noCamp}
              </p>
              <p className="flex items-start gap-3">
                <ClockIcon size={19} className="mt-0.5 shrink-0 text-gold-l" />
                {business.hours}
              </p>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cards.map(({ href, Icon, k, v }) => (
                <a key={k} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-[22px] bg-white/[0.06] p-4 ring-1 ring-white/10 transition hover:bg-white/10">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-l text-ink transition group-hover:scale-105">
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] text-white/55">{k}</span>
                    <b className="block truncate text-[15.5px] font-semibold">{v}</b>
                  </span>
                </a>
              ))}
            </div>
            <div id="branches-mini" className="rounded-[22px] bg-white/[0.06] p-5 ring-1 ring-white/10">
              <p className="flex items-center gap-2 text-[15px] font-semibold">
                <PinIcon size={18} className="text-gold-l" /> Салбарууд: тестерээр өнгөө туршиж үзээрэй
              </p>
              <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-[13.5px] text-white/70 sm:grid-cols-2">
                {BRANCHES.map((b) => (
                  <li key={b.name} className="leading-snug">
                    <b className="font-semibold text-white/90">{b.name}:</b> {b.place}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-[14px] text-white/65">
          <Link href="/shop" className="hover:text-white">
            Бүх бараа
          </Link>
          <Link href="/info" className="hover:text-white">
            Хүргэлт, төлбөр
          </Link>
          <Link href="/info#branches" className="hover:text-white">
            Салбарууд
          </Link>
          <Link href="/info#faq" className="hover:text-white">
            Түгээмэл асуулт
          </Link>
          <span className="ml-auto text-white/45">© {new Date().getFullYear()} {business.title}</span>
        </div>
      </div>
    </footer>
  );
}
