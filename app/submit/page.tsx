"use client";

import { FormEvent, useEffect, useState } from "react";

type FormState = {
  title: string;
  description: string;
  website: string;
  categories: string[];
  address: string;
  city: string;
  state: string;
};

const CATEGORY_OPTIONS = [
  "Regenerative Food",
  "Healing & Wellness",
  "Community & Education",
  "Land Projects",
  "Mutual Aid & Repair",
  "Other",
];

const STATE_OPTIONS = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

export default function SubmitPage() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    website: "",
    categories: [],
    address: "",
    city: "",
    state: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [addressQuery, setAddressQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCategory(category: string) {
    setForm((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  }

  useEffect(() => {
    const query = addressQuery.trim();

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) return;

        const res = await fetch(
          `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&autocomplete=true&country=US&limit=5&access_token=${token}`
        );

        if (!res.ok) return;

        const data = await res.json();
        setSuggestions(Array.isArray(data?.features) ? data.features : []);
      } catch {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [addressQuery]);

  function handleSuggestionSelect(feature: any) {
    const props = feature?.properties ?? {};
    const context = props?.context ?? {};

    const address =
      props?.full_address ||
      feature?.place_name ||
      feature?.properties?.name ||
      addressQuery;

    const city =
      context?.place?.name ||
      context?.locality?.name ||
      "";

    const state =
      context?.region?.name ||
      "";

    setAddressQuery(address);
    setSuggestions([]);

    setForm((prev) => ({
      ...prev,
      address,
      city: city || prev.city,
      state: state || prev.state,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        website: form.website,
        categories: form.categories,
        address: form.address,
        city: form.city,
        state: form.state,
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong while submitting.");
      }

      setSuccess("Your light was submitted successfully.");

      setForm({
        title: "",
        description: "",
        website: "",
        categories: [],
        address: "",
        city: "",
        state: "",
      });

      setAddressQuery("");
      setSuggestions([]);

      setTimeout(() => {
        window.location.href = "/map";
      }, 700);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong while submitting.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 20px 80px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>Add a light</h1>

      <p style={{ marginTop: 0, marginBottom: 24, lineHeight: 1.5 }}>
        Share a life-supporting business, place, project, or resource so others can find
        what is already alive nearby.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <div>
          <label htmlFor="title" style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            Name of listing
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Awakening Garden Farm"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
          >
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Tell people what this place offers and why it matters."
            rows={5}
            style={textareaStyle}
          />
        </div>

        <div>
          <label
            htmlFor="website"
            style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
          >
            Website
          </label>
          <input
            id="website"
            type="url"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="https://"
            style={inputStyle}
          />
        </div>

        <div>
          <div style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
            Category — check all that apply
          </div>

          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 12,
              display: "grid",
              gap: 10,
            }}
          >
            {CATEGORY_OPTIONS.map((category) => (
              <label
                key={category}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <label
            htmlFor="address"
            style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
          >
            Street address
          </label>
          <input
            id="address"
            type="text"
            value={addressQuery}
            onChange={(e) => {
              const value = e.target.value;
              setAddressQuery(value);
              updateField("address", value);
            }}
            placeholder="123 Main St or Ashland Food Co-op"
            required
            style={inputStyle}
            autoComplete="off"
          />

          {suggestions.length > 0 ? (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 20,
                marginTop: 6,
                border: "1px solid #ccc",
                borderRadius: 10,
                background: "#fff",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              {suggestions.map((feature, index) => {
                const label =
                  feature?.properties?.full_address ||
                  feature?.place_name ||
                  feature?.properties?.name ||
                  "Suggested address";

                return (
                  <button
                    key={feature?.id || index}
                    type="button"
                    onClick={() => handleSuggestionSelect(feature)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      border: "none",
                      borderBottom:
                        index === suggestions.length - 1 ? "none" : "1px solid #eee",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="city" style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            City
          </label>
          <input
            id="city"
            type="text"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            placeholder="Fairfield"
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="state" style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            State
          </label>
          <select
            id="state"
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select a state</option>
            {STATE_OPTIONS.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #111",
            background: submitting ? "#ddd" : "#111",
            color: "#fff",
            fontWeight: 600,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit light"}
        </button>

        {error ? (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #d99",
              background: "#fff5f5",
              color: "#8a1f1f",
            }}
          >
            {error}
          </div>
        ) : null}

        {success ? (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #b7d7b7",
              background: "#f4fff4",
              color: "#1f5e1f",
            }}
          >
            {success}
          </div>
        ) : null}
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #ccc",
  fontSize: "1rem",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
};