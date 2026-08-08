"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sprout,
  Hammer,
  Leaf,
  Sparkles,
  ShieldCheck,
  Award,
  Building2,
  Users,
  CalendarDays,
  User as UserIcon,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeIn, Stagger, StaggerItem, ScaleIn, TextReveal } from "@/components/Motion";
import { Magnetic, BloomButton } from "@/components/Interactive";
import Counter from "@/components/Counter";
import HeroCarousel from "@/components/HeroCarousel";
import TrustedBy from "@/components/TrustedBy";
import ProfileRequestModal from "@/components/ProfileRequestModal";
import {
  WatercolorBranchLeft,
  WatercolorBranchRight,
  LeafOutlineCorner,
  LeafVeinPattern,
  OrganicWaveSeparator,
  WatercolorLeafSingle,
} from "@/components/BotanicalPatterns";
import {
  FEATURES,
  ABOUT_IMAGES,
  SERVICES,
  STATS,
  PROJECTS,
  CRAFTMYGARDEN,
  COMPANY,
} from "@/lib/mock";
import { fetchBlogs } from "@/lib/api";

const iconMap = { Sprout, Hammer, Leaf, Sparkles };

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    fetchBlogs()
      .then((data) => setBlogs((data || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-stone-50" data-testid="home-page">
      {/* NEW: Auto-playing hero carousel with 4 slides */}
      <HeroCarousel onRequestProfile={() => setProfileOpen(true)} />

      {/* TRUSTED BY (dedicated section, moved out of hero) */}
      <TrustedBy onRequestProfile={() => setProfileOpen(true)} />

      {/* FEATURES */}
      <section className="relative overflow-hidden py-20 bg-white">
        {/* Subtle Botanical Accents */}
        <WatercolorBranchLeft className="absolute -left-20 -bottom-20 w-80 h-[600px] hidden md:block" opacity={0.15} />
        <WatercolorBranchRight className="absolute -right-20 -top-20 w-80 h-[600px] hidden md:block" opacity={0.15} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-base font-bold uppercase tracking-[0.2em] mb-4">Why A2Z</span>
            <TextReveal className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight justify-center">
              EPC-Grade Horticulture, Executed Reliably
            </TextReveal>
          </FadeIn>
          <Stagger className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = iconMap[f.icon] || Leaf;
              return (
                <StaggerItem key={i}>
                  <Card className="group p-8 border-stone-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white h-full">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-700 mb-5 transition-colors group-hover:rotate-6">
                      <Icon size={26} />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-emerald-950 mb-3">{f.title}</h3>
                    <p className="text-stone-600 leading-relaxed text-[15px]">{f.text}</p>
                  </Card>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* PROJECTS PREVIEW */}
      <section className="py-20 bg-stone-50 relative overflow-hidden">
        {/* Subtle Botanical Texture and Waves */}
        <LeafVeinPattern opacity={0.08} />
        <WatercolorLeafSingle className="absolute -left-20 top-20 w-72 h-72 hidden md:block" opacity={0.12} rotate={15} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-base font-bold uppercase tracking-[0.2em] mb-4">Selected Work</span>
              <TextReveal className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
                Government &amp; PSU Projects
              </TextReveal>
              <p className="mt-3 text-stone-600 max-w-xl">
                A snapshot of horticulture EPC contracts we&apos;ve executed for national agencies and corporate clients.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full border-emerald-700 text-emerald-700 hover:bg-emerald-50 self-start md:self-auto">
              <Link href="/projects">All Projects <ArrowRight size={16} className="ml-1" /></Link>
            </Button>
          </FadeIn>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="home-projects">
            {PROJECTS.slice(0, 3).map((p) => (
              <StaggerItem key={p.slug}>
                <Card className="group overflow-hidden border-stone-200 hover:shadow-2xl transition-all hover:-translate-y-1 h-full bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/10 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-semibold uppercase tracking-wider bg-white/95 text-emerald-800 px-2.5 py-1 rounded-full">{p.client}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-stone-500 uppercase tracking-wider">{p.location} · {p.year}</div>
                    <h3 className="mt-2 font-serif text-xl font-semibold text-emerald-950">{p.title}</h3>
                    <p className="mt-2 text-stone-600 text-sm line-clamp-2">{p.scope}</p>
                    <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                      {p.metrics.map((m, i) => (
                        <div key={i} className={i === p.metrics.length - 1 ? "text-right" : "text-left"}>
                          <div className="font-serif text-lg text-emerald-800 font-semibold">{m.value}</div>
                          <div className="text-[10px] uppercase tracking-wider text-stone-500">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        {/* Organic Section Transition */}
        <OrganicWaveSeparator className="absolute bottom-0 left-0 w-full h-16" opacity={0.12} />
      </section>

      {/* ABOUT */}
      <section className="relative overflow-hidden py-20 bg-white">
        {/* Subtle Botanical Corner Elements */}
        <LeafOutlineCorner className="absolute -right-16 -bottom-16 w-80 h-80 hidden md:block" opacity={0.15} />
        <WatercolorLeafSingle className="absolute -left-20 bottom-10 w-64 h-64 hidden md:block" opacity={0.12} rotate={-30} />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center relative z-10">
          <ScaleIn className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src={ABOUT_IMAGES.one} alt="Project site" className="rounded-3xl aspect-[3/4] object-cover w-full" />
              <img src={ABOUT_IMAGES.two} alt="Project site" className="rounded-3xl aspect-[3/4] object-cover w-full mt-8" />
            </div>
            <div className="absolute -bottom-6 left-6 bg-white shadow-xl rounded-2xl px-6 py-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center text-white">
                <Users size={22} />
              </div>
              <div>
                <div className="font-serif text-2xl text-emerald-900 font-bold">100+</div>
                <div className="text-xs uppercase tracking-wider text-stone-500">Projects Delivered</div>
              </div>
            </div>
          </ScaleIn>
          <FadeIn>
            <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-base font-bold uppercase tracking-[0.2em] mb-4">Who We Are</span>
            <TextReveal className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">
              An EPC Partner Built For India&apos;s Green Mandates
            </TextReveal>
            <p className="mt-5 text-stone-600 leading-relaxed">
              A2Z Plant Nutrient Private Limited is a Startup India-recognised, ISO 9001 &amp; 14001 certified horticulture EPC partner headquartered in Varanasi and operating across multiple Indian states.
            </p>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Since incorporation in 2021, we&apos;ve delivered 100+ projects — with named work for NHAI, NTPC, NBCC, Indian Oil, BHEL, NFL and the Rajasthan Housing Board.
            </p>
            <Button asChild className="mt-7 bg-emerald-700 hover:bg-emerald-800 rounded-full px-7 py-6 text-white">
              <Link href="/about">Learn More About Us <ArrowRight size={18} className="ml-1" /></Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Subtle Botanical Accents */}
        <WatercolorBranchRight className="absolute -left-16 -top-20 w-80 h-[600px] hidden md:block scale-x-[-1]" opacity={0.15} />
        <LeafOutlineCorner className="absolute -right-20 -bottom-20 w-96 h-96 hidden md:block" opacity={0.15} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-base font-bold uppercase tracking-[0.2em] mb-4">What We Do</span>
              <TextReveal className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight justify-center">Our EPC Service Portfolio</TextReveal>
              <p className="mt-4 text-stone-600">End-to-end horticulture contracting for public and private institutions.</p>
            </div>
            <Button asChild variant="outline" className="rounded-full border-emerald-700 text-emerald-700 hover:bg-emerald-50 self-start md:self-auto">
              <Link href="/services">View All Services <ArrowRight size={16} className="ml-1" /></Link>
            </Button>
          </FadeIn>
          
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {SERVICES.slice(0, 3).map((s) => (
              <StaggerItem key={s.slug}>
                <Card className="group overflow-hidden border-stone-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-[10px] uppercase tracking-wider text-amber-300">{s.track}</div>
                      <h3 className="font-serif text-xl text-white font-semibold">{s.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">{s.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Link href="/services" className="inline-flex items-center gap-1 text-emerald-700 font-medium text-sm">
                        Learn More <ArrowRight size={14} />
                      </Link>
                      <Button asChild size="sm" className="bg-emerald-700 hover:bg-emerald-800 rounded-full">
                        <Link href="/contact">Get A Quote</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          {/* PREMIUM PROCESS SECTION */}
          <div className="border-t border-stone-200 pt-20 mt-10">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-[0.2em] mb-4">The EPC Blueprint</span>
              <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">From Soil to Scenery</h2>
              <p className="mt-4 text-stone-600 text-lg">A systematic, engineering-led methodology transforming raw terrain into thriving, sustainable ecosystems.</p>
            </FadeIn>
            
            <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {[
                { step: "01", title: "Site Audit", desc: "Scientific soil & terrain analysis, assessing microclimates and environmental constraints.", img: "https://res.cloudinary.com/ckeyebqv/image/upload/v1786219643/a2z/process/ti4oc7nlotcycizfecu8.png" },
                { step: "02", title: "Design Strategy", desc: "Custom, compliant blueprints mapping out sustainable, long-term green infrastructure.", img: "https://res.cloudinary.com/ckeyebqv/image/upload/v1786219661/a2z/process/shqg0osprprhs59431ca.png" },
                { step: "03", title: "Procurement", desc: "Sourcing premium, climate-resilient native flora direct from our audited nursery network.", img: "https://res.cloudinary.com/ckeyebqv/image/upload/v1786219678/a2z/process/v8emc19jfdri2pmxikqe.png" },
                { step: "04", title: "Execution", desc: "Precision heavy hardscaping, structural soil amendments, and rapid plantation.", img: "https://res.cloudinary.com/ckeyebqv/image/upload/v1786219695/a2z/process/i9y5vkfqigufsseliu3o.png" },
                { step: "05", title: "Handover", desc: "Seamless project delivery with rigorous quality sign-offs and digital geotagged reports.", img: "https://res.cloudinary.com/ckeyebqv/image/upload/v1786219710/a2z/process/kmqubll4fjqtrlgwmzq2.png" },
                { step: "06", title: "Maintenance", desc: "Multi-year AMC providing continuous agronomic care to guarantee survival and growth.", img: "https://res.cloudinary.com/ckeyebqv/image/upload/v1786219726/a2z/process/knhietdntvuqrydnynce.png" },
              ].map((p, i) => (
                <StaggerItem key={i} className="relative z-10 h-full">
                  <div className="group rounded-2xl overflow-hidden bg-stone-50 border border-stone-200 hover:shadow-xl hover:border-emerald-300 transition-all duration-500 h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent opacity-80" />
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-serif font-bold border border-white/30">
                        {p.step}
                      </div>
                      <div className="absolute bottom-4 left-5 right-5">
                        <h4 className="font-serif text-2xl text-white font-semibold">{p.title}</h4>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-stone-600 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* CRAFTMYGARDEN TEASER */}
      <section className="py-12 bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 relative overflow-hidden" data-testid="craftmygarden-teaser">
        {/* Subtle Floating Leaf */}
        <WatercolorLeafSingle className="absolute right-10 top-10 w-48 h-48 hidden md:block" opacity={0.12} rotate={60} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <FadeIn>
            <Card className="relative overflow-hidden p-8 md:p-10 border-none shadow-lg grid md:grid-cols-2 gap-8 items-center bg-white">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  Coming Soon
                </span>
                <TextReveal className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-4 leading-tight">
                  {CRAFTMYGARDEN.name}
                </TextReveal>
                <p className="mt-3 font-serif italic text-emerald-700 text-lg">{CRAFTMYGARDEN.tagline}</p>
                <p className="mt-4 text-stone-600 leading-relaxed">{CRAFTMYGARDEN.description}</p>
                <Button asChild className="mt-6 bg-emerald-700 hover:bg-emerald-800 rounded-full">
                  <Link href="/contact">Get Notified At Launch <ArrowRight size={16} className="ml-1" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <img src="/real-courtyard-garden.jpg" alt="Courtyard garden" className="rounded-2xl aspect-square object-cover" />
                <img src="/real-private-garden.jpg" alt="Indoor plants" className="rounded-2xl aspect-square object-cover mt-6" />
                <img src="/real-vertical-garden.jpg" alt="Vertical garden" className="rounded-2xl aspect-square object-cover" />
                <img src="/real-flowerbed-roadside.jpg" alt="Garden" className="rounded-2xl aspect-square object-cover mt-6" />
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* BLOG — only rendered if blogs exist */}
      {blogs.length > 0 && (
        <section className="py-12 bg-stone-50 relative overflow-hidden">
          {/* Subtle Botanical Texture */}
          <LeafVeinPattern opacity={0.08} />
          <WatercolorBranchLeft className="absolute -right-16 -bottom-20 w-72 h-[500px] hidden md:block" opacity={0.15} />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <FadeIn className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
              <div>
                <span className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-base font-bold uppercase tracking-[0.2em] mb-4">From Our Blog</span>
                <TextReveal className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">Insights &amp; Expert Notes</TextReveal>
              </div>
              <Button asChild variant="outline" className="rounded-full border-emerald-700 text-emerald-700 hover:bg-emerald-50 self-start md:self-auto">
                <Link href="/blog">View All Articles <ArrowRight size={16} className="ml-1" /></Link>
              </Button>
            </FadeIn>
            <Stagger className="grid md:grid-cols-3 gap-6" data-testid="home-blog-list" animate="show">
              {blogs.map((b) => (
                <StaggerItem key={b.id}>
                  <Card className="group overflow-hidden border-stone-200 hover:shadow-2xl transition-all hover:-translate-y-1 h-full">
                    <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                      {b.cover_image && (
                        <img src={b.cover_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      )}
                    </div>
                    <div className="p-6 bg-white">
                      <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                        <span className="flex items-center gap-1"><CalendarDays size={13} /> {new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="flex items-center gap-1"><UserIcon size={13} /> {b.author}</span>
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-emerald-950 leading-snug group-hover:text-emerald-700 transition-colors">{b.title}</h3>
                      <p className="mt-3 text-stone-600 text-sm leading-relaxed line-clamp-2">{b.excerpt}</p>
                      <Link href={`/blog/${b.slug}`} className="mt-4 inline-flex items-center gap-1 text-emerald-700 font-medium text-sm">Read More <ArrowRight size={14} /></Link>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* PROCUREMENT CTA */}
      <section className="py-12 bg-emerald-950 text-white" id="request-profile" data-testid="procurement-cta">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-400/90 text-emerald-950 px-3 py-1 rounded-full">
              For Procurement Officers
            </span>
            <TextReveal className="font-serif text-3xl md:text-5xl font-semibold mt-4 leading-tight">
              Need Credentials For A Tender Or RFP?
            </TextReveal>
            <p className="mt-4 text-emerald-100/85 leading-relaxed">
              Instantly download the official A2Z Company Profile PDF — ISO certificates,
              full client list, past PO summary and workforce declaration in one file.
            </p>
          </div>
          <div className="flex md:justify-end">
            <div className="space-y-3 flex flex-col items-center md:items-end">
              <Magnetic>
                <BloomButton
                  onClick={() => setProfileOpen(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-emerald-950 rounded-full px-7 py-4 w-full md:w-auto font-semibold inline-flex items-center justify-center shadow-lg shadow-amber-400/20"
                  data-testid="home-request-profile-btn"
                >
                  <FileText size={18} className="mr-2 relative z-10" /> <span className="relative z-10">Download Company Profile</span>
                </BloomButton>
              </Magnetic>
              <a href={`tel:${COMPANY.phoneRaw}`} className="block text-center text-amber-200 hover:text-amber-300 text-sm mt-2">
                or call {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <ProfileRequestModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
