"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePlus, Save, FileArchive, ImageIcon, Video, FolderArchive, Layers } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createMedia, fileToBase64, uploadMediaZip } from "@/lib/api";

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
  const [uploadMode, setUploadMode] = useState("multiple"); // "multiple" | "zip"
  
  // States for Multiple Uploads
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  // State for ZIP Upload
  const [zipFile, setZipFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Gallery",
    media_type: "image",
    data: "", // Used for URL pasting
  });

  const handleMultipleFiles = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    let validFiles = [];
    let validPreviews = [];
    
    for (const f of selectedFiles) {
      const isVideo = f.type.startsWith("video/");
      const maxSize = isVideo ? 12 * 1024 * 1024 : 5 * 1024 * 1024;
      if (f.size > maxSize) {
        toast({
          title: "File too large",
          description: `Skipped ${f.name} (over ${isVideo ? "12MB" : "5MB"}).`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(f);
      const b64 = await fileToBase64(f);
      validPreviews.push({ name: f.name, data: b64, isVideo });
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...validPreviews]);
      // If adding files, set form.data to empty to avoid mixing manual URL
      setForm({ ...form, data: "" });
    }
  };

  const handleZipFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith('.zip')) {
      toast({ title: "Invalid format", description: "Must be a .zip file", variant: "destructive" });
      return;
    }
    setZipFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Missing fields", description: "Title is required.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      if (uploadMode === "zip") {
        if (!zipFile) throw new Error("Please select a ZIP file.");
        const formData = new FormData();
        formData.append("file", zipFile);
        formData.append("title", form.title);
        formData.append("category", form.category);
        formData.append("media_type", form.media_type);
        formData.append("description", form.description);

        const res = await uploadMediaZip(formData);
        toast({
          title: "Bulk ZIP Upload Complete",
          description: `Successfully extracted and uploaded ${res.uploaded} items.`,
        });

      } else {
        // Multiple Upload Mode
        const totalItems = form.data.trim() ? 1 : files.length;
        if (totalItems === 0) throw new Error("Please select files or paste an image URL.");

        if (form.data.trim()) {
          // Manual URL paste mode
          await createMedia({ ...form });
        } else {
          // Loop over multiple files
          for (let i = 0; i < previews.length; i++) {
            const filePreview = previews[i];
            const currentTitle = files.length > 1 ? `${form.title} ${i + 1}` : form.title;
            await createMedia({
              title: currentTitle,
              description: form.description,
              category: form.category,
              media_type: filePreview.isVideo ? "video" : "image",
              data: filePreview.data
            });
          }
        }
        
        toast({
          title: "Media uploaded",
          description: `Successfully added ${totalItems} item(s) to the gallery.`,
        });
      }
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
            Upload to Gallery
          </h2>
          
          <div className="mt-6 inline-flex bg-stone-100 rounded-full p-1 w-full">
            <button
              onClick={() => setUploadMode("multiple")}
              className={`flex-1 flex justify-center items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition ${
                uploadMode === "multiple" ? "bg-white text-emerald-800 shadow-sm" : "text-stone-600"
              }`}
            >
              <Layers size={16} /> Image / Multiple Images
            </button>
            <button
              onClick={() => setUploadMode("zip")}
              className={`flex-1 flex justify-center items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition ${
                uploadMode === "zip" ? "bg-white text-emerald-800 shadow-sm" : "text-stone-600"
              }`}
            >
              <FolderArchive size={16} /> Bulk ZIP Upload
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" data-testid="add-media-form">
            <div>
              <Label className="text-stone-700">Base Title *</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder={uploadMode === "zip" ? "e.g. Project IOCL (files named Project IOCL 1, 2...)" : "e.g. Riverside garden — Varanasi"}
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
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              {uploadMode === "multiple" && (
                <div>
                  <Label className="text-stone-700">Type Override</Label>
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
              )}
            </div>

            <div>
              <Label className="text-stone-700">Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short caption applied to all uploads (optional)"
                className="mt-2"
              />
            </div>

            <div className="pt-2">
              <Label className="text-stone-700">Media *</Label>
              
              {uploadMode === "multiple" && (
                <div className="mt-2 flex items-start gap-4 flex-col sm:flex-row">
                  <label
                    htmlFor="media-upload-multiple"
                    className="cursor-pointer flex flex-col items-center justify-center w-full sm:w-44 h-32 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 transition shrink-0"
                  >
                    <ImagePlus size={24} className="mb-2" />
                    <span className="text-xs font-medium">Select Images</span>
                  </label>
                  <input
                    id="media-upload-multiple"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMultipleFiles}
                    className="hidden"
                  />
                  
                  {files.length === 0 ? (
                    <Input
                      value={form.data}
                      onChange={(e) => setForm({ ...form, data: e.target.value })}
                      placeholder="…or paste a single public image/video URL"
                      className="w-full mt-2 sm:mt-0"
                    />
                  ) : (
                    <div className="flex-1 w-full grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {previews.map((p, idx) => (
                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-stone-100 border border-stone-200">
                          {p.isVideo ? (
                            <div className="w-full h-full flex items-center justify-center bg-black/80 text-white">
                              <Video size={20} />
                            </div>
                          ) : (
                            <img src={p.data} alt={p.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {uploadMode === "zip" && (
                <div className="mt-2">
                  <label
                    htmlFor="media-upload-zip"
                    className="cursor-pointer flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 transition"
                  >
                    <FileArchive size={28} className="mb-2" />
                    <span className="text-sm font-medium">
                      {zipFile ? zipFile.name : "Select a .zip file"}
                    </span>
                    {zipFile && <span className="text-xs text-stone-500 mt-1">Ready to extract</span>}
                  </label>
                  <input
                    id="media-upload-zip"
                    type="file"
                    accept=".zip,application/zip"
                    onChange={handleZipFile}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-stone-100">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || (uploadMode === "multiple" && !files.length && !form.data.trim()) || (uploadMode === "zip" && !zipFile)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                {submitting ? "Uploading..." : "Publish Media"}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
