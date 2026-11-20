/**
 * End-to-end check of the website order flow (cart → /api/orders → erxes form + erxes QPay invoice → /api/payments/check).
 *
 *   node scripts/test-order.mjs [baseUrl] [--send]
 *
 * Without --send it only runs the validation cases: nothing reaches erxes while erxes is not configured, and with
 * erxes configured the validation cases are rejected before anything is sent.
 * With --send it also places ONE test order, marked «ТЕСТ ЗАХИАЛГА: устгана уу», and checks its invoice status once.
 * Creating an invoice never charges anyone: QPay only charges when someone scans the QR and pays.
 * Exit code 1 if any check fails.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const send = args.includes("--send");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "src", "data", "catalog.json"), "utf8"));
const V = catalog.products.flatMap((p) => p.variants.map((v) => ({ ...v, slug: p.slug })));
// Zochil rules (qncosmetics.mn, shop 7735): one delivery option «Улаанбаатар», 8,000₮, no free-delivery limit
// (freeOver 0); QPay only (through erxes), 100% paid; check colour and type, no returns: accepted at checkout.
const { price: ZONE, freeOver: FREE } = catalog.shop.zone;
const feeFor = (subtotal) => (FREE > 0 && subtotal >= FREE ? 0 : ZONE);

const ok = V.filter((v) => v.stock !== 0);
const cheap = [...ok].sort((a, b) => a.price - b.price)[0];
const mid = ok.find((v) => v.id !== cheap.id && v.price >= 20000);
const variantOf = ok.find((v) => v.id.includes("-"));
const big = [...ok].sort((a, b) => b.price - a.price)[0];
const soldout = V.find((v) => v.stock === 0);
const few = ok.find((v) => v.stock != null && v.stock < 10);
const item = (v, qty) => ({ id: v.id, qty });

const order = {
  name: "Тест Захиалагч",
  phone: "99112233",
  area: "Баянзүрх",
  khoroo: 17,
  address: "Тест хаяг, 1-р байр, 2-р орц, 34 тоот",
  payment: "qpay",
  receiptType: "person",
  note: "ТЕСТ ЗАХИАЛГА: устгана уу",
  agree: true,
  items: [item(mid, 1), item(cheap, 1)],
};
const SUBTOTAL = mid.price + cheap.price;

async function post(url, body) {
  const res = await fetch(`${base}${url}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, json: await res.json().catch(() => null) };
}

const valid = (r) => !r.json?.errors && (r.status === 200 || r.status === 503);
const rejects = (field) => (r) => r.status === 422 && !!r.json?.errors?.[field];
const total = (expected, fee) => (r) => valid(r) && r.json?.total === expected && (fee === undefined || r.json?.deliveryFee === fee);
const key = (n) => `test-${n}-${Date.now().toString(36)}-abcdef`;
const bigQty = 10;
const cases = [
  ["empty cart is rejected", { ...order, items: [] }, rejects("items")],
  ["unknown product is ignored (then empty)", { ...order, items: [{ id: "1", qty: 1 }] }, rejects("items")],
  ["numeric id (old format) is ignored", { ...order, items: [{ id: Number(cheap.id) || 1, qty: 1 }] }, rejects("items")],
  ...(soldout ? [[`sold-out product is not orderable (QN-${soldout.id})`, { ...order, items: [item(soldout, 1)] }, rejects("items")]] : []),
  ...(few ? [[`more than the stock (${few.stock}) is not orderable (QN-${few.id})`, { ...order, items: [item(few, few.stock + 1)] }, rejects("items")]] : []),
  [`one ${cheap.price}₮ item + ${ZONE}₮ delivery`, { ...order, items: [item(cheap, 1)] }, total(cheap.price + ZONE, ZONE)],
  [`two items ${SUBTOTAL}₮ + delivery`, order, total(SUBTOTAL + feeFor(SUBTOTAL), feeFor(SUBTOTAL))],
  ...(big.stock == null || big.stock >= bigQty ? [[`${bigQty} × ${big.price}₮: delivery is still charged (no free limit)`, { ...order, items: [item(big, bigQty)] }, total(big.price * bigQty + feeFor(big.price * bigQty), feeFor(big.price * bigQty))]] : []),
  ...(variantOf ? [[`a variant is priced by its own id (QN-${variantOf.id} ${variantOf.label ?? ""})`, { ...order, items: [item(variantOf, 1)] }, total(variantOf.price + feeFor(variantOf.price))]] : []),
  ["the terms must be accepted", { ...order, agree: false }, rejects("agree")],
  ["agree must be true, not a string", { ...order, agree: "yes" }, rejects("agree")],
  ["district is required", { ...order, area: "" }, rejects("area")],
  ["an aimag is not a district", { ...order, area: "Орхон" }, rejects("area")],
  ["khoroo must be 1–45", { ...order, khoroo: 99 }, rejects("khoroo")],
  ["address is required", { ...order, address: "" }, rejects("address")],
  ["QPay is accepted", order, valid],
  ["bank transfer is not offered", { ...order, payment: "transfer" }, rejects("payment")],
  ["unknown payment is rejected", { ...order, payment: "cash" }, rejects("payment")],
  ["company eBarimt needs a 7-digit registry number", { ...order, receiptType: "company", regNo: "12" }, rejects("regNo")],
  ["company eBarimt with a valid registry number passes", { ...order, receiptType: "company", regNo: "1234567" }, valid],
  ["bad phone is rejected", { ...order, phone: "123" }, rejects("phone")],
  ["+976 phone prefix is accepted", { ...order, phone: "+976 9911 2233" }, valid],
  ["bad email is rejected", { ...order, email: "not-an-email" }, rejects("email")],
  ["quantity over 10 is ignored", { ...order, items: [item(cheap, 11)] }, rejects("items")],
  ["the browser's price is ignored", { ...order, items: order.items.map((i) => ({ ...i, price: 1 })) }, total(SUBTOTAL + feeFor(SUBTOTAL))],
  ["the same checkout key gives the same reference", { ...order, key: "same-key-0123456789abcdef" }, (r) => valid(r) && /^QN-\d{6}-[0-9A-F]{6}$/.test(r.json?.reference ?? "")],
  ["honeypot is silently accepted", { ...order, website: "spam" }, (r) => r.status === 200 && r.json?.ok === true && r.json?.payment === null],
];

let failed = 0;
console.log(`Order API checks against ${base}\n`);
for (const [label, body, check] of cases) {
  const r = await post("/api/orders", { key: key(cases.findIndex((c) => c[0] === label)), ...body });
  const pass = check(r);
  if (!pass) failed++;
  if (label.startsWith("the same checkout key")) {
    const again = await post("/api/orders", { ...body });
    const same = again.json?.reference === r.json?.reference;
    if (!same) failed++;
    console.log(`${same ? "✓" : "✗"} retry with that key returns ${again.json?.reference}`);
  }
  console.log(`${pass ? "✓" : "✗"} ${label}  (${r.status}${r.json?.errors ? " " + Object.keys(r.json.errors).join(",") : ""}${r.json?.total != null ? " total " + r.json.total : ""})`);
}

const bad = await post("/api/payments/check", { invoiceId: "../../etc" });
const badOk = bad.status === 400;
if (!badOk) failed++;
console.log(`${badOk ? "✓" : "✗"} payment check rejects a malformed invoice id (${bad.status})`);
const probe = await post("/api/payments/check", { invoiceId: "notAnInvoice123" });
const probeOk = probe.status === 503 ? probe.json?.error === "not_configured" : probe.status === 200 || probe.status === 502;
if (!probeOk) failed++;
console.log(`${probeOk ? "✓" : "✗"} payment check answers honestly (${probe.status} ${probe.json?.error ?? probe.json?.status})`);

if (send) {
  const r = await post("/api/orders", { key: key("send"), ...order });
  if (r.status === 200 && r.json?.ok) {
    console.log(`\n✓ test order recorded in erxes: ${r.json.reference}, total ${r.json.total}₮ (expected ${SUBTOTAL + feeFor(SUBTOTAL)})`);
    if (r.json.total !== SUBTOTAL + feeFor(SUBTOTAL)) {
      failed++;
      console.log("✗ unexpected total");
    }
    if (r.json.payment) {
      console.log(`✓ QPay invoice created in erxes: ${r.json.payment.invoiceId} (not paid; nobody is charged)`);
      const c = await post("/api/payments/check", { invoiceId: r.json.payment.invoiceId });
      console.log(`${c.status === 200 ? "✓" : "✗"} invoice status: ${c.json?.status ?? c.json?.error}`);
      if (c.status !== 200) failed++;
    } else console.log(`– no invoice: ${r.json.paymentError ?? "ERXES_PAYMENT_IDS not set"}`);
  } else if (r.status === 503 && r.json?.error === "not_configured") {
    console.log(`\n– test order NOT sent: erxes env vars are not set on ${base} (reference ${r.json.reference}). See .env.example.`);
  } else {
    failed++;
    console.log(`\n✗ test order failed: ${r.status} ${JSON.stringify(r.json)}`);
  }
}

console.log(failed ? `\n${failed} check(s) failed` : `\nall ${cases.length + 3} checks passed`);
process.exit(failed ? 1 : 0);
