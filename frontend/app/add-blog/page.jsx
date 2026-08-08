"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePlus, Save, X, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createBlog, fileToBase64 } from "@/lib/api";

const CATEGORIES = [
  "Landscaping",
  "Indoor Plants",
  "Lawn Care",
  "Garden Design",
  "Plant Health",
  "Mural Art",
  "Gifting",
  "General",
];

export default function AddBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Admin",
    category: "General",
    tags: "",
    cover_image: "",
  });
  const [preview, setPreview] = useState("");

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please choose an image under 4MB.",
        variant: "destructive",
      });
      return;
    }
    const b64 = await fileToBase64(f);
    setForm((p) => ({ ...p, cover_image: b64 }));
    setPreview(b64);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast({
        title: "Missing fields",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const blog = await createBlog(payload);
      toast({
        title: "Blog published",
        description: `"${blog.title}" is now live.`,
      });
      router.push(`/blog/${blog.slug}`);
    } catch (err) {
      toast({
        title: "Failed to publish",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="add-blog-page">
      <PageHero title="Add a New Blog" subtitle="Share Your Story" />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <Card className="p-8 md:p-10 border-stone-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-emerald-700" size={18} />
            <p className="uppercase tracking-[0.18em] text-emerald-700 text-xs font-semibold">
              Publish Instantly
            </p>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-emerald-950 font-semibold leading-tight">
            Craft a new article
          </h2>
          <p className="mt-3 text-stone-600">
            Fill in the details below — it appears on the Blog page immediately.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" data-testid="add-blog-form">
            <div>
              <Label className="text-stone-700">Title *</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Best plants for monsoon homes in Varanasi"
                className="mt-2"
                data-testid="blog-title-input"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-stone-700">Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Author name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-stone-700">Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-2 w-full h-10 px-3 rounded-md border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  data-testid="blog-category-select"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label className="text-stone-700">Excerpt</Label>
              <Textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="A 1-2 sentence teaser…"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-stone-700">Content *</Label>
              <Textarea
                required
                rows={10}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your full blog content here. Plain text or markdown-style paragraphs are fine."
                className="mt-2"
                data-testid="blog-content-input"
              />
            </div>

            <div>
              <Label className="text-stone-700">Tags (comma-separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="e.g. monsoon, indoor, care"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-stone-700">Cover Image</Label>
              <div className="mt-2 flex items-start gap-4 flex-wrap">
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer flex items-center justify-center w-40 h-28 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 transition"
                  data-testid="cover-upload-label"
                >
                  <div className="text-center">
                    <ImagePlus size={22} className="mx-auto" />
                    <span className="text-xs mt-1 block">Upload Image</span>
                  </div>
                </label>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                  data-testid="cover-upload-input"
                />
                <Input
                  value={form.cover_image.startsWith("data:") ? "" : form.cover_image}
                  onChange={(e) => {
                    setForm({ ...form, cover_image: e.target.value });
                    setPreview(e.target.value);
                  }}
                  placeholder="…or paste an image URL"
                  className="flex-1 min-w-[200px]"
                />
                {preview && (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-40 h-28 object-cover rounded-xl border border-stone-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview("");
                        setForm((p) => ({ ...p, cover_image: "" }));
                      }}
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 text-stone-600 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-2">
                JPG, PNG, WEBP up to 4MB. Image is stored as base64 in MongoDB.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-emerald-700 hover:bg-emerald-800 rounded-full px-7 py-6"
                data-testid="blog-submit-btn"
              >
                <Save size={16} className="mr-2" />
                {submitting ? "Publishing…" : "Publish Blog"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin")}
                className="rounded-full border-stone-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
