"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Photo = { src: string; w: number; h: number; thumb: { src: string } };

/** Swipeable photo row (native scroll-snap on phones) with dots, and thumbnails on larger screens. */
export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [at, setAt] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const go = (i: number) => {
    const el = row.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };
  return (
    <div className={photos.length > 1 ? "md:grid md:grid-cols-[76px_1fr] md:gap-4" : ""}>
      <div className="order-2">
        <div
          ref={row}
          onScroll={(e) => {
            const el = e.currentTarget;
            setAt(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
          }}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[30px] bg-sand"
        >
          {photos.map((p, i) => (
            <div key={p.src} className="relative aspect-square w-full shrink-0 snap-center">
              <Image src={p.src} alt={i === 0 ? title : `${title}: зураг ${i + 1}`} fill priority={i === 0} sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
        {photos.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
            {photos.map((p, i) => (
              <span key={p.src} className={`h-1.5 rounded-full transition-all ${i === at ? "w-6 bg-ink" : "w-1.5 bg-line"}`} />
            ))}
          </div>
        )}
      </div>
      {photos.length > 1 && (
        <div className="order-1 hidden flex-col gap-2.5 md:flex">
          {photos.map((p, i) => (
            <button key={p.src} type="button" onClick={() => go(i)} aria-label={`Зураг ${i + 1}`} aria-current={i === at} className={`relative aspect-square overflow-hidden rounded-2xl transition ${i === at ? "ring-2 ring-ink" : "opacity-70 ring-1 ring-line hover:opacity-100"}`}>
              <Image src={p.thumb.src} alt="" fill sizes="76px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
