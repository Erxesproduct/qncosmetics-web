"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { business, ORDER_STATUSES } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { localOrders, useLocalOrders } from "@/lib/local-orders";
import { Spark } from "./brand";
import { CheckIcon, ClockIcon, CloseIcon, PhoneIcon } from "./icons";

const LABEL: Record<string, { title: string; text: string; tone: "ok" | "wait" | "bad" }> = {
  paid: { title: "Төлбөр төлөгдлөө", text: "Захиалга баталгаажлаа. 24–48 цагийн дотор хүргэнэ.", tone: "ok" },
  pending: { title: "Төлбөр хүлээгдэж байна", text: "QPay-ээр 100% төлж баталгаажуулна уу. Төлсний дараа энэ хуудас өөрөө шинэчлэгдэнэ.", tone: "wait" },
  failed: { title: "Төлбөр амжилтгүй", text: "Төлбөр хийгдсэнгүй. Дахин оролдох эсвэл бидэнтэй холбогдоно уу.", tone: "bad" },
  cancelled: { title: "Нэхэмжлэл цуцлагдсан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  rejected: { title: "Төлбөр татгалзсан", text: "Банк төлбөрийг татгалзсан. Бидэнтэй холбогдоно уу.", tone: "bad" },
  expired: { title: "Нэхэмжлэлийн хугацаа дууссан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  refunded: { title: "Төлбөр буцаагдсан", text: "Төлбөрийг буцаан шилжүүлсэн.", tone: "bad" },
};
const TERMINAL = ["paid", "failed", "cancelled", "rejected", "expired", "refunded"];
const TONE = { ok: "bg-mint-l", wait: "bg-gold-l", bad: "bg-rose-l" };

export function OrderStatus({ reference }: { reference: string }) {
  const orders = useLocalOrders();
  const order = orders.find((o) => o.reference === reference) ?? null;
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const tries = useRef(0);

  const check = useCallback(async () => {
    const o = localOrders.get(reference);
    if (!o?.invoiceId) return;
    setChecking(true);
    try {
      const res = await fetch("/api/payments/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId: o.invoiceId }) });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.setStatus(reference, json.status);
        setCheckError(null);
      } else setCheckError(json?.error === "not_configured" ? "Төлбөрийн систем холбогдоогүй байна." : "Төлбөр шалгахад алдаа гарлаа.");
    } catch {
      setCheckError("Интернэт холболтоо шалгана уу.");
    } finally {
      setChecking(false);
    }
  }, [reference]);

  // check on arrival (also when coming back from the QPay page), then every 5 s while pending and visible, for 10 min
  const status = order?.status ?? null;
  useEffect(() => {
    if (!order?.invoiceId || (status && TERMINAL.includes(status))) return;
    const first = window.setTimeout(check, 300);
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (++tries.current > 120) return window.clearInterval(id);
      check();
    }, 5000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [order?.invoiceId, status, check]);

  if (!order)
    return (
      <div className="card mx-auto max-w-xl p-8 text-center md:p-12">
        <Spark className="mx-auto h-11 w-11 text-gold" />
        <p className="mt-5 text-[28px] font-bold tracking-tight">{reference}</p>
        <p className="mt-3 text-ink-2">Энэ захиалга энэ төхөөрөмж дээр хадгалагдаагүй байна. Захиалгынхаа явцыг утсаар лавлана уу.</p>
        <a href={`tel:${business.phone.tel}`} className="btn btn-ink mt-8">
          <PhoneIcon size={16} /> {business.phone.display}
        </a>
      </div>
    );

  const s = status ? (LABEL[status] ?? LABEL.pending) : null;
  const paid = status === "paid";

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="card pop-in overflow-hidden">
        <div className="glow relative overflow-hidden bg-peach-l p-8 [--g1:#ffc4a8] [--g2:#f7b6cf] md:p-10">
          <Spark className="absolute top-6 right-6 h-10 w-10 text-gold" />
          <p className="eyebrow text-peach-d">Захиалга бүртгэгдлээ</p>
          <h1 className="mt-3 text-[40px] leading-tight md:text-[52px]">
            Баярлалаа, <span className="it text-rose-d">гоо бүсгүй</span>
          </h1>
          <p className="mt-3 inline-block rounded-full bg-white px-4 py-2 text-ink-2">
            Захиалгын код: <b className="text-[18px] font-bold tracking-tight text-ink">{order.reference}</b>
          </p>
        </div>
        <div className="p-6 md:p-10">
          {s ? (
            <div className={`flex gap-4 rounded-[20px] p-4 ${TONE[s.tone]}`} role="status" aria-live="polite">
              <span className="mt-0.5">{s.tone === "ok" ? <CheckIcon size={20} /> : s.tone === "bad" ? <CloseIcon size={20} /> : <ClockIcon size={20} />}</span>
              <span>
                <span className="block font-semibold">{s.title}</span>
                <span className="block text-[14.5px] text-ink-2">{s.text}</span>
              </span>
            </div>
          ) : (
            <div className="rounded-[20px] bg-honey-l p-4 text-[14.5px]" role="status">
              <b className="block">Төлбөрийн нэхэмжлэл үүсээгүй</b>
              Захиалга бүртгэгдсэн. QPay нэхэмжлэлийг бид таны утас руу илгээнэ, эсвэл {business.phone.display} дугаарт залгана уу.
            </div>
          )}
          {order.payUrl && !paid && status && !TERMINAL.includes(status) && (
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={order.payUrl} className="btn btn-gold">
                QPay-ээр төлөх
              </a>
              <button type="button" onClick={check} disabled={checking} className="btn btn-light">
                {checking ? "Шалгаж байна…" : "Төлбөр шалгах"}
              </button>
            </div>
          )}
          {checkError && <p className="mt-3 text-[14px] font-semibold text-rose-d">{checkError}</p>}

          <ul className="mt-8 space-y-2.5 text-[15px]">
            {order.lines.map((l) => (
              <li key={`${l.name}|${l.label}`} className="flex justify-between gap-4">
                <span className="text-ink-2">
                  {l.name}
                  {l.label ? ` (${l.label})` : ""} × {l.qty}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4">
              <span className="text-ink-2">Хүргэлт</span>
              <span className="tabular-nums">{order.deliveryFee === 0 ? "Үнэгүй" : formatPrice(order.deliveryFee)}</span>
            </li>
            <li className="flex justify-between gap-4 border-t border-line pt-4 text-[24px] font-bold tracking-tight">
              <span>Нийт</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </li>
          </ul>
          <p className="mt-6 text-[14px] text-ink-2">{business.rules.ebarimt}</p>
        </div>
      </div>
      <aside className="card self-start p-6 md:p-8">
        <p className="eyebrow">Захиалгын явц</p>
        <ol className="mt-6 space-y-5">
          {ORDER_STATUSES.filter((x) => x.id !== "cancelled").map((x, i) => {
            const reached = i === 0 || (paid && i === 1);
            return (
              <li key={x.id} className="flex gap-4">
                <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[14px] font-semibold ${reached ? "bg-ink text-gold-l" : "bg-sand text-ink-3"}`}>{reached ? <CheckIcon size={16} /> : i + 1}</span>
                <span>
                  <span className={`block text-[16px] ${reached ? "font-semibold" : "text-ink-2"}`}>{x.name}</span>
                  <span className="block text-[13.5px] text-ink-3">{x.note}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 rounded-[18px] bg-sand p-4 text-[14px] text-ink-2">
          {business.rules.time} {business.rules.noReturn}
        </p>
        <p className="mt-4 text-[14px] text-ink-2">{business.rules.ebarimt}</p>
        <Link href="/shop" className="btn btn-light mt-6">
          Бараа үзэх →
        </Link>
      </aside>
    </div>
  );
}
