import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Linkedin,
  Facebook,
  Instagram
} from "lucide-react";
import { COMPANY, NAV, SERVICES } from "@/lib/mock";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50 mt-20" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-white/95 ring-1 ring-emerald-800">
                <Image
                  src={COMPANY.logo}
                  alt={COMPANY.name}
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                />
              </div>
              <div>
                <div className="font-serif text-xl font-bold">{COMPANY.name}</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                  {COMPANY.tagline}
                </div>
              </div>
            </div>
            <p className="text-emerald-200/80 text-sm leading-relaxed mb-4">
              An ISO 9001 &amp; 14001 certified, DPIIT-recognized horticulture EPC partner delivering
              landscape, plantation and maintenance projects for government, PSUs and corporates
              across India.
            </p>
            <div className="space-y-1.5 text-[11px] text-emerald-300/80 font-mono">
              <div>CIN: {COMPANY.cin}</div>
              <div>GSTIN: {COMPANY.gstin}</div>
              <div>Udyam: {COMPANY.udyamNumber}</div>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-5 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {NAV.map((n) => (
                <li key={n.path}>
                  <Link
                    href={n.path}
                    className="text-emerald-200/80 hover:text-amber-300 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight size={12} /> {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-5 text-white">EPC Services</h4>
            <ul className="space-y-3 text-sm">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href="/services"
                    className="text-emerald-200/80 hover:text-amber-300 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight size={12} /> {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-5 text-white">Get in Touch</h4>
            <ul className="space-y-4 text-sm text-emerald-200/80">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-300 mt-0.5 shrink-0" />
                <a
                  href={COMPANY.addressMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-300 transition-colors"
                  data-testid="footer-address-link"
                >
                  {COMPANY.address}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-300 shrink-0" />
                <a href={`tel:${COMPANY.phoneRaw}`} className="hover:text-amber-300">
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-300 shrink-0" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="hover:text-amber-300 break-all"
                  data-testid="footer-email-link"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="pt-2 flex items-start gap-3">
                <ShieldCheck size={16} className="text-amber-300 mt-0.5 shrink-0" />
                <span className="text-xs">
                  ISO 9001 &amp; 14001 · DPIIT · Udyam
                </span>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-4">
              {COMPANY.linkedin && (
                <a href={COMPANY.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-emerald-900/80 flex items-center justify-center text-emerald-300 hover:bg-amber-400 hover:text-emerald-950 transition-colors" aria-label="LinkedIn">
                  <Linkedin size={16} />
                </a>
              )}
              {COMPANY.facebook && (
                <a href={COMPANY.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-emerald-900/80 flex items-center justify-center text-emerald-300 hover:bg-amber-400 hover:text-emerald-950 transition-colors" aria-label="Facebook">
                  <Facebook size={16} />
                </a>
              )}
              {COMPANY.instagram && (
                <a href={COMPANY.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-emerald-900/80 flex items-center justify-center text-emerald-300 hover:bg-amber-400 hover:text-emerald-950 transition-colors" aria-label="Instagram">
                  <Instagram size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-emerald-300/70">
          <p>
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <p>Designed with care · Pan-India Operations</p>
        </div>
      </div>
    </footer>
  );
}
