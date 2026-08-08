"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { TextReveal } from "@/components/Motion";

export default function PageHero({ title, subtitle }) {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 border-b border-stone-200"
      data-testid="page-hero"
    >
      <div className="absolute top-10 -left-20 w-72 h-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute bottom-0 -right-20 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl" />

      <motion.div
        className="absolute top-12 right-10 text-emerald-300/40"
        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        aria-hidden
      >
        <Leaf size={56} />
      </motion.div>
      <motion.div
        className="absolute bottom-8 left-8 text-emerald-400/40"
        animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 8.5, ease: "easeInOut", delay: 1 }}
        aria-hidden
      >
        <Leaf size={42} />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium uppercase tracking-[0.18em]"
        >
          <Leaf size={14} /> {subtitle}
        </motion.span>
        <TextReveal
          delay={0.1}
          className="mt-5 font-serif text-4xl md:text-6xl text-emerald-950 font-semibold leading-[1.1] justify-center"
        >
          {title}
        </TextReveal>
      </div>
    </section>
  );
}
