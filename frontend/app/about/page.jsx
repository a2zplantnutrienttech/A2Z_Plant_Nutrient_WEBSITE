"use client";

import Link from "next/link";
import {
  ArrowRight,
  Target,
  Eye,
  Heart,
  Leaf,
  ShieldCheck,
  Users,
  Building2,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn, Stagger, StaggerItem, ScaleIn } from "@/components/Motion";
import Counter from "@/components/Counter";
import {
  WatercolorBranchLeft,
  WatercolorBranchRight,
  LeafOutlineCorner,
  LeafVeinPattern,
  OrganicWaveSeparator,
  WatercolorLeafSingle,
} from "@/components/BotanicalPatterns";
import {
  ABOUT_IMAGES,
  STATS,
  CERTIFICATIONS,
  CRAFTMYGARDEN,
  COMPANY,
} from "@/lib/mock";

export default function AboutPage() {
  const [err, setErr] = require("react").useState(null);
  
  if (err) return <div>ERROR: {err.message}</div>;

  return (
    <div data-testid="about-page">
      <PageHero title="About A2Z Plant Nutrient" subtitle="Who We Are" />

      {/* Intro */}
      <section className="relative overflow-hidden py-20 bg-white">
        {/* Subtle Botanical Accents */}
        <WatercolorBranchLeft className="absolute -left-20 -bottom-20 w-80 h-[600px] hidden md:block" opacity={0.15} />
        <WatercolorBranchRight className="absolute -right-20 -top-20 w-80 h-[600px] hidden md:block" opacity={0.15} />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <ScaleIn className="grid grid-cols-2 gap-4">
            <img src={ABOUT_IMAGES.one} alt="Project site" className="rounded-3xl aspect-[3/4] object-cover" />
            <img src={ABOUT_IMAGES.two} alt="Project site" className="rounded-3xl aspect-[3/4] object-cover mt-10" />
          </ScaleIn>
          <FadeIn>
            <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">
              About the Company
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
              A horticulture EPC partner — built for India&apos;s scale.
            </h2>
            <p className="mt-5 text-stone-600 leading-relaxed">
              <strong>{COMPANY.legalName}</strong> is a DPIIT-recognized, ISO 9001 &amp; 14001 certified private
              limited company incorporated in {COMPANY.founded}. Headquartered in Varanasi and operating across
              multiple Indian states, we deliver end-to-end horticulture contracts — landscaping, plantation, turf,
              mural art and multi-year maintenance — for government departments, PSUs and corporate campuses.
            </p>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Our in-house team of 100+ horticulturists, agronomists, gardeners and site supervisors is the
              engine behind on-time, tender-spec delivery. We are proud to have executed work for national
              agencies including NHAI, NTPC, NFL, BHEL, VDA and Hindustan Copper.
            </p>
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
                  <ShieldCheck size={12} /> {c.code} · {c.name}
                </span>
              ))}
            </div>
            <Button asChild className="mt-7 bg-emerald-700 hover:bg-emerald-800 rounded-full px-7 py-6 text-white">
              <Link href="/projects">
                See Our Projects <ArrowRight size={18} className="ml-1" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* CraftMyGarden: integrated into About */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 relative overflow-hidden">
        {/* Subtle Floating Leaf */}
        <WatercolorLeafSingle className="absolute left-10 bottom-10 w-48 h-48 hidden md:block" opacity={0.12} rotate={-15} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="mb-8 text-center">
            <p className="uppercase tracking-[0.25em] text-amber-700 text-xs font-semibold">CraftMyGarden</p>
            <h2 className="font-serif text-2xl md:text-4xl text-emerald-950 font-semibold mt-2">Residential &amp; D2C landscaping</h2>
            <p className="mt-3 text-stone-600 max-w-2xl mx-auto">{CRAFTMYGARDEN.description}</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <Card className="p-8 bg-white border-stone-200 shadow-lg">
              <h3 className="font-serif text-xl text-emerald-950 font-semibold">{CRAFTMYGARDEN.name}</h3>
              <p className="mt-2 italic text-emerald-700">{CRAFTMYGARDEN.tagline}</p>
              <p className="mt-4 text-stone-600 leading-relaxed">{CRAFTMYGARDEN.description}</p>
              <div className="mt-6 flex gap-3">
                <Button asChild className="bg-emerald-700 hover:bg-emerald-800 rounded-full">
                  <Link href="/contact">Get Notified At Launch <ArrowRight size={14} className="ml-1" /></Link>
                </Button>
                <Link href="/gallery" className="inline-flex items-center text-emerald-700 font-medium">See samples <ArrowRight size={14} className="ml-1" /></Link>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <img src="/real-courtyard-garden.jpg" alt="CraftMyGarden sample" className="rounded-2xl aspect-square object-cover" />
              <img src="/real-private-garden.jpg" alt="CraftMyGarden sample" className="rounded-2xl aspect-square object-cover" />
              <img src="/real-vertical-garden.jpg" alt="CraftMyGarden sample" className="rounded-2xl aspect-square object-cover" />
              <img src="/real-nursery-delivery.jpg" alt="CraftMyGarden sample" className="rounded-2xl aspect-square object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profile */}
      <section className="py-20 bg-stone-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">
                Leadership Team
              </p>
              <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
                Guided by Expertise &amp; Compliance.
              </h2>
              <p className="mt-5 text-stone-600 leading-relaxed">
                Founded in 2021, A2Z Plant Nutrient has rapidly scaled under executive leadership that prioritizes rigorous execution and environmental accountability. 
                Our founding team brings deep institutional credibility to every tender and project deployment.
              </p>
              
              <ul className="mt-6 space-y-4">
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <strong className="text-emerald-950 block">CII Membership</strong>
                    <span className="text-sm text-stone-600">Active membership in the Confederation of Indian Industry, ensuring alignment with national corporate standards.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Leaf size={16} />
                  </div>
                  <div>
                    <strong className="text-emerald-950 block">Carbon Footprint Certification</strong>
                    <span className="text-sm text-stone-600">Certified executive expertise in carbon footprint assessment and mitigation strategies.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <Target size={16} />
                  </div>
                  <div>
                    <strong className="text-emerald-950 block">Project Management Credentials</strong>
                    <span className="text-sm text-stone-600">Certified project management professionals guiding large-scale EPC execution.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="order-1 md:order-2 relative aspect-[4/5] md:aspect-square w-full max-w-md mx-auto md:mr-0 rounded-3xl overflow-hidden shadow-2xl">
              <img src="/real-park-worker-spray.jpg" alt="Leadership overseeing projects" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-emerald-100">
                  <h3 className="font-serif text-xl font-semibold text-emerald-950">Founding Leadership</h3>
                  <p className="text-sm text-emerald-800">Steering India&apos;s EPC Horticulture</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 bg-emerald-50/50 relative overflow-hidden">
        {/* Subtle Botanical Texture */}
        <LeafVeinPattern opacity={0.08} />
        <LeafOutlineCorner className="absolute -right-16 -bottom-16 w-80 h-80 hidden md:block" opacity={0.15} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-12">
            <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">Our North Star</p>
            <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
              Mission · Vision · Values
            </h2>
          </FadeIn>
          <Stagger className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Our Mission",
                text: "To deliver reliable, sustainable horticulture EPC — helping India's government bodies, PSUs and corporates meet their green-cover, biodiversity and ESG mandates at scale.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                text: "To be India's most trusted horticulture EPC partner — combining agronomy, design and operational excellence to shape long-lasting green infrastructure.",
              },
              {
                icon: Heart,
                title: "Our Values",
                text: "Compliance, transparency and craftsmanship. We treat every tender as a long-term partnership and every plant as a decade-long commitment.",
              },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <StaggerItem key={i}>
                  <Card className="p-8 border-stone-200 bg-white hover:shadow-xl transition-all h-full">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-5">
                      <Icon size={26} />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-emerald-950 mb-3">{b.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{b.text}</p>
                  </Card>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 relative overflow-hidden bg-white">
        {/* Organic Wave Transition */}
        <OrganicWaveSeparator className="absolute top-0 left-0 w-full h-12" opacity={0.12} />
        <WatercolorLeafSingle className="absolute right-10 bottom-10 w-48 h-48 hidden md:block" opacity={0.12} rotate={120} />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6 relative z-10">
          {STATS.map((s, i) => (
            <FadeIn key={i} delay={i * 0.05} className="text-center p-8 rounded-3xl bg-white border border-stone-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-5">
                {i === 0 ? <Building2 size={26} /> : i === 1 ? <Users size={26} /> : i === 2 ? <Leaf size={26} /> : <ShieldCheck size={26} />}
              </div>
              <div className="font-serif text-3xl lg:text-4xl text-emerald-800 font-semibold">
                {/^^\d/.test(s.number) && !s.number.includes("₹") ? <Counter to={s.number} /> : s.number}
              </div>
              <div className="mt-2 font-serif text-lg text-emerald-950">{s.title}</div>
              <p className="mt-2 text-stone-600 text-sm">{s.text}</p>
            </FadeIn>
          ))}
        </div>
      </section>

    </div>
  );
}
