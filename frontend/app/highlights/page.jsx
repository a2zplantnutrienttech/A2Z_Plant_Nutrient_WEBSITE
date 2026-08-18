"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  PencilRuler,
  Compass,
  FlaskConical,
  Layers,
  Sprout,
  Scissors,
  Grid3x3,
  Wheat,
  Recycle,
  SprayCan,
  Flower2,
  Droplets,
  TreeDeciduous,
  Users,
  Wind,
  Truck,
  CalendarCheck,
  Tag,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/Motion";
import {
  WatercolorBranchLeft,
  WatercolorBranchRight,
  LeafVeinPattern,
  OrganicWaveSeparator,
  WatercolorLeafSingle,
} from "@/components/BotanicalPatterns";
import { HIGHLIGHTS, CERTIFICATIONS } from "@/lib/mock";

const ICONS = {
  PencilRuler,
  Compass,
  FlaskConical,
  Layers,
  Sprout,
  Scissors,
  Grid3x3,
  Wheat,
  Recycle,
  SprayCan,
  Flower2,
  Droplets,
  TreeDeciduous,
  Users,
  Wind,
  Truck,
  CalendarCheck,
  Tag,
  TrendingUp,
  Lightbulb,
};

export default function HighlightsPage() {
  return (
    <div data-testid="highlights-page">
      <PageHero title="Our Key Highlights" subtitle="Why Choose Us" />

      {/* Intro */}
      <section className="relative overflow-hidden py-16 md:py-20 bg-white">
        <WatercolorBranchLeft className="absolute -left-20 -bottom-24 w-80 h-[600px] hidden md:block" opacity={0.13} />
        <WatercolorBranchRight className="absolute -right-24 -top-24 w-80 h-[600px] hidden md:block" opacity={0.13} />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-10 items-end">
          <FadeIn className="lg:col-span-8">
            <p className="inline-flex items-center gap-2 uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">
              <Sparkles size={14} /> The A2Z Advantage
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-[1.1]">
              A single partner for every stage of green infrastructure.
            </h2>
            <p className="mt-5 text-stone-600 leading-relaxed max-w-2xl">
              From the first soil test to decade-long maintenance, we bring a rare blend of design
              craft, agronomic science and dependable supply under one roof. Explore the capabilities
              that make A2Z Plant Nutrient the trusted choice for government, PSU and corporate projects.
            </p>
          </FadeIn>

          <FadeIn className="lg:col-span-4">
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {CERTIFICATIONS.map((c) => (
                <span
                  key={c.code}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    c.color === "amber"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  <ShieldCheck size={12} /> {c.code}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Highlights grid — editorial numbered cards */}
      <section className="relative overflow-hidden py-14 md:py-16 bg-stone-50/60">
        <LeafVeinPattern opacity={0.06} />
        <WatercolorLeafSingle className="absolute -left-10 top-24 w-52 h-52 hidden md:block" opacity={0.1} rotate={25} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="highlights-grid">
            {HIGHLIGHTS.map((h, i) => {
              const Icon = ICONS[h.icon] || Sprout;
              const num = String(i + 1).padStart(2, "0");
              return (
                <FadeIn key={h.title} delay={(i % 3) * 0.05}>
                  <article
                    className="group relative h-full flex flex-col rounded-3xl bg-white border border-stone-200 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                    data-testid={`highlight-card-${i}`}
                  >
                    {/* top accent bar */}
                    <span className="absolute top-0 left-0 h-1 w-0 bg-emerald-600 z-20 transition-all duration-500 group-hover:w-full" />

                    <div className="relative aspect-[16/11] overflow-hidden">
                      <img
                        src={h.image}
                        alt={h.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/10 to-transparent" />

                      {/* index */}
                      <span className="absolute top-4 left-4 font-serif text-2xl font-semibold text-white/95 drop-shadow">
                        {num}
                      </span>

                      {/* category pill */}
                      <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.15em] bg-white/95 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
                        {h.category}
                      </span>

                      {/* icon badge */}
                      <span className="absolute -bottom-6 left-5 w-12 h-12 rounded-2xl bg-white shadow-lg border border-emerald-100 flex items-center justify-center text-emerald-700 transition-colors duration-300 group-hover:bg-emerald-700 group-hover:text-white">
                        <Icon size={22} />
                      </span>
                    </div>

                    <div className="pt-9 px-6 pb-6 flex flex-col grow">
                      <h3 className="font-serif text-xl font-semibold text-emerald-950 leading-snug">
                        {h.title}
                      </h3>
                      <p className="mt-2 text-stone-600 leading-relaxed text-[14.5px]">{h.text}</p>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
        <OrganicWaveSeparator className="absolute bottom-0 left-0 w-full h-14" opacity={0.1} />
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-emerald-950 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-emerald-800/40 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <p className="uppercase tracking-[0.25em] text-amber-300 text-xs font-semibold">Ready When You Are</p>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-semibold mt-3 leading-tight">
            Every capability above, delivered under one contract.
          </h2>
          <p className="mt-5 text-emerald-100/85 leading-relaxed max-w-2xl mx-auto">
            Tell us about your site and mandate — we&apos;ll bring the right mix of design, supply
            and maintenance to bring it to life.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild className="bg-amber-400 hover:bg-amber-500 text-emerald-950 rounded-full px-7 py-6 font-semibold">
              <Link href="/contact">
                Start A Conversation <ArrowRight size={18} className="ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-7 py-6 border-emerald-300 text-emerald-50 hover:bg-emerald-900 bg-transparent">
              <Link href="/projects">See Our Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
