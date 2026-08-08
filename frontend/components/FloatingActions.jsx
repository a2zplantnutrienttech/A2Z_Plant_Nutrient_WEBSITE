"use client";

import { Phone, MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/mock";

// Floating call/whatsapp buttons pinned bottom-right.
// Extra bottom padding on mobile ensures the buttons don't collide with the footer.
export default function FloatingActions() {
  return (
    <div className="fixed right-4 md:right-6 bottom-4 md:bottom-6 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${COMPANY.phoneRaw.replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Whatsapp"
        data-testid="floating-whatsapp"
      >
        <MessageCircle size={22} />
      </a>
      <a
        href={`tel:${COMPANY.phoneRaw}`}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-900 hover:bg-emerald-950 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        aria-label="Call"
        data-testid="floating-call"
      >
        <Phone size={20} />
      </a>
    </div>
  );
}
