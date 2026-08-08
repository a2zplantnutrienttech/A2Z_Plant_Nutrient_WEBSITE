"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Award,
  MapPin,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FadeIn, Stagger, StaggerItem } from "@/components/Motion";
import { useEffect, useState } from "react";

// Actual institutional & private client logos — files live in /public/logos/
const TRUSTED_LOGOS = [
  { name: "NHAI", alt: "National Highways Authority of India", src: "/logos/nhai-logo.png", x: -257, y: 248, size: 154 },
  { name: "NTPC", alt: "NTPC Limited", src: "/logos/ntpc-logo.png", x: -331, y: 77, size: 158 },
  { name: "NFL", alt: "National Fertilizers Limited", src: "/logos/nfl-logo.png", x: 386, y: 7, size: 174 },
  { name: "BHEL", alt: "Bharat Heavy Electricals Limited", src: "/logos/bhel-logo.png", x: 167, y: 267, size: 177 },
  { name: "IndianOil", alt: "Indian Oil Corporation Limited", src: "/logos/indian-oil-logo.png", x: 367, y: 209, size: 174 },
  { name: "Indian Railways", alt: "Indian Railways", src: "/logos/indian-railways-logo.png", x: 147, y: -69, size: 168 },
  { name: "NBCC", alt: "National Buildings Construction Corporation", src: "/logos/nbcc-logo.png", x: -262, y: -268, size: 165 },
  { name: "GSECL", alt: "Gujarat State Electricity Corporation Ltd.", src: "/logos/gsecl.png", x: -394, y: -125, size: 146 },
  { name: "TCIL", alt: "Telecommunications Consultants India Ltd.", src: "/logos/tcil-logo.png", x: 228, y: 89, size: 137 },
  { name: "Rajasthan Housing Board", alt: "Rajasthan Housing Board", src: "/logos/rhb-logo.png", x: 491, y: -136, size: 130 },
  { name: "Nagar Nigam Varanasi", alt: "Nagar Nigam Varanasi", src: "/logos/nagar-nigam-varanasi.jpg", x: -75, y: -220, size: 157 },
  { name: "Chhavni Parishad Varanasi", alt: "Cantonment Board Varanasi", src: "/logos/chavani-logo.png", x: -211, y: -79, size: 182 },
  { name: "Govt of Uttar Pradesh", alt: "Government of Uttar Pradesh", src: "/logos/up-logo.png", x: -42, y: 279, size: 173 },
  { name: "Sewa International", alt: "Sewa International", src: "/logos/sewa-international.png", x: -138, y: 101, size: 175 },
  { name: "CSIL", alt: "C. S. Intraconstruction Limited", src: "/logos/csil.png", x: 309, y: -190, size: 187 },
  { name: "Sunbeam", alt: "Sunbeam Group of Educational Institutions", src: "/logos/sunbeam.png", x: 54, y: 103, size: 175 },
  { name: "Shaparth", alt: "Shaparth", src: "/logos/shapearth.png", x: -31, y: -53, size: 135 },
  { name: "Shivalik", alt: "Shivalik", src: "/logos/shivalik.png", x: -513, y: 20, size: 169 },
  { name: "Castillo", alt: "Castillo", src: "/logos/castillo.png", x: 112, y: -260, size: 170 },
];

