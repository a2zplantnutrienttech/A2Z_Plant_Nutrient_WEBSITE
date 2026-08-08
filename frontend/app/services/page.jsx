"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Building2, Home } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn, Stagger, StaggerItem } from "@/components/Motion";
import {
  WatercolorBranchLeft,
  WatercolorBranchRight,
  LeafOutlineCorner,
  LeafVeinPattern,
  OrganicWaveSeparator,
  WatercolorLeafSingle,
} from "@/components/BotanicalPatterns";
import { SERVICES, CRAFTMYGARDEN, CERTIFICATIONS } from "@/lib/mock";

export default function ServicesPage() {
  const reasons = [
    "ISO 9001 & 14001 certified — audit-ready processes",
    "DPIIT-recognized, Udyam-registered private limited company",
    "In-house workforce of 100+ across states — direct execution, no third-party risk",
    "Transparent tender-spec compliance and PO-linked deliverables",
    "Long-term maintenance contracts with digital reporting",
  ];

  return (
    <div data-testid="services-page">
      <PageHero title="EPC Services" subtitle="What We Deliver" />

      <section className="relative overflow-hidden py-14 bg-white">
        {/* Subtle Botanical Accents */}
        <WatercolorBranchLeft className="absolute -left-20 -bottom-20 w-80 h-[500px] hidden md:block" opacity={0.15} />
        <WatercolorBranchRight className="absolute -right-20 -top-20 w-80 h-[500px] hidden md:block" opacity={0.15} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="max-w-3xl">
            <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">Two Clear Tracks</p>
            <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
              EPC For Institutions. A Dedicated Brand For Homes.
            </h2>
            <p className="mt-5 text-stone-600 leading-relaxed">
              Our core business is horticulture EPC for government, PSU and corporate clients. Residential
              services are being built into a dedicated brand — {CRAFTMYGARDEN.name} — launching soon.
            </p>
          </FadeIn>

          {/* Track selector cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <FadeIn>
              <Card className="p-8 border-stone-200 bg-emerald-950 text-white h-full shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-300 font-semibold">Track 01 · Active</div>
                </div>
                <h3 className="font-serif text-2xl mt-4">Government · PSU · Corporate EPC</h3>
                <p className="mt-3 text-emerald-100/85 text-sm leading-relaxed">
                  Landscape, plantation and maintenance contracts delivered under tender, with certified processes
                  and long-term SLAs.
                </p>
                <Button asChild className="mt-6 bg-amber-400 hover:bg-amber-500 text-emerald-950 rounded-full">
                  <Link href="/projects">See Projects <ArrowRight size={16} className="ml-1" /></Link>
                </Button>
              </Card>
            </FadeIn>
            <FadeIn delay={0.05}>
              <Card className="p-8 border-stone-200 bg-white h-full shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
                    <Home size={24} />
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-amber-700 font-semibold">Track 02 · Coming Soon</div>
                </div>
                <h3 className="font-serif text-2xl mt-4 text-emerald-950">{CRAFTMYGARDEN.name}</h3>
                <p className="mt-3 text-stone-600 text-sm leading-relaxed">
                  Our upcoming direct-to-consumer brand for residential landscaping, indoor plants, curated
                  gifting and garden care.
                </p>
                <Button asChild variant="outline" className="mt-6 rounded-full border-emerald-700 text-emerald-700 hover:bg-emerald-50">
                  <Link href="/contact">Get Launch Updates <ArrowRight size={16} className="ml-1" /></Link>
                </Button>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* EPC Services grid */}
      <section className="relative overflow-hidden py-20 bg-stone-50/50">
        {/* Subtle Background Texture */}
        <LeafVeinPattern opacity={0.08} />
        <WatercolorLeafSingle className="absolute -left-10 bottom-10 w-52 h-52 hidden md:block" opacity={0.12} rotate={30} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-12">
            <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">EPC Portfolio</p>
            <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
              Our Signature EPC Services
            </h2>
          </FadeIn>
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-7" data-testid="services-grid">
            {SERVICES.map((s) => (
              <StaggerItem key={s.slug}>
                <Card className="group overflow-hidden border-stone-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] uppercase tracking-wider bg-white/95 text-emerald-800 px-2 py-1 rounded-full font-semibold">
                        {s.track}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-semibold text-emerald-950 mb-3">{s.title}</h3>
                    <p className="text-stone-600 leading-relaxed text-[15px]">{s.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <Link href="/contact" className="inline-flex items-center gap-1 text-emerald-700 font-medium text-sm">
                        Learn More <ArrowRight size={14} />
                      </Link>
                      <Button
                        asChild
                        size="sm"
                        className="bg-emerald-700 hover:bg-emerald-800 rounded-full"
                        data-testid={`service-quote-${s.slug}`}
                      >
                        <Link href="/contact">Get A Quote</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        {/* Elegant Wavy Section Splitter */}
        <OrganicWaveSeparator className="absolute bottom-0 left-0 w-full h-16" opacity={0.12} />
      </section>

      {/* Why Us */}
      <section className="relative overflow-hidden py-20 bg-emerald-50/40">
        {/* Corner Leaf Outline */}
        <LeafOutlineCorner className="absolute -right-20 -bottom-20 w-96 h-96 hidden md:block" opacity={0.15} />
        <WatercolorLeafSingle className="absolute -left-20 bottom-10 w-64 h-64 hidden md:block" opacity={0.12} rotate={-45} />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <FadeIn>
            <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">Why Procurement Teams Choose Us</p>
            <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
              Audit-Ready. Tender-Compliant. Field-Proven.
            </h2>
            <p className="mt-5 text-stone-600 leading-relaxed">
              We combine horticultural expertise with the paperwork and process discipline that
              government and PSU procurement teams need.
            </p>
            <ul className="mt-6 space-y-3">
              {reasons.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-stone-700">
                  <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 shrink-0" /> {p}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
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
            <Button asChild className="mt-8 bg-emerald-700 hover:bg-emerald-800 rounded-full px-7 py-6 text-white">
              <Link href="/contact">Start A Conversation <ArrowRight size={18} className="ml-1" /></Link>
            </Button>
          </FadeIn>
          <FadeIn className="grid grid-cols-2 gap-4">
            <img src={SERVICES[0].image} alt="Landscape" className="rounded-3xl aspect-square object-cover" />
            <img src={SERVICES[3].image} alt="Court" className="rounded-3xl aspect-square object-cover mt-10" />
            <img src={SERVICES[2].image} alt="Turf" className="rounded-3xl aspect-square object-cover" />
            <img src={SERVICES[5].image} alt="Mural" className="rounded-3xl aspect-square object-cover mt-10" />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
