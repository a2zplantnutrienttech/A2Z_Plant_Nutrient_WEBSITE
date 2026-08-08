"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePlus, Save, X, Video, ImageIcon } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createMedia, fileToBase64 } from "@/lib/api";

const CATEGORIES = [
  "Gallery",
  "Landscaping",
  "Plantation",
  "Lawn Care",
  "Mural Art",
  "Indoor Plants",
  "Featured",
  "Events",
];

export default function AddMediaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Gallery",
    media_type: "image",
    data: "",
  });

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isVideo = f.type.startsWith("video/");
    const maxSize = isVideo ? 12 * 1024 * 1024 : 5 * 1024 * 1024;
    if (f.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please use ${isVideo ? "videos under 12MB" : "images under 5MB"}.`,
        variant: "destructive",
      });
      return;
    }
    const b64 = await fileToBase64(f);
    setForm((p) => ({
      ...p,
      data: b64,
      media_type: isVideo ? "video" : "image",
    }));
    setPreview(b64);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.data.trim()) {
      toast({
        title: "Missing fields",
        description: "Title and media (file or URL) are required.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const m = await createMedia(form);
      toast({
        title: "Media uploaded",
        description: `"${m.title}" is now in the gallery.`,
      });
      router.push("/gallery");
    } catch (err) {
      toast({
        title: "Failed to upload",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="add-media-page">
      <PageHero title="Add Media" subtitle="Showcase Your Work" />
      <section className="max-w-3xl mx-auto px-6 py-16">
        <Card className="p-8 md:p-10 border-stone-200">
          <h2 className="font-serif text-3xl md:text-4xl text-emerald-950 font-semibold leading-tight">
            Upload an image or video
          </h2>
          <p className="mt-3 text-stone-600">
            Add new visuals to the public gallery in seconds.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" data-testid="add-media-form">
            <div>
              <Label className="text-stone-700">Title *</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Riverside garden — Varanasi"
                className="mt-2"
                data-testid="media-title-input"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-stone-700">Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-2 w-full h-10 px-3 rounded-md border border-stone-200 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-stone-700">Type</Label>
                <div className="mt-2 inline-flex bg-stone-100 rounded-md p-1">
                  {[
                    { v: "image", l: "Image", Icon: ImageIcon },
                    { v: "video", l: "Video", Icon: Video },
                  ].map(({ v, l, Icon }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm({ ...form, media_type: v })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition ${
                        form.media_type === v
                          ? "bg-white text-emerald-800 shadow-sm"
                          : "text-stone-600"
                      }`}
                    >
                      <Icon size={14} /> {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-stone-700">Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short caption (optional)"
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-stone-700">Media *</Label>
              <div className="mt-2 flex items-start gap-4 flex-wrap">
                <label
                  htmlFor="media-upload"
                  className="cursor-pointer flex items-center justify-center w-44 h-32 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 transition"
                >
                  <div className="text-center">
                    <ImagePlus size={22} className="mx-auto" />
                    <span className="text-xs mt-1 block">Upload File</span>
                  </div>
                </label>
                <input
                  id="media-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFile}
                  className="hidden"
                  data-testid="media-upload-input"
                />
                <Input
                  value={form.data.startsWith("data:") ? "" : form.data}
                  onChange={(e) => {
                    setForm({ ...form, data: e.target.value });
                    setPreview(e.target.value);
                  }}
                  placeholder="…or paste a public image/video URL"
                  className="flex-1 min-w-[200px]"
                />
                {preview && (
                  <div className="relative">
                    {form.media_type === "video" ? (
                      <video
                        src={preview}
                        className="w-44 h-32 object-cover rounded-xl border border-stone-200 bg-black"
                        muted
                      />
                    ) : (
                      <img
                        src={preview}
                        alt="preview"
                        className="w-44 h-32 object-cover rounded-xl border border-stone-200"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setPreview("");
                        setForm((p) => ({ ...p, data: "" }));
                      }}
                      className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 text-stone-600 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Images up to 5MB, videos up to 12MB. Stored as base64 in MongoDB.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-emerald-700 hover:bg-emerald-800 rounded-full px-7 py-6"
                data-testid="media-submit-btn"
              >
                <Save size={16} className="mr-2" />
                {submitting ? "Uploading…" : "Upload to Gallery"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/gallery")}
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
