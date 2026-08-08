"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Briefcase, MapPin, Send, Upload, Mail, Loader2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeIn, Stagger, StaggerItem } from "@/components/Motion";
import {
  WatercolorBranchLeft,
  WatercolorBranchRight,
  LeafOutlineCorner,
  LeafVeinPattern,
  OrganicWaveSeparator,
  WatercolorLeafSingle,
} from "@/components/BotanicalPatterns";
import { useToast } from "@/hooks/use-toast";
import { fetchCareers, sendApplication, fileToBase64 } from "@/lib/api";
import { CAREERS as FALLBACK_CAREERS, COMPANY } from "@/lib/mock";

export default function CareersPage() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(null);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    fetchCareers()
      .then((d) => setCareers(d && d.length ? d : FALLBACK_CAREERS))
      .catch(() => setCareers(FALLBACK_CAREERS))
      .finally(() => setLoading(false));
  }, []);

  const chooseRole = (title) => {
    setSelected(title);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    
    // Check if it's pdf or doc
    if (!f.type.includes('pdf') && !f.name.endsWith('.doc') && !f.name.endsWith('.docx')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      });
      return;
    }
    
    if (f.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose a file under 5MB.",
        variant: "destructive",
      });
      return;
    }
    const b64 = await fileToBase64(f);
    setResume(b64);
    setResumeName(f.name);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast({
        title: "Missing resume",
        description: "Please attach your resume.",
        variant: "destructive",
      });
      return;
    }

    const form = e.target;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") || "",
      message: fd.get("message") || "",
      role: selected || "General Application",
      resume: resume
    };
    
    setSubmitting(true);
    try {
      await sendApplication(payload);
      toast({
        title: "Application submitted",
        description: `Thanks! We've received your application for ${selected || "a role"}.`,
        variant: "success",
      });
      form.reset();
      setSelected(null);
      setResume(null);
      setResumeName("");
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="careers-page">
      <PageHero title="Careers" subtitle="Join Our Team" />

      <section className="relative overflow-hidden py-20 bg-white">
        {/* Subtle Botanical Accents */}
        <WatercolorBranchLeft className="absolute -left-20 bottom-10 w-80 h-[600px] hidden md:block" opacity={0.15} />
        <WatercolorBranchRight className="absolute -right-20 top-20 w-80 h-[600px] hidden md:block" opacity={0.15} />
        <LeafVeinPattern opacity={0.08} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">Open Positions</p>
          <h2 className="font-serif text-3xl md:text-5xl text-emerald-950 font-semibold mt-3 leading-tight">Grow your career with us</h2>
          <p className="mt-4 text-stone-600">We&apos;re always on the lookout for passionate, plant-loving folks. Find a role that fits you below.</p>
        </FadeIn>

        {loading ? (
          <div className="py-16 text-center text-stone-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} /> Loading roles…
          </div>
        ) : (
          <Stagger className="grid md:grid-cols-2 gap-6" data-testid="careers-list" animate="show">
            {careers.map((c, i) => (
              <StaggerItem key={c.id || i}>
                <Card className="p-7 border-stone-200 hover:shadow-xl hover:border-emerald-200 transition-all h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                          <Briefcase size={20} />
                        </div>
                        <button
                          type="button"
                          onClick={() => chooseRole(c.title)}
                          className="text-left font-serif text-xl font-semibold text-emerald-950 hover:text-emerald-700 transition-colors"
                          data-testid={`career-title-${i}`}
                        >
                          {c.title}
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">{c.type}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {c.location}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => chooseRole(c.title)}
                      className="bg-emerald-700 hover:bg-emerald-800 rounded-full shrink-0"
                      data-testid={`career-apply-${i}`}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="mt-4 text-stone-600 leading-relaxed">{c.desc}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <div id="apply" ref={formRef} className="mt-16 grid lg:grid-cols-2 gap-10 items-start scroll-mt-24">
          <FadeIn className="rounded-3xl bg-emerald-50/60 p-10">
            <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">Don&apos;t see a fit?</p>
            <h3 className="font-serif text-3xl md:text-4xl text-emerald-950 font-semibold mt-3 leading-tight">We&apos;d love to hear from you anyway</h3>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Send us your details and tell us what you love to do. If your passion aligns with ours, we&apos;ll make a place for you.
            </p>
            <div className="mt-6 space-y-3 text-stone-700">
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 hover:text-emerald-700 transition-colors"
              >
                <Mail className="text-emerald-700" size={18} /> {COMPANY.email}
              </a>
              <a
                href={COMPANY.addressMapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:text-emerald-700 transition-colors"
              >
                <MapPin className="text-emerald-700" size={18} /> Varanasi, Uttar Pradesh
              </a>
            </div>
          </FadeIn>
          <FadeIn>
            <Card className="p-8 border-stone-200">
              <h3 className="font-serif text-2xl font-semibold text-emerald-950">
                Apply Now {selected && <span className="text-emerald-700">— {selected}</span>}
              </h3>
              <form onSubmit={handleApply} className="mt-6 space-y-4" data-testid="apply-form">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-stone-700">Full Name</Label>
                    <Input required name="name" placeholder="Jane Doe" className="mt-2" />
                  </div>
                  <div>
                    <Label className="text-stone-700">Email</Label>
                    <Input required name="email" type="email" placeholder="you@email.com" className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label className="text-stone-700">Phone</Label>
                  <Input required name="phone" placeholder="+91 …" className="mt-2" />
                </div>
                <div>
                  <Label className="text-stone-700">Why do you want to join us?</Label>
                  <Textarea required name="message" rows={4} placeholder="Tell us about yourself…" className="mt-2" />
                </div>
                <div>
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleFile}
                  />
                  <label 
                    htmlFor="resume-upload"
                    className="flex items-center gap-3 p-3 rounded-md bg-stone-50 border border-dashed border-stone-300 text-stone-500 text-sm cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                  >
                    <Upload size={16} className={resume ? "text-emerald-600" : ""} /> 
                    <span className={resume ? "text-emerald-700 font-medium" : ""}>
                      {resumeName ? resumeName : "Attach Resume (PDF / DOC)"}
                    </span>
                  </label>
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full py-6">
                  <Send size={16} className="mr-2" /> {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Card>
          </FadeIn>
        </div>
        </div>
      </section>
    </div>
  );
}
