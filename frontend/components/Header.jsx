"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { COMPANY, NAV } from "@/lib/mock";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur shadow-sm border-b border-stone-200"
          : "bg-white/85 backdrop-blur-sm border-b border-transparent"
      )}
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={() => setOpen(false)}
          data-testid="logo-link"
        >
          <div className="relative w-16 h-16 group-hover:scale-105 transition-transform">
            <Image
              src={COMPANY.logo}
              alt={COMPANY.name}
              fill
              sizes="64px"
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-bold text-emerald-950">
              {COMPANY.name}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-700">
              {COMPANY.tagline}
            </div>
          </div>
        </Link>

        <nav
          className="hidden lg:flex items-center gap-7"
          data-testid="desktop-nav"
        >
          {NAV.map((n) => {
            const active = pathname === n.path;
            return (
              <Link
                key={n.path}
                href={n.path}
                data-testid={`nav-${n.label.toLowerCase()}`}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-emerald-700 py-1 group",
                  active ? "text-emerald-700" : "text-stone-700"
                )}
              >
                {n.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-emerald-600 origin-left transition-transform",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <a
          href={`tel:${COMPANY.phoneRaw}`}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium transition-colors"
          data-testid="header-call-btn"
        >
          <Phone size={16} /> {COMPANY.phone}
        </a>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden w-10 h-10 rounded-md flex items-center justify-center text-emerald-900 hover:bg-emerald-50"
          data-testid="mobile-menu-toggle"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-stone-200 bg-white" data-testid="mobile-nav">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col">
            {NAV.map((n) => {
              const active = pathname === n.path;
              return (
                <Link
                  key={n.path}
                  href={n.path}
                  onClick={() => setOpen(false)}
                  data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                  className={cn(
                    "py-3 border-b border-stone-100 text-sm font-medium",
                    active ? "text-emerald-700" : "text-stone-700"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
            <a
              href={`tel:${COMPANY.phoneRaw}`}
              className="mt-4 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-700 text-white text-sm font-medium"
            >
              <Phone size={16} /> {COMPANY.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
