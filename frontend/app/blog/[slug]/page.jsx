"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, User, Tag, ArrowLeft, Share2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchBlog } from "@/lib/api";
import { readingTimeMinutes } from "@/lib/utils";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchBlog(slug)
      .then(setBlog)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center text-stone-500" data-testid="blog-detail-loading">
        Loading article…
      </div>
    );
  }

  if (error || !blog) {
    notFound();
  }

  return (
    <article className="bg-stone-50" data-testid="blog-detail-page">
      <header className="relative bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 border-b border-stone-200 overflow-hidden">
        <div className="absolute top-10 -left-20 w-72 h-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-6 pt-20 pb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-emerald-700 text-sm font-medium hover:text-emerald-900"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mt-6 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full"
          >
            {blog.category}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="font-serif text-4xl md:text-5xl text-emerald-950 font-semibold mt-4 leading-tight"
          >
            {blog.title}
          </motion.h1>
          <div className="flex items-center gap-5 mt-6 text-sm text-stone-600">
            <span className="flex items-center gap-1">
              <CalendarDays size={14} />{" "}
              {new Date(blog.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> {blog.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {readingTimeMinutes(blog.content)} min read
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {blog.cover_image && (
          <motion.img
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            src={blog.cover_image}
            alt={blog.title}
            className="w-full aspect-[16/9] object-cover rounded-3xl shadow-xl mb-10"
          />
        )}

        {blog.excerpt && (
          <p className="font-serif text-2xl text-stone-700 leading-relaxed mb-8 italic border-l-4 border-emerald-600 pl-5">
            {blog.excerpt}
          </p>
        )}

        <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed whitespace-pre-wrap text-[17px]">
          {blog.content}
        </div>

        {(blog.tags || []).length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Tag size={16} className="text-emerald-700" />
            {blog.tags.map((t, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-stone-100 text-stone-700"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        <Card className="mt-14 p-7 border-stone-200 bg-emerald-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <p className="uppercase tracking-[0.18em] text-amber-300 text-xs font-semibold">Need expert help?</p>
            <h3 className="font-serif text-2xl mt-2">Talk to our plant experts.</h3>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-amber-400 hover:bg-amber-500 text-emerald-950 rounded-full">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-emerald-700 text-white hover:bg-emerald-800 bg-transparent"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: blog.title, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 size={16} className="mr-1" /> Share
            </Button>
          </div>
        </Card>
      </div>
    </article>
  );
}
