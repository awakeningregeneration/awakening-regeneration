"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const CATEGORY_OPTIONS = [
  "Regenerative Food & Farming",
  "Land & Ecology",
  "Recycling, Upcycling & Materials",
  "Repair, Reuse & Tool Sharing",
  "Healing & Wellness",
  "Community & Education",
  "Arts & Culture",
  "Mutual Aid & Community Care",
  "Housing & Shelter",
  "Local Goods & Small Business",
  "Cooperative & Alternative Economies",
  "Regenerative Building & Infrastructure",
  "Energy, Waste & Practical Systems",
  "Civic & Community Advocacy",
  "Other",
];
const PRACTICE_OPTIONS = [
  "Organic",
  "Regenerative",
  "Permaculture",
  "Fair Trade",
  "Biodegradable",
  "Compostable",
  "Recycled Materials",
  "Upcycled Materials",
  "Low Waste",
  "Zero Waste",
  "Local",
  "Worker-Owned / Cooperative",
  "Community Owned",
  "Renewable Energy",
  "Educational",
  "Accessible / Sliding Scale",
  "Volunteer Run",
  "Nonprofit / Mission Driven",
  "Indigenous Led",
  "Women Led",
];

export default function SubmitPage() {
  const searchParams = useSearchParams();

  const prefilledState = searchParams.get("state") || "";
  const prefilledCounty = searchParams.get("county") || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(prefilledState);
  const [county, setCounty] = useState(prefilledCounty);
  const [categories, setCategories] = useState<string[]>([]);
  const [practices, setPractices] = useState<string[]>([]);
  const [submittedBy, setSubmittedBy] = useState("");
  const [email, setEmail] = useState("");

  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const regionLabel = useMemo(() => {
    if (county && state) return `${county} County, ${state}`;
    if (state) return state;
    if (county) return `${county} County`;
    return "";
  }, [county, state]);

  function toggleCategory(category: string) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }
function togglePractice(practice: string) {
  setPractices((current) =>
    current.includes(practice)
      ? current.filter((item) => item !== practice)
      : [...current, practice]
  );
}
  function validateForm() {
    if (!title.trim()) {
      setErrorMessage("Please add a name for the place, project, or offering.");
      return false;
    }

    if (!description.trim()) {
      setErrorMessage("Please add a short description.");
      return false;
    }

    if (!city.trim() && !address.trim()) {
      setErrorMessage("Please add at least a city or a street address.");
      return false;
    }

    if (!state.trim()) {
      setErrorMessage("Please add a state.");
      return false;
    }

    if (categories.length === 0) {
      setErrorMessage("Please choose at least one category.");
      return false;
    }

    return true;
  }

  function handleReview() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsReviewing(true);
  }

  async function handleFinalSubmit() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      setIsReviewing(false);
      return;
    }

    setIsSubmitting(true);

    try {
     const payload = {
  title: title.trim(),
  description: description.trim(),
  website: website.trim(),
  address: address.trim(),
  city: city.trim(),
  state: state.trim(),
  county: county.trim(),
  categories,
  practices,
  submittedBy: submittedBy.trim(),
  email: email.trim(),
};

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Something went wrong while submitting this point of light."
        );
      }

      setSuccessMessage("Another point of light has become visible.");
      setTitle("");
      setDescription("");
      setWebsite("");
      setAddress("");
      setCity("");
      setState(prefilledState);
      setCounty(prefilledCounty);
      setCategories([]);
      setPractices([]);
      setSubmittedBy("");
      setEmail("");
      setIsReviewing(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting this point of light.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#d3e4f7] text-[#1e2a38]">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-[0.22em] text-[#6b7c94]">
            Awakening Regeneration
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Reveal a point of light
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4a5a70]">
            Help make what is already life-giving more visible. Share a place,
            project, offering, or effort that belongs on the map.
          </p>
<p className="mt-4 text-sm leading-6 text-[#4a5a70]">
  Not sure what belongs here?{" "}
  <Link
    href="/about"
    className="font-medium text-[#0e3a66] underline underline-offset-4"
  >
    Read about the project and what belongs on the map.
  </Link>
