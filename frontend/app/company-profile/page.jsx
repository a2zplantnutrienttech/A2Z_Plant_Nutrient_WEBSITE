"use client";

import Image from "next/image";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  Printer,
  Download,
} from "lucide-react";
import {
  COMPANY,
  CERTIFICATIONS,
  STATS,
  PROJECTS,
  SERVICES,
  CLIENTS,
  LEADERSHIP,
} from "@/lib/mock";

function ProfileContent() {
  const search = useSearchParams();
  const requestedBy = search.get("for") || "";
  const org = search.get("org") || "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="print:hidden bg-emerald-950 text-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
              Company Profile · A2Z Plant Nutrient Pvt Ltd
            </p>
            {requestedBy && (
              <p className="text-sm text-emerald-100/85 mt-1">
                Prepared for <strong>{requestedBy}</strong>
                {org && <> · {org}</>}
              </p>
            )}
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-semibold px-5 py-2.5 rounded-full transition"
            data-testid="print-profile-btn"
          >
            <Download size={16} /> Download / Print PDF
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 md:px-14 py-12 print:py-8">
        <header className="flex items-start justify-between gap-6 pb-8 border-b-2 border-emerald-950">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-emerald-50 ring-2 ring-emerald-100 shrink-0">
              <Image
                src={COMPANY.logo}
                alt={COMPANY.name}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-emerald-950 font-semibold leading-tight">
                {COMPANY.legalName}
              </h1>
              <p className="text-sm text-emerald-700 mt-1">
                {COMPANY.positioning}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Incorporated {COMPANY.founded} · Headquartered in Varanasi, India
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-stone-500 shrink-0">
            <p>Company Profile v1.0</p>
            <p>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "CIN", value: COMPANY.cin },
            { label: "GSTIN", value: COMPANY.gstin },
            { label: "Udyam Reg.", value: COMPANY.udyamNumber },
          ].map((r) => (
            <div key={r.label} className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
                {r.label}
              </div>
              <div className="font-mono text-sm text-emerald-950 mt-1 break-all">{r.value}</div>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl text-emerald-950 font-semibold mb-4 border-l-4 border-amber-400 pl-3">
            Certifications & Recognitions
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CERTIFICATIONS.map((c) => (
              <div
                key={c.code}
                className="p-4 border border-stone-200 rounded-lg flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="font-serif text-emerald-950 font-semibold">{c.code}</div>
                  <div className="text-xs text-stone-600">{c.name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl text-emerald-950 font-semibold mb-4 border-l-4 border-amber-400 pl-3">
            Company Snapshot
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-emerald-950 text-white">
                <div className="font-serif text-2xl text-amber-300 font-semibold">
                  {s.number}
                </div>
                <div className="text-sm font-serif mt-1">{s.title}</div>
                <p className="text-xs text-emerald-200/80 mt-1 leading-snug">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl text-emerald-950 font-semibold mb-4 border-l-4 border-amber-400 pl-3">
            Leadership
          </h2>
          {LEADERSHIP.map((l) => (
            <div key={l.name} className="flex items-start gap-4 p-4 border border-stone-200 rounded-lg">
              <div className="w-14 h-14 rounded-full bg-emerald-700 text-white font-serif text-xl font-semibold flex items-center justify-center shrink-0">
                {l.initials}
              </div>
              <div>
                <h3 className="font-serif text-lg text-emerald-950 font-semibold">{l.name}</h3>
                <p className="text-sm text-emerald-700">{l.role}</p>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">{l.bio}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl text-emerald-950 font-semibold mb-4 border-l-4 border-amber-400 pl-3">
            EPC Service Portfolio
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {SERVICES.map((s) => (
              <div key={s.slug} className="p-4 border border-stone-200 rounded-lg">
                <h3 className="font-serif text-emerald-950 font-semibold">{s.title}</h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 page-break">
          <h2 className="font-serif text-2xl text-emerald-950 font-semibold mb-4 border-l-4 border-amber-400 pl-3">
            Selected Purchase Orders &amp; Projects
          </h2>
          <div className="overflow-hidden rounded-lg border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-emerald-950 text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-serif font-semibold">Client</th>
                  <th className="text-left px-4 py-3 font-serif font-semibold">Project</th>
                  <th className="text-left px-4 py-3 font-serif font-semibold">Location · Year</th>
                  <th className="text-left px-4 py-3 font-serif font-semibold">Key Metrics</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((p, i) => (
                  <tr key={p.slug} className={i % 2 === 0 ? "bg-white" : "bg-emerald-50/40"}>
                    <td className="px-4 py-3 font-semibold text-emerald-800">{p.client}</td>
                    <td className="px-4 py-3">{p.title}</td>
                    <td className="px-4 py-3 text-stone-600">{p.location} · {p.year}</td>
                    <td className="px-4 py-3 text-stone-600 text-xs">
                      {p.metrics.map((m, k) => (
                        <span key={k} className="inline-block mr-3">
                          <strong>{m.value}</strong> {m.label.toLowerCase()}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-500 mt-2 italic">
            PO copies, completion certificates and detailed case studies available on request.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-2xl text-emerald-950 font-semibold mb-4 border-l-4 border-amber-400 pl-3">
            Clients Served
          </h2>
          <div className="flex flex-wrap gap-2">
            {CLIENTS.map((c) => (
              <span
                key={c}
                className="text-sm px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-10 p-6 rounded-lg bg-emerald-950 text-white grid md:grid-cols-3 gap-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Registered Office</div>
            <div className="mt-2 text-sm flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-amber-300" />
              <span>{COMPANY.address}</span>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Contact</div>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-amber-300" /> {COMPANY.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-amber-300" /> {COMPANY.email}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Working Hours</div>
            <div className="mt-2 text-sm">{COMPANY.hours}</div>
          </div>
        </section>

        <footer className="mt-10 pt-6 border-t border-stone-200 text-xs text-stone-500 flex flex-wrap justify-between gap-2">
          <div>© {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.</div>
          <div>a2zplantnutrient.com</div>
        </footer>
      </div>
    </>
  );
}

export default function CompanyProfilePage() {
  return (
    <div className="bg-white text-stone-800 min-h-screen" data-testid="company-profile-page">
      <Suspense fallback={<div className="p-8 text-center text-stone-500">Loading Profile...</div>}>
        <ProfileContent />
      </Suspense>

      <style jsx global>{`
        @media print {
          @page {
            margin: 12mm;
          }
          body {
            background: #ffffff !important;
          }
          header, nav, footer.site-footer, .fixed, .sticky {
            display: none !important;
          }
          .page-break {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
