"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { CalendarDays, User, ArrowRight, Search, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { fetchBlogs } from "@/lib/api";

const KNOWN_CATEGORIES = [
  "Landscaping",
  "Indoor Plants",
  "Lawn Care",
  "Garden Design",
  "Plant Health",
  "General",
];

export default function BlogPage() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchBlogs()
      .then((d) => setAll(d || []))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = all;
    if (activeCat) list = list.filter((b) => b.category === activeCat);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          (b.excerpt || "").toLowerCase().includes(s)
      );
    }
    return list;
  }, [all, q, activeCat]);

  const categories = useMemo(() => {
    const set = new Set(all.map((b) => b.category).filter(Boolean));
    KNOWN_CATEGORIES.forEach((c) => set.add(c));
    return Array.from(set);
  }, [all]);

  return (
    <div data-testid="blog-page">
      <PageHero title="Blog" subtitle="Our Latest Articles" />
      <section className="relative overflow-hidden py-20 bg-white">
        {/* Subtle Botanical Accents */}
        <WatercolorBranchLeft className="absolute -left-20 bottom-10 w-80 h-[600px] hidden md:block" opacity={0.15} />
        <WatercolorBranchRight className="absolute -right-20 top-20 w-80 h-[600px] hidden md:block" opacity={0.15} />
        <LeafVeinPattern opacity={0.08} />

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <FadeIn className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-stone-600 text-sm">
              Showing <span className="font-semibold text-emerald-900">{filtered.length}</span> article{filtered.length !== 1 && "s"}
              {activeCat && (
                <>
                  {" "}in{" "}
                  <span className="text-emerald-700 font-medium">{activeCat}</span>
                </>
              )}
            </p>
          </FadeIn>

          {loading && (
            <div className="text-stone-500 py-16 text-center">Loading articles…</div>
          )}

          {!loading && filtered.length === 0 && (
            <Card className="p-10 border-dashed border-emerald-200 bg-emerald-50/40 text-center">
              <p className="font-serif text-2xl text-emerald-950">No articles yet</p>
              <p className="text-stone-600 mt-2">
                Check back soon for our latest EPC insights and case notes.
              </p>
            </Card>
          )}

          <Stagger className="grid sm:grid-cols-2 gap-6" data-testid="blog-list" animate="show">
            {filtered.map((b) => (
              <StaggerItem key={b.id}>
                <Card className="group overflow-hidden border-stone-200 hover:shadow-xl transition-all hover:-translate-y-1 h-full" data-testid={`blog-card-${b.slug}`}>
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                    {b.cover_image && (
                      <img
                        src={b.cover_image}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <div className="p-6 bg-white">
                    <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {b.category}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-stone-500 mt-3">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />{" "}
                        {new Date(b.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={13} /> {b.author}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-semibold text-emerald-950 leading-snug group-hover:text-emerald-700 transition-colors">
                      {b.title}
                    </h3>
                    <p className="mt-3 text-stone-600 text-sm leading-relaxed line-clamp-2">
                      {b.excerpt}
                    </p>
                    <Link
                      href={`/blog/${b.slug}`}
                      className="mt-4 inline-flex items-center gap-1 text-emerald-700 font-medium text-sm"
                    >
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <aside className="space-y-8">
          <Card className="p-6 border-stone-200">
            <h4 className="font-serif text-lg font-semibold text-emerald-950 mb-4">Search</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Search articles…"
                className="focus-visible:ring-emerald-600"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                data-testid="blog-search-input"
              />
              <Button className="bg-emerald-700 hover:bg-emerald-800">
                <Search size={16} />
              </Button>
            </div>
          </Card>
          <Card className="p-6 border-stone-200">
            <h4 className="font-serif text-lg font-semibold text-emerald-950 mb-4">Categories</h4>
            <ul className="space-y-2 text-stone-700">
              <li>
                <button
                  onClick={() => setActiveCat(null)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                    !activeCat ? "bg-emerald-50 text-emerald-800" : "hover:bg-emerald-50/60"
                  }`}
                >
                  <span>All</span>
                  <ArrowRight size={14} />
                </button>
              </li>
              {categories.map((c, i) => (
                <li key={i}>
                  <button
                    onClick={() => setActiveCat(c)}
                    className={`w-full flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                      activeCat === c ? "bg-emerald-50 text-emerald-800" : "hover:bg-emerald-50/60"
                    }`}
                  >
                    <span>{c}</span>
                    <ArrowRight size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6 border-stone-200 bg-emerald-950 text-white">
            <h4 className="font-serif text-lg font-semibold mb-3">Need help with your garden?</h4>
            <p className="text-emerald-200/80 text-sm mb-4">Talk to our experts and get a custom plan for your space.</p>
            <Button asChild className="w-full bg-amber-400 hover:bg-amber-500 text-emerald-950">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </Card>
        </aside>
        </div>
      </section>
    </div>
  );
}