</p>
          {regionLabel ? (
            <div className="mt-6 inline-flex rounded-full border border-black/10 bg-white/55 px-4 py-2 text-sm text-[#4a5a70]">
              Region prefilled: {regionLabel}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8">
          {!isReviewing ? (
            <>
              <div className="grid gap-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1e2a38]">
                    Name of place or project
                  </label>
                  <input
                  name="ar-place-title"
                   autoComplete="off"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder=""
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#1e2a38] outline-none placeholder:text-[#7c8aa0] focus:border-black/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1e2a38]">
                    Description
                  </label>
                 <textarea
  name="ar-description"
  autoComplete="off"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Tell people what this is and why it matters."
  rows={5}
  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#1e2a38] outline-none placeholder:text-[#7c8aa0] focus:border-black/20"
/>
                </div>

               <div>
  <label className="mb-1 block text-sm font-medium text-[#1e2a38]">
    Categories
  </label>

 <p className="mb-3 text-sm italic text-[#4a5a70]">
  Select all that apply.
</p>

  <div className="flex flex-wrap gap-3">
                    {CATEGORY_OPTIONS.map((category) => {
                      <div>
  <label className="mb-3 block text-sm font-medium text-[#1e2a38]">
    Practices / Values
  </label>

<p className="mb-3 text-sm italic leading-6 text-[#4a5a70]">
  Select all that apply. These describe how this place, project, or offering operates.
</p>

  <div className="flex flex-wrap gap-3">
    {PRACTICE_OPTIONS.map((practice) => {
      const isSelected = practices.includes(practice);

      return (
        <button
          key={practice}
          type="button"
          onClick={() => togglePractice(practice)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            isSelected
              ? "border-black/20 bg-[#0e3a66] text-white"
              : "border-black/10 bg-white/70 text-[#4a5a70] hover:bg-white"
          }`}
        >
          {practice}
        </button>
      );
    })}
  </div>
</div>
                      const isSelected = categories.includes(category);

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => toggleCategory(category)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            isSelected
                              ? "border-black/20 bg-[#0e3a66] text-white"
                              : "border-black/10 bg-white/70 text-[#4a5a70] hover:bg-white"
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>
<div>
  <label className="mb-3 block text-sm font-medium text-[#1e2a38]">
    Practices / Values
  </label>

  <p className="mb-3 text-sm leading-6 text-[#4a5a70]">
    These describe how this place, project, or offering operates.
  </p>

  <div className="flex flex-wrap gap-3">
    {PRACTICE_OPTIONS.map((practice) => {
      const isSelected = practices.includes(practice);

      return (
        <button
          key={practice}
          type="button"
          onClick={() => togglePractice(practice)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            isSelected
              ? "border-black/20 bg-[#0e3a66] text-white"
              : "border-black/10 bg-white/70 text-[#4a5a70] hover:bg-white"
          }`}
        >
          {practice}
        </button>
      );
    })}
  </div>
</div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1e2a38]">
                    Website
                  </label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.org"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#1e2a38] outline-none placeholder:text-[#7c8aa0] focus:border-black/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1e2a38]">
                    Street address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Optional, but helpful for mapping"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#1e2a38] outline-none placeholder:text-[#7c8aa0] focus:border-black/20"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1e2a38]">
                      City
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder=""
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#1e2a38] outline-none placeholder:text-[#7c8aa0] focus:border-black/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1e2a38]">
                      County
                    </label>
                    <input
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      placeholder="Jackson"
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#1e2a38] outline-none placeholder:text-[#7c8aa0] focus:border-black/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1e2a38]">
                      State
                    </label>
                    <input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Oregon"
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#1e2a38] outline-none placeholder:text-[#7c8aa0] focus:border-black/20"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1e2a38]">
                      Your name
                    </label>
                    <input
                      value={submittedBy}
                      onChange={(e) => setSubmittedBy(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#1e2a38] outline-none placeholder:text-[#7c8aa0] focus:border-black/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#1e2a38]">
                      Your email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[#1e2a38] outline-none placeholder:text-[#7c8aa0] focus:border-black/20"
                    />
                  </div>
                </div>
              </div>

              {errorMessage ? (
                <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleReview}
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#0e3a66] transition hover:bg-white/85"
                >
                  Review listing
                </button>

                <Link
                  href="/map"
                  className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#0e3a66] transition hover:bg-white/60"
                >
                  Back to map
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Review before submitting
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4a5a70]">
                  Please make any final changes now. Once submitted, this listing
                  will go live, and future edits will be reviewed before being
                  published.
                </p>
              </div>

              <div className="grid gap-5">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6b7c94]">
                    Name
                  </div>
                  <div className="mt-2 text-base text-[#1e2a38]">{title}</div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6b7c94]">
                    Description
                  </div>
                  <div className="mt-2 whitespace-pre-wrap text-base leading-7 text-[#1e2a38]">
                    {description}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#6b7c94]">
                    Categories
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-sm text-[#4a5a70]"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {website ? (
                  <div className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-[#6b7c94]">
                      Website
                    </div>
                    <div className="mt-2 break-all text-base text-[#1e2a38]">
                      {website}
                    </div>
                  </div>
                ) : null}

                {(address || city || county || state) ? (
                  <div className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-[#6b7c94]">
                      Location
                    </div>
                    <div className="mt-2 space-y-1 text-base text-[#1e2a38]">
                      {address ? <div>{address}</div> : null}
                      <div>{[city, county, state].filter(Boolean).join(", ")}</div>
                    </div>
                  </div>
                ) : null}

                {(submittedBy || email) ? (
                  <div className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-[#6b7c94]">
                      Submitted by
                    </div>
                    <div className="mt-2 space-y-1 text-base text-[#1e2a38]">
                      {submittedBy ? <div>{submittedBy}</div> : null}
                      {email ? <div>{email}</div> : null}
                    </div>
                  </div>
                ) : null}
              </div>

              {errorMessage ? (
                <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewing(false)}
                  className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-[#0e3a66] transition hover:bg-white/60"
                >
                  Back to edit
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#0e3a66] transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit listing"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}