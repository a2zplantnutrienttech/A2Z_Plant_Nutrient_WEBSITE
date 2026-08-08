"use client";

/**
 * ClientLogo — trendy monochromatic wordmark card in the site's emerald palette.
 * One consistent brand color across all client tiles. No rainbow, no external
 * logo dependency. Designed to look premium and cohesive (Vercel / Linear /
 * Anthropic pattern), fully on-brand for A2Z.
 *
 * Renders on a dark emerald surface with a subtle ring; the wordmark is the
 * primary visual, sector tag is secondary. Uniform 100px height across all
 * tiles keeps the wall reading as one.
 */
export default function ClientLogo({ label, subtitle, size = "md" }) {
  const s =
    size === "sm"
      ? { h: "h-16", label: "text-base md:text-lg", sub: "text-[9px]" }
      : size === "lg"
      ? { h: "h-28", label: "text-2xl md:text-3xl", sub: "text-xs" }
      : { h: "h-24", label: "text-xl md:text-2xl", sub: "text-[10px] md:text-[11px]" };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10 hover:ring-amber-300/60 hover:bg-white/[0.07] transition-all duration-500 flex flex-col items-center justify-center px-3 ${s.h}`}
      aria-label={subtitle}
    >
      {/* Subtle glow on hover */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(252,211,77,0.14), transparent 70%)",
        }}
      />
      <div
        className={`font-serif font-semibold text-white text-center leading-none tracking-tight ${s.label}`}
      >
        {label}
      </div>
      <div
        className={`uppercase tracking-[0.18em] font-semibold text-emerald-300/70 group-hover:text-amber-200 transition-colors text-center mt-2 ${s.sub} truncate max-w-full`}
      >
        {subtitle}
      </div>
    </div>
  );
}
