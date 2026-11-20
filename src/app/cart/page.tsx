import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-8 pb-28 md:pt-12 md:pb-16">
      <h1 className="mb-6 text-[36px] md:text-[50px]">
        Таны <span className="it text-peach-d">сагс</span>
      </h1>
      <Checkout />
    </div>
  );
}
