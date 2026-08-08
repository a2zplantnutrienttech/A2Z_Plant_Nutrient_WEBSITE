"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/Motion";
import {
  WatercolorBranchLeft,
  WatercolorBranchRight,
  LeafOutlineCorner,
  LeafVeinPattern,
  OrganicWaveSeparator,
  WatercolorLeafSingle,
} from "@/components/BotanicalPatterns";
import { fetchMedia } from "@/lib/api";
import { GALLERY as FALLBACK_GALLERY } from "@/lib/mock";

export default function GalleryPage() {
  const [active, setActive] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetchMedia({ limit: 500 })
      .then((d) => setMedia(d || []))
      .catch(() => setMedia([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (active) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [active]);

  // Fallback to local images if backend has nothing
  const items =
    media.length > 0
      ? media
      : FALLBACK_GALLERY.map((item, i) => ({
          id: `f-${i}`,
          title: item.title || `Project ${i + 1}`,
          data: item.src || item,
          media_type: "image",
          category: item.category || "Gallery",
          description: item.caption || "",
        }));

  return (
    <div data-testid="gallery-page">
      <PageHero title="Gallery" subtitle="Our Projects" />
      <section className="relative overflow-hidden py-20 bg-white">
        {/* Subtle Botanical Accents */}
        <WatercolorBranchLeft className="absolute -left-20 bottom-10 w-80 h-[500px] hidden md:block" opacity={0.15} />
        <WatercolorBranchRight className="absolute -right-20 top-20 w-80 h-[500px] hidden md:block" opacity={0.15} />
        <LeafVeinPattern opacity={0.08} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-12">
          <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">
            Our Work
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
            A glimpse into our garden of creations
          </h2>
          <p className="mt-5 text-stone-600 max-w-xl mx-auto">
            Browse a curated selection of landscapes, plantations and murals we&apos;ve
            crafted across Varanasi.
          </p>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="mt-5 rounded-full border-emerald-700 text-emerald-700 hover:bg-emerald-50"
            data-testid="gallery-projects-btn"
          >
            <Link href="/projects">
              <Plus size={14} className="mr-1" /> See Named Projects
            </Link>
          </Button>
        </FadeIn>

        {loading ? (
          <div className="py-20 text-center text-stone-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} /> Loading gallery…
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5" data-testid="gallery-grid">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 6) * 0.05, duration: 0.6 }}
                onClick={() => setActive(item)}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl"
              >
                {item.media_type === "video" ? (
                  <video
                    src={item.data}
                    className="w-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img
                    src={item.data}
                    alt={item.title || `Gallery ${i + 1}`}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/60 transition-colors flex flex-col justify-end p-5">
                  <div className="text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-[10px] uppercase tracking-wider text-amber-300 font-semibold">
                      {item.category}
                    </div>
                    <div className="font-serif text-lg leading-tight mt-1">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-emerald-100/80 mt-1 leading-snug line-clamp-2">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </div>

        {mounted && active && createPortal(
          <div
            className="fixed inset-0 z-[100] bg-emerald-950/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, height: '100vh', width: '100vw' }}
            onClick={() => setActive(null)}
          >
            <button
              aria-label="Close"
              className="absolute top-6 right-6 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 z-50"
              onClick={() => setActive(null)}
            >
              <X size={22} />
            </button>
            <div className="relative max-h-[90vh] max-w-[90vw] flex items-center justify-center m-auto" onClick={(e) => e.stopPropagation()}>
              {active.media_type === "video" ? (
                <video
                  src={active.data}
                  controls
                  autoPlay
                  className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain m-auto"
                />
              ) : (
                <img
                  src={active.data}
                  alt={active.title || "Preview"}
                  className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain m-auto"
                />
              )}
            </div>
          </div>,
          document.body
        )}
      </section>
    </div>
  );
}
