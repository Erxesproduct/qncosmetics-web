/** Wordmark: «Qn» in the gold italic of the shop's logo, then «cosmetics»; the official line under it. */
export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-ink text-[22px] leading-none text-gold-l shadow-[inset_0_0_0_1.5px_rgb(184_134_59/0.6)] md:h-11 md:w-11">
        <span className="it -mt-0.5">Qn</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-[19px] font-bold tracking-[-0.03em] md:text-[21px] ${light ? "text-white" : "text-ink"}`}>
          Qn <span className="it font-semibold text-gold">cosmetics</span>
        </span>
        <span className={`mt-1 text-[10.5px] font-semibold tracking-[0.02em] ${light ? "text-white/60" : "text-ink-3"}`}>Dr.Rashel & Estelin Mongolia</span>
      </span>
    </span>
  );
}

/** A four-point sparkle. */
export function Spark({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill={color} d="M12 0c.8 6.4 4.6 10.6 12 12-7.4 1.4-11.2 5.6-12 12-.8-6.4-4.6-10.6-12-12C7.4 10.6 11.2 6.4 12 0Z" />
    </svg>
  );
}
