"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Download, ShieldCheck, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { sendProfileRequest } from "@/lib/procurement";
import { COMPANY } from "@/lib/mock";

// Force download the official A2Z Company Profile PDF with a proper filename.
function triggerPdfDownload() {
  const a = document.createElement("a");
  a.href = COMPANY.companyProfilePdf;
  a.download = COMPANY.companyProfilePdfName;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function ProfileRequestModal({ open, onClose }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get("name"),
      organization: fd.get("organization"),
      designation: fd.get("designation") || "",
      email: fd.get("email"),
      phone: fd.get("phone") || "",
      tender_ref: fd.get("tender_ref") || "",
      message: fd.get("message") || "",
    };
    setSubmitting(true);
    try {
      // Best-effort lead capture — do not block the download if backend is down.
      try {
        await sendProfileRequest(payload);
      } catch (_) {}

      // Trigger real PDF download of the official A2Z Company Profile.
      triggerPdfDownload();

      toast({
        title: "Company profile downloaded",
        description: "Thank you — our team will also be in touch shortly.",
      });
      e.target.reset();
      onClose?.();
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Request Company Profile"
          className="fixed inset-0 z-50 bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          data-testid="profile-request-modal"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl my-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-stone-600 hover:text-red-600 z-10"
              data-testid="profile-modal-close"
            >
              <X size={18} />
            </button>
            <Card className="p-8 md:p-10 border-none shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <FileText size={18} />
                </div>
                <p className="uppercase tracking-[0.18em] text-emerald-700 text-xs font-semibold">
                  Procurement / Vendor Onboarding
                </p>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-emerald-950 font-semibold leading-tight">
                Download A2Z Company Profile
              </h2>
              <p className="mt-2 text-stone-600 text-sm leading-relaxed">
                Share a few details and we&apos;ll deliver the official{" "}
                <strong>{COMPANY.companyProfilePdfName}</strong> — with our ISO 9001 &amp; 14001
                certificates, Startup India recognition, named PSU projects and complete client list.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" data-testid="profile-request-form">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-stone-700 text-sm">Full Name *</Label>
                    <Input required name="name" placeholder="Priya Sharma" className="mt-1.5" data-testid="pr-name" />
                  </div>
                  <div>
                    <Label className="text-stone-700 text-sm">Organization (optional)</Label>
                    <Input name="organization" placeholder="e.g. NHAI · Regional Office (optional)" className="mt-1.5" data-testid="pr-org" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-stone-700 text-sm">Designation (optional)</Label>
                    <Input name="designation" placeholder="Procurement Officer (optional)" className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-stone-700 text-sm">Tender / RFP Ref (optional)</Label>
                    <Input name="tender_ref" placeholder="e.g. NHAI/2026/HORT/…" className="mt-1.5" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-stone-700 text-sm">Email Address *</Label>
                    <Input required type="email" name="email" placeholder="you@org.gov.in" className="mt-1.5" data-testid="pr-email" />
                  </div>
                  <div>
                    <Label className="text-stone-700 text-sm">Phone</Label>
                    <Input name="phone" placeholder="+91 …" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label className="text-stone-700 text-sm">Anything specific?</Label>
                  <Textarea
                    name="message"
                    rows={3}
                    placeholder="e.g. we're evaluating vendors for a compensatory afforestation contract along NH-19…"
                    className="mt-1.5"
                  />
                </div>

                <div className="p-3 rounded-md bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Your details are stored securely and used only to share verified
                    company credentials. No marketing.
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-emerald-700 hover:bg-emerald-800 rounded-full px-7 py-6"
                    data-testid="pr-submit"
                  >
                    <Download size={16} className="mr-2" />
                    {submitting ? "Preparing…" : "Download Company Profile"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
