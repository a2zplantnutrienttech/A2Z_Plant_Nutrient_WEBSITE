"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic, BloomButton } from "@/components/Interactive";
import { TextReveal } from "@/components/Motion";
import { CERTIFICATIONS, STATS, COMPANY } from "@/lib/mock";

const SLIDES = [
  {
    id: "epc",
    kicker: "Government · PSU · Corporate Horticulture EPC",
    title: "Engineering Sustainable Landscapes For India's Future.",
    subtitle:
      "We architect and maintain world-class green spaces that elevate institutional campuses, national corridors, and urban environments through sustainable horticulture and precision execution.",
    image: "/real-avenue-hedge-palms.jpg",
    accent: "emerald",
    primaryCta: { label: "Discuss A Tender", href: "/contact" },
    secondaryCta: { label: "View Projects", href: "/projects" },
  },
  {
    id: "trusted",
    kicker: "Trusted By India's Institutions",
    title: "Partnering With India's Most Prestigious Institutions.",
    subtitle:
      "Empowering Navratna CPSEs, government ministries, and leading corporations to realize their environmental mandates with uncompromising quality and scale.",
    image: "/real-parkgate-varanasi.jpg",
    accent: "amber",
    primaryCta: { label: "See Our Clients", href: "/#trusted-by" },
    secondaryCta: { label: "View Projects", href: "/projects" },
  },
  {
    id: "credentials",
    kicker: "Compliance-First",
    title: "Certified Excellence And Unwavering Compliance.",
    subtitle:
      "Backed by rigorous ISO certifications and government recognition, we bring transparency, accountability, and robust governance to every horticultural endeavor.",
    image: "/real-nightlighting-nagarnigam.jpg",
    accent: "emerald",
    primaryCta: { label: "Download Company Profile", href: "#request-profile", modal: true },
    secondaryCta: { label: "Learn About Us", href: "/about" },
  },
  {
    id: "scale",
    kicker: "Pan-India Operations",
    title: "A Legacy Of Transformative Green Infrastructure.",
    subtitle:
      "Deploying an extensive pan-India workforce to cultivate millions of square feet of ecological value, ensuring enduring resilience and aesthetic brilliance.",
    image: "/real-hedge-road-riverside.jpg",
    accent: "amber",
    primaryCta: { label: "Get A Quote", href: "/contact" },
    secondaryCta: { label: "See Services", href: "/services" },
  },
];

export default function HeroCarousel({ onRequestProfile }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = SLIDES.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6500);
    return () => clearInterval(t);
  }, [paused, total]);

  const go = (dir) =>
    setIndex((i) => (i + dir + total) % total);

  const slide = SLIDES[index];
  const isAmber = slide.accent === "amber";

  const handlePrimary = (e) => {
    if (slide.primaryCta.modal) {
      e.preventDefault();
      onRequestProfile?.();
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-emerald-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-testid="hero-carousel"
    >
      {/* Background layer with per-slide image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + "-bg"}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/95 via-emerald-950/80 to-emerald-900/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(132,204,22,0.18),transparent_55%)]" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 min-h-[520px] md:min-h-[600px] flex items-center">
        <div className="w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-copy"}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
                    isAmber
                      ? "bg-amber-400/20 text-amber-200 ring-1 ring-amber-300/40"
                      : "bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-300/30"
                  }`}
                >
                  <ShieldCheck size={14} /> {slide.kicker}
                </span>
                <h1 className="mt-6 font-hero text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-[1.05] tracking-tight">
                  <TextReveal delay={0.1}>{slide.title}</TextReveal>
                </h1>
                <p className="mt-6 text-lg text-emerald-100/85 leading-relaxed max-w-2xl">
                  {slide.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {slide.primaryCta.modal ? (
                    <Magnetic>
                      <BloomButton
                        onClick={handlePrimary}
                        className="inline-flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-emerald-950 rounded-full px-7 py-3 font-semibold shadow-lg shadow-amber-400/20"
                        data-testid="carousel-primary-cta"
                      >
                        <FileText size={18} className="mr-2 relative z-10" /> <span className="relative z-10">{slide.primaryCta.label}</span>
                      </BloomButton>
                    </Magnetic>
                  ) : (
                    <Magnetic>
                      <BloomButton
                        as={Link}
                        href={slide.primaryCta.href}
                        className="inline-flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-emerald-950 rounded-full px-7 py-3 font-semibold shadow-lg shadow-amber-400/20"
                        data-testid="carousel-primary-cta"
                      >
                        <span className="relative z-10">{slide.primaryCta.label}</span> <ArrowRight size={18} className="ml-1 relative z-10" />
                      </BloomButton>
                    </Magnetic>
                  )}
                  <Magnetic>
                    <BloomButton
                      as={Link}
                      href={slide.secondaryCta.href}
                      className="inline-flex items-center justify-center rounded-full px-7 py-3 border border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                      data-testid="carousel-secondary-cta"
                    >
                      <span className="relative z-10">{slide.secondaryCta.label}</span>
                    </BloomButton>
                  </Magnetic>
                </div>

                {/* Credentials strip — visible on every slide */}
                <div className="mt-10 flex flex-wrap gap-2">
                  {CERTIFICATIONS.map((c) => (
                    <span
                      key={c.code}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white ring-1 ring-white/20"
                    >
                      <ShieldCheck size={12} /> {c.code}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right column — stats card, always visible */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="rounded-3xl bg-white/10 backdrop-blur ring-1 ring-white/15 p-8 shadow-2xl"
            >
              <div className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-[0.22em] font-semibold">
                <Sparkles size={14} /> Company Snapshot
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5">
                {STATS.map((s, i) => (
                  <div key={i}>
                    <div className="font-serif text-3xl text-amber-300 font-semibold">
                      {s.number}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-emerald-100/75 mt-1">
                      {s.title}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-white/15 text-sm text-emerald-100/80">
                <div className="font-serif text-white text-lg">{COMPANY.tagline}</div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  Est. {COMPANY.founded} · Headquartered in Varanasi · Pan-India Operations
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3 z-10">
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          data-testid="carousel-prev"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2" data-testid="carousel-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === i ? "w-8 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          data-testid="carousel-next"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}