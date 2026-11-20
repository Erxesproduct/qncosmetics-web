"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A horizontal row that also works with a mouse: ‹ › arrow buttons (shown only when there is more to see) and
 * click-and-drag. Phones keep their native swipe. Used for product shelves and the header category row.
 */
export function Scroller({ children, className = "", label, small = false, as: Tag = "div" }: { children: React.ReactNode; className?: string; label?: string; small?: boolean; as?: "div" | "nav" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: true });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * Math.max(200, el.clientWidth * 0.8), behavior: "smooth" });
  };

  const btn = `absolute top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-[0_8px_20px_-8px_rgb(29_21_18/0.4)] ring-1 ring-line transition hover:bg-ink hover:text-white md:grid ${small ? "h-8 w-8" : "h-12 w-12"}`;

  return (
    <Tag className="relative min-w-0 max-w-full" aria-label={label}>
      <div
        ref={ref}
        className={className}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
          drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          const el = ref.current;
          if (!d || !el) return;
          const dx = e.clientX - d.x;
          if (!d.moved && Math.abs(dx) < 6) return;
          if (!d.moved) {
            d.moved = true;
            el.style.scrollSnapType = "none";
            el.style.cursor = "grabbing";
          }
          el.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          const el = ref.current;
          if (el) {
            el.style.scrollSnapType = "";
            el.style.cursor = "";
          }
          // a drag must not open the product it ended on
          if (drag.current?.moved) window.addEventListener("click", (ev) => ev.preventDefault(), { capture: true, once: true });
          drag.current = null;
        }}
        onPointerLeave={() => {
          const el = ref.current;
          if (el && drag.current) {
            el.style.scrollSnapType = "";
            el.style.cursor = "";
          }
          drag.current = null;
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>
      {!edge.start && (
        <button type="button" onClick={() => go(-1)} className={`${btn} ${small ? "-left-2" : "-left-4"}`} aria-label="Өмнөх">
          <svg width={small ? 16 : 22} height={small ? 16 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m15 5-7 7 7 7" />
          </svg>
        </button>
      )}
      {!edge.end && (
        <button type="button" onClick={() => go(1)} className={`${btn} ${small ? "-right-2" : "-right-4"}`} aria-label="Дараах">
          <svg width={small ? 16 : 22} height={small ? 16 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      )}
    </Tag>
  );
}
