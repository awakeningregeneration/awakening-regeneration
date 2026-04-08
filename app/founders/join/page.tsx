"use client";

import { useState } from "react";

export default function FounderJoinPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    state: "",
    why: "",
    referral_code: "",
    referred_by: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/founders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessage("Founder interest received. Thank you.");
      setForm({
        name: "",
        email: "",
        city: "",
        state: "",
        why: "",
        referral_code: "",
        referred_by: "",
      });
    } catch (error) {
      const err = error as Error;
      setMessage(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#dbeafe] text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-sky-700">
            Founder entry
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Join as a Founder
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-700">
            This is the early entry point for people helping seed visibility,
            participation, and momentum.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-slate-200"
        >
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={updateField}
            className="w-full rounded-lg border px-4 py-3"
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField}
            className="w-full rounded-lg border px-4 py-3"
            required
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={updateField}
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={updateField}
            className="w-full rounded-lg border px-4 py-3"
          />

          <textarea
            name="why"
            placeholder="Why does this matter to you?"
            value={form.why}
            onChange={updateField}
            className="w-full rounded-lg border px-4 py-3"
            rows={4}
            required
          />

          <input
            name="referral_code"
            placeholder="Referral code (optional)"
            value={form.referral_code}
            onChange={updateField}
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            name="referred_by"
            placeholder="Referred by (name or email)"
            value={form.referred_by}
            onChange={updateField}
            className="w-full rounded-lg border px-4 py-3"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-sky-900 px-5 py-3 font-medium text-white hover:opacity-90"
          >
            {submitting ? "Submitting..." : "Join as a Founder"}
          </button>

          {message && (
            <p className="text-center text-sm text-slate-700">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}