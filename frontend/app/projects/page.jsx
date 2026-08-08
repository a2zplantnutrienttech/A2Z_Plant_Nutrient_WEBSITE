"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Layers, FileText, ShieldCheck } from "lucide-react";
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
import ProfileRequestModal from "@/components/ProfileRequestModal";
import ClientLogo from "@/components/ClientLogo";
import { PROJECTS, CERTIFICATIONS, TRUSTED_BY, CLIENTS } from "@/lib/mock";

export default function ProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClientClick = (clientName) => {
    // Standardize client name for matching
    const standardName = clientName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Check if there are projects matching this client
    let targetProject = null;
    
    // First pass: try to match by client name
    for (let i = 0; i < PROJECTS.length; i++) {
      if (PROJECTS[i].client.toLowerCase().includes(clientName.toLowerCase()) || 
          clientName.toLowerCase().includes(PROJECTS[i].client.toLowerCase())) {
        targetProject = PROJECTS[i];
        break;
      }
    }
    
    // Second pass: try to match by specific mappings if exact match fails
    if (!targetProject) {
      if (standardName.includes('nhai')) targetProject = PROJECTS.find(p => p.client === 'NHAI');
      else if (standardName.includes('ntpc')) targetProject = PROJECTS.find(p => p.client === 'NTPC');
      else if (standardName.includes('nfl')) targetProject = PROJECTS.find(p => p.client === 'NFL');
      else if (standardName.includes('iocl') || standardName.includes('indian-oil')) targetProject = PROJECTS.find(p => p.client === 'Indian Oil (IOCL)');
      else if (standardName.includes('nbcc')) targetProject = PROJECTS.find(p => p.client === 'NBCC');
    }
    
    if (targetProject) {
      const el = document.getElementById(`project-${targetProject.slug}`);
      if (el) {
        // Calculate offset to account for sticky header
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        
        // Add a highlight animation class temporarily
        el.classList.add('ring-4', 'ring-emerald-500', 'ring-offset-4', 'scale-[1.02]');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4', 'scale-[1.02]');
        }, 2000);
        
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div data-testid="projects-page">
      <PageHero title="Projects & Portfolio" subtitle="Selected EPC Work" />

      <section className="relative overflow-hidden py-14 bg-white">
        {/* Subtle Botanical Background elements */}
        <WatercolorBranchLeft className="absolute -left-20 top-20 w-80 h-[600px] hidden md:block" opacity={0.15} />
        <WatercolorBranchRight className="absolute -right-20 top-[350px] w-80 h-[600px] hidden md:block" opacity={0.15} />
        <LeafOutlineCorner className="absolute -left-20 bottom-10 w-96 h-96 hidden md:block" opacity={0.15} />
        <LeafVeinPattern opacity={0.08} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="max-w-3xl">
            <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">
              Government · PSU · Corporate
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
              Green Infrastructure At Scale.
            </h2>
            <p className="mt-5 text-stone-600 leading-relaxed">
              A snapshot of horticulture EPC contracts A2Z Plant Nutrient has executed for
              national agencies, PSUs and corporate clients across multiple Indian states.
              Full case studies and PO copies are shared with procurement teams on request.
            </p>
          </FadeIn>

        {/* Procurement quick-request banner */}
        <FadeIn className="mt-10">
          <Card className="p-6 md:p-8 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 grid md:grid-cols-[1fr_auto] gap-6 items-center" data-testid="procurement-banner">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] bg-amber-400/90 text-emerald-950 px-2.5 py-1 rounded-full">
                  Procurement Officers
                </span>
                <div className="flex gap-1.5">
                  {CERTIFICATIONS.slice(0, 3).map((c) => (
                    <span key={c.code} className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={10} /> {c.code}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-emerald-950 font-semibold leading-tight">
                Instantly Download Our Full Company Profile
              </h3>
              <p className="mt-2 text-stone-600 text-sm md:text-base">
                CIN, GSTIN, Udyam Registration, ISO 9001 &amp; 14001 references, DPIIT recognition,
                past PO summary, workforce declaration and financials — in a single printable PDF.
              </p>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 rounded-full px-7 py-6 whitespace-nowrap"
              data-testid="request-profile-btn"
            >
              <FileText size={16} className="mr-2" /> Request Company Profile
            </Button>
          </Card>
        </FadeIn>

        {/* Trusted-by clients grid (real wordmark logos) */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-[0.28em] text-stone-500 font-semibold">
              Institutional Clients
            </span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TRUSTED_BY.slice(0, 19).map((c) => {
              const label = c.name.replace(/\(.*?\)/g, "").trim();
              const short = c.sector?.split(" · ")[0] || "Client";
              return (
                <button
                  key={c.name}
                  onClick={() => handleClientClick(c.name)}
                  className="w-full h-24 rounded-xl bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all px-4 py-3 flex flex-col items-center justify-center cursor-pointer transform hover:-translate-y-1 active:scale-95 overflow-hidden relative group"
                  data-testid={`projects-client-tag-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  {c.logo ? (
                    <>
                      <div className="relative w-full h-12 flex items-center justify-center">
                        <img 
                          src={c.logo} 
                          alt={`${c.name} logo`} 
                          className="max-h-full max-w-full object-contain opacity-85 group-hover:opacity-100 transition-all duration-300"
                        />
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.16em] text-stone-500 mt-2 font-semibold">
                        {short}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-serif text-emerald-950 text-lg font-semibold leading-none tracking-tight">
                        {label.length > 22 ? label.slice(0, 20) + "…" : label}
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.16em] text-stone-500 mt-2 font-semibold">
                        {short}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects grid */}
        <Stagger className="grid md:grid-cols-2 gap-6 mt-14" data-testid="projects-grid">
          {PROJECTS.map((p) => (
            <StaggerItem key={p.slug}>
              <Card 
                id={`project-${p.slug}`}
                className="group overflow-hidden border-stone-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 h-full bg-white relative z-10" 
                data-testid={`project-${p.slug}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider bg-white/95 text-emerald-800 px-3 py-1 rounded-full">
                      {p.client}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif text-2xl font-semibold leading-tight">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs mt-2 text-emerald-100/90">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {p.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {p.year}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start gap-2 mb-4">
                    <Layers className="text-emerald-700 mt-0.5 shrink-0" size={16} />
                    <p className="text-stone-600 text-sm leading-relaxed">{p.scope}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
                    {p.metrics.map((m, i) => (
                      <div key={i}>
                        <div className="font-serif text-2xl text-emerald-800 font-semibold">
                          {m.value}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-stone-500 mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 rounded-3xl bg-emerald-950 text-white p-10 md:p-14 grid md:grid-cols-2 gap-8 items-center"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-400/90 text-emerald-950 px-3 py-1 rounded-full">
              Empanelment / Vendor Onboarding
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-semibold mt-4 leading-tight">
              Evaluating Vendors For A Horticulture Tender?
            </h3>
            <p className="mt-3 text-emerald-200/85">
              We share our full profile — ISO certificates, DPIIT recognition, GSTIN, PO copies,
              workforce affidavits and financials — with procurement teams on request.
            </p>
          </div>
          <div className="flex md:justify-end gap-3 flex-wrap">
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 rounded-full px-7 py-6"
              data-testid="cta-request-profile"
            >
              <FileText size={16} className="mr-2" /> Get Company Profile
            </Button>
            <Button asChild variant="outline" className="rounded-full px-7 py-6 border-emerald-700 text-white hover:bg-emerald-800 bg-transparent">
              <Link href="/contact">
                Contact Us <ArrowRight size={18} className="ml-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
        </div>
      </section>

      <ProfileRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
