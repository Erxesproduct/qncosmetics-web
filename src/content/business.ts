import data from "@/data/catalog.json";

/**
 * Business facts from qncosmetics.mn (Zochil shop 7735: shop settings, payment and delivery rules, terms of service, the
 * delivery option, FAQ, banners) and the Qn Beauty cosmetics Facebook page, read on 2026-11-20. Nothing here is invented;
 * where the shop's own texts disagree (the delivery fee) the checkout's option is used and the question is in
 * docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;
const zone = shop.zone!;

/** The shop's FAQ, word for word (Zochil «Түгээмэл асуулт»). */
export const faq = shop.faq as { q: string; a: string }[];

export const BRANCHES = [
  { name: "Салбар 1", place: "Хороолол, АПЕКС худалдааны төв, 1 давхар, 117", off: null },
  { name: "Салбар 2", place: "Алтжин бөмбөгөр, 1039", off: "Пүрэв амарна" },
  { name: "Салбар 3", place: "Алтжин бөмбөгөр, 1030 (1 давхар)", off: "Пүрэв амарна" },
  { name: "Салбар 4", place: "Алтжин бөмбөгөр, 1102", off: "Пүрэв амарна" },
  { name: "Салбар 5", place: "Их тойруу худалдааны төв, 2 давхар, 62-р павильон", off: "Лхагва амарна" },
  { name: "Салбар 6 (гэрээт)", place: "Гранд плаза, 6 давхар, 601, «Helen Beauty»", off: "Даваа амарна" },
  { name: "Салбар 7 (гэрээт)", place: "Gem Palace (баруун 4 зам), 1 давхар, «Zaanaa cosmetics»", off: null },
] as const;
export const COUNTRYSIDE_BRANCHES = ["Дорнод, Хэрлэн Номин: Qn cosmetics", "Дорнод, 4-р байр: Qn cosmetics", "Сүхбаатар, Дээж 1 давхар: Qn cosmetics", "Баянхонгор, EMB 2 давхар: Qn cosmetics", "Хөвсгөл, Баянцагаан ХҮТ 804: Shur Beauty"] as const;

export const business = {
  name: "Qn cosmetics",
  /** The Zochil shop name, word for word. */
  title: shop.name,
  domain: "qncosmetics.mn",
  /** The banners' own words. */
  tagline: "Dr.Rashel & Estelin албан ёсны Монгол дахь борлуулагч",
  promise: ["Байгалийн гаралтай", "Амьтан дээр туршаагүй", "Спиртгүй"],
  phone: { display: "8602-1100", tel: "+97686021100" },
  /** FAQ: branches and wholesale information line */
  branchPhone: { display: "8013-3103", tel: "+97680133103" },
  email: shop.email,
  facebook: shop.facebook,
  hours: "Бүх салбар 10:30–19:30",
  address: shop.address as string[],

  /** Zochil has QPay on; the website takes QPay through erxes. Lend.mn / Pocketzero are offered in the branches only. */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө." }],

  /** The one Zochil checkout option. */
  zone: { name: zone.title, area: zone.description, price: zone.price, freeOver: zone.freeOver },

  rules: {
    /** Zochil payment rule, word for word. */
    payment: shop.paymentRule,
    /** Zochil delivery rule, word for word. */
    delivery: shop.deliveryRule,
    /** Zochil terms of service, word for word. */
    terms: shop.terms,
    time: "Захиалга баталгаажсаны дараа 24–72 цагийн дотор хүргэнэ.",
    noCamp: "Зуслан, лагерь руу хүргэхгүй.",
    countryside: "Орон нутагт хүргүүлэх бол захиалахаасаа өмнө 8602-1100 дугаараар тохирно уу.",
    noReturn: "Захиалсан бараанд буцаалт хийхгүй. Өнгөө салбарт тестерээр туршиж сонгох боломжтой.",
    credit: "Lend.mn, Pocketzero-оор урьдчилгаагүй 6 хувааж төлөх боломжтой (салбар дээр).",
    wholesale: "Бөөний болон гэрээт худалдаа: зөвхөн 8602-1100 дугаараар.",
    ebarimt: "И-баримтыг төлбөр баталгаажсаны дараа erxes-ээс албан ёсоор олгоно. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
  },
} as const;

export type PaymentId = (typeof business.payments)[number]["id"];
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Zochil checkout option: one fee for Ulaanbaatar, no free-delivery limit (freeOver 0 = never free). */
export function deliveryFee(subtotal: number): number {
  return business.zone.freeOver > 0 && subtotal >= business.zone.freeOver ? 0 : business.zone.price;
}

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Төлбөр хүлээгдэж байна", note: "QPay-ээр 100% төлж баталгаажуулна" },
  { id: "paid", name: "Баталгаажсан", note: "Төлбөр орсон, бараагаа бэлдэж эхэлнэ" },
  { id: "packing", name: "Бэлдэж байна", note: "Өнгө, төрлийг нь шалгаж савлана" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "24–72 цагийн дотор хүргэнэ" },
  { id: "delivered", name: "Хүргэгдсэн", note: "И-баримт таны утсанд" },
  { id: "cancelled", name: "Цуцлагдсан", note: "Төлбөр төлөгдөөгүй" },
] as const;