export default function TrustedBy({ onRequestProfile }) {
  const [scale, setScale] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      // Adjust scale to ensure the 1200px wide cluster fits.
      if (width < 400) setScale(0.35); // Adjusted for very small screens so it fits without cropping
      else if (width < 640) setScale(0.45); // Standard mobile
      else if (width < 768) setScale(0.65);
      else if (width < 1024) setScale(0.8);
      else if (width < 1280) setScale(0.95);
      else setScale(1);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-emerald-950 text-white py-20 md:py-28"
      id="trusted-by"
      data-testid="trusted-by-section"
    >
      {/* Ambient gradient glows — pure emerald palette */}
      <div
        aria-hidden
        className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-10 -right-32 w-96 h-96 rounded-full bg-amber-300/10 blur-3xl pointer-events-none"
      />
      {/* Grid dot texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Eyebrow + headline + Description */}
        <FadeIn className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.24em] bg-white/10 text-amber-200 px-3 py-1.5 rounded-full ring-1 ring-white/10">
              <Sparkles size={10} /> Since 2021
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.24em] bg-white/10 text-emerald-200 px-3 py-1.5 rounded-full ring-1 ring-white/10">
              <ShieldCheck size={10} /> Pan-India Operations
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
            The Institutions That Build India{" "}
            <span className="italic text-amber-300">Trust A2Z</span> With Their
            Green Mandate.
          </h2>
          <p className="mt-5 text-lg text-emerald-100/80 leading-relaxed max-w-2xl">
            From National Highway Corridors To Navratna CPSE Campuses — A2Z Plant
            Nutrient Is The Preferred Horticulture EPC Partner For India&apos;s
            Most-Scrutinised Procurement Teams.
          </p>
        </FadeIn>

        {/* Animated Premium Logo Scatter Layout */}
        <div className="relative w-full h-[350px] sm:h-[400px] md:h-[700px] flex items-center justify-center mt-12 md:mt-24 mb-10 overflow-visible mx-auto">
          <div 
            className="absolute w-[1200px] h-[700px] flex items-center justify-center transition-transform duration-300 origin-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: `scale(${scale}) translate(-50%, -50%)`, transformOrigin: '0 0' }}
          >
            {/* Scattered Logos */}
            {isMounted && TRUSTED_LOGOS.map((logo, i) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "100px" }}
                transition={{ 
                  delay: i * 0.05, 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15 
                }}
                className="absolute z-10"
                style={{
                  width: logo.size,
                  height: logo.size,
                  x: logo.x,
                  y: logo.y,
                  // offset half of size so x/y represents the center of the circle
                  marginLeft: -(logo.size / 2),
                  marginTop: -(logo.size / 2)
                }}
              >
                <motion.div
                  animate={{ 
                    y: [-8, 8, -8],
                    rotate: [-1.5, 1.5, -1.5]
                  }}
                  transition={{ 
                    duration: 5 + (i % 4), 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: (i % 2) * 0.5 
                  }}
                  className="w-full h-full rounded-full bg-white hover:scale-105 shadow-[0_12px_40px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden transition-all duration-300 group cursor-pointer"
                  title={logo.alt}
                >
                  {/* Made the inner container wider to allow the logo to be very visible */}
                  <div className="relative w-[85%] h-[85%] flex items-center justify-center">
                    {/* mix-blend-multiply merges white background cleanly with the white tile */}
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Proof numbers row */}
        <FadeIn delay={0.1} className="grid grid-cols-3 md:grid-cols-6 gap-6 py-8 border-y border-white/10 z-30 relative">
          {[
            { n: "19+", l: "Institutional Clients" },
            { n: "100+", l: "Projects Delivered" },
            { n: "6+", l: "States Served" },
            { n: "10L+", l: "Sq. Ft. Transformed" },
            { n: "ISO", l: "9001 · 14001" },
            { n: "DPIIT", l: "Startup India" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-2xl md:text-3xl text-amber-300 font-semibold">
                {s.n}
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-emerald-200/70 mt-1 leading-tight">
                {s.l}
              </div>
            </div>
          ))}
        </FadeIn>

        {/* Featured project + CTA — inside the dark section for continuity */}
        <FadeIn className="mt-14 z-30 relative">
          <div className="rounded-3xl bg-white/[0.04] ring-1 ring-white/10 backdrop-blur p-8 md:p-10 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] bg-amber-400 text-emerald-950 px-3 py-1.5 rounded-full">
                  <MapPin size={10} /> Featured Delivery
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold leading-tight">
                10,000+ Plants Installed Along The Ayodhya–Basti National Highway.
              </h3>
              <p className="mt-3 text-emerald-100/75 leading-relaxed">
                Delivered for the National Highways Authority of India with
                survival-linked maintenance — one of a dozen active mandates A2Z
                executes for the country&apos;s ministries and Navratna CPSEs.
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="font-serif text-xl md:text-2xl text-amber-300 font-semibold">
                    Native
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-200/70">
                    Species Installed
                  </div>
                </div>
                <div>
                  <div className="font-serif text-xl md:text-2xl text-amber-300 font-semibold">
                    3 Years
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-200/70">
                    Survival AMC
                  </div>
                </div>
                <div>
                  <div className="font-serif text-xl md:text-2xl text-amber-300 font-semibold">
                    NHAI
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-200/70">
                    Project Mandate
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={onRequestProfile}
                className="bg-amber-400 hover:bg-amber-500 text-emerald-950 rounded-full px-7 py-6 font-semibold shadow-lg shadow-amber-400/20"
                data-testid="trusted-by-request-btn"
              >
                <FileText size={16} className="mr-2" /> Download Company Profile
              </Button>
              <a
                href="/projects"
                className="text-center text-sm text-emerald-200 hover:text-amber-200 font-medium inline-flex items-center justify-center gap-1 transition-colors"
              >
                View All Named Projects <ArrowRight size={14} />
              </a>
              <p className="text-xs text-emerald-200/60 mt-2 leading-relaxed text-center">
                Full A2Z profile with ISO certificates, client list &amp; PO
                summary — in one PDF, in seconds.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}