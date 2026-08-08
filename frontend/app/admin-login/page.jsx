"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, LogIn, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMPANY } from "@/lib/mock";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    // Call the local Next.js API route so the cookie is set on the frontend domain
    const res = await fetch(`/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (res && res.ok) {
      router.push(nextPath);
      // Give the cookie a beat to propagate before the middleware re-evaluates.
      setTimeout(() => router.refresh(), 200);
    } else {
      setError("Incorrect password. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-login-form">
      <div>
        <Label className="text-stone-700 text-sm">Admin password</Label>
        <Input
          required
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="mt-2"
          data-testid="admin-password-input"
        />
      </div>
      {error && (
        <div className="text-sm text-red-600" data-testid="admin-login-error">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={submitting || !password}
        className="w-full bg-emerald-700 hover:bg-emerald-800 rounded-full py-6"
        data-testid="admin-login-submit"
      >
        <LogIn size={16} className="mr-2" /> {submitting ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-14 bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50">
      <Card className="w-full max-w-md p-8 md:p-10 border-stone-200 shadow-xl" data-testid="admin-login-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-emerald-700 text-white flex items-center justify-center">
            <Leaf size={20} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-emerald-700 font-semibold">
              {COMPANY.name} · Admin
            </div>
            <div className="font-serif text-xl text-emerald-950 font-semibold">Content Dashboard</div>
          </div>
        </div>

        <div className="mb-5 flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-md p-3">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          <span>Authorised access only. This dashboard manages public site content.</span>
        </div>

        <Suspense fallback={<div className="text-stone-500 text-sm py-4">Loading login form...</div>}>
          <AdminLoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
