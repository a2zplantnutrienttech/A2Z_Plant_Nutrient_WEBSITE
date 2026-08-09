"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
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
import { COMPANY } from "@/lib/mock";
import { sendContact } from "@/lib/api";

export default function ContactPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") || "",
      subject: fd.get("subject") || "",
      message: fd.get("message"),
    };
    setSubmitting(true);
    try {
      await sendContact(payload);
      toast({
        title: "Message sent successfully",
        description: "Thanks for reaching out — we'll get back within 24 hours.",
        variant: "success",
        duration: 5000,
        className: "focus:outline-none focus:ring-2 focus:ring-emerald-500",
        tabIndex: 0
      });
      form.reset();
      // focus the toast after it appears
      setTimeout(() => {
        const toastEl = document.querySelector('[role="status"]');
        if (toastEl) toastEl.focus();
      }, 100);
    } catch (err) {
      toast({
        title: "Failed to send",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, title: "Visit Us", value: COMPANY.address },
    { icon: Phone, title: "Call Us", value: COMPANY.phone, href: `tel:${COMPANY.phoneRaw}` },
    { icon: Mail, title: "Email Us", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
    { icon: Clock, title: "Working Hours", value: COMPANY.hours },
  ];

  return (
    <div data-testid="contact-page">
      <PageHero title="Get in Touch" subtitle="Contact Us" />

      <section className="relative overflow-hidden py-20 bg-white">
        {/* Subtle Botanical Accents */}
        <WatercolorBranchLeft className="absolute -left-20 bottom-10 w-80 h-[500px] hidden md:block" opacity={0.15} />
        <WatercolorLeafSingle className="absolute right-10 top-10 w-64 h-64 hidden md:block" opacity={0.12} rotate={30} />
        <LeafVeinPattern opacity={0.08} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-3 gap-10">
          <Stagger className="lg:col-span-1 space-y-5">
            {contactInfo.map((info, i) => {
              const Icon = info.icon;
              const Wrapper = info.href ? "a" : "div";
              return (
                <StaggerItem key={i}>
                  <Card className="p-6 border-stone-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <Wrapper
                      {...(info.href ? { href: info.href } : {})}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-semibold">{info.title}</div>
                        <div className="mt-1 text-stone-700 leading-relaxed">{info.value}</div>
                      </div>
                    </Wrapper>
                  </Card>
                </StaggerItem>
              );
            })}
          </Stagger>

          <FadeIn className="lg:col-span-2">
            <Card className="p-8 md:p-10 border-stone-200">
              <p className="uppercase tracking-[0.25em] text-emerald-700 text-xs font-semibold">Send us a message</p>
              <h2 className="font-serif text-3xl md:text-4xl text-emerald-950 font-semibold mt-3 leading-tight">We&apos;d love to hear from you</h2>
              <p className="mt-3 text-stone-600">Tell us about your project and we&apos;ll get back with a custom quote.</p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4" data-testid="contact-form">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-stone-700">Full Name</Label>
                    <Input required name="name" placeholder="Your name" className="mt-2" data-testid="contact-name" />
                  </div>
                  <div>
                    <Label className="text-stone-700">Email</Label>
                    <Input required type="email" name="email" placeholder="you@email.com" className="mt-2" data-testid="contact-email" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-stone-700">Phone</Label>
                    <Input name="phone" placeholder="+91 …" className="mt-2" />
                  </div>
                  <div>
                    <Label className="text-stone-700">Subject</Label>
                    <Input name="subject" placeholder="How can we help?" className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label className="text-stone-700">Message</Label>
                  <Textarea required name="message" rows={5} placeholder="Tell us about your project…" className="mt-2" data-testid="contact-message" />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-700 hover:bg-emerald-800 rounded-full px-8 py-6"
                  data-testid="contact-submit"
                >
                  <Send size={16} className="mr-2" /> {submitting ? "Sending…" : "Send Message"}
                </Button>
              </form>
            </Card>
          </FadeIn>
        </div>

        <FadeIn className="mt-16 rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
          <iframe
            title="A2Z Plant Nutrient location"
            src="https://www.google.com/maps?q=Plot+No.+13A,+Shyam+Bihar+Colony,+17/A,+near+telephone+exchange,+Manduwadih,+Shivdaspur,+Varanasi,+Uttar+Pradesh+221103,+India&output=embed"
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </FadeIn>
        </div>
      </section>
    </div>
  );
}
