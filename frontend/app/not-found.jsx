"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-stone-50 px-6 text-center">
      <div className="mb-8 text-emerald-800/20">
        {/* Abstract leafy/nature 404 icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="160"
          height="160"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M9 13.5l1.5-1.5L9 10.5M15 13.5l-1.5-1.5 1.5-1.5" />
          <path d="M9.5 16.5c1.5 1 3.5 1 5 0" />
          <path d="M12 2v6" strokeDasharray="2 2" />
        </svg>
      </div>
      
      <h1 className="font-serif text-5xl md:text-7xl font-bold text-emerald-950 tracking-tight">404</h1>
      <h2 className="mt-4 font-serif text-2xl md:text-3xl text-emerald-900 font-medium">No Page Found</h2>
      <p className="mt-4 text-stone-600 max-w-md mx-auto leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Button asChild className="mt-10 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-8 py-6">
        <Link href="/">
          <ArrowLeft size={18} className="mr-2" />
          Return to Homepage
        </Link>
      </Button>
    </div>
  );
}
