"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PRIMARY_CATEGORY_OPTIONS = [
  "Food & Nourishment",
  "Home & Shelter",
  "Health & Wellbeing",
  "Energy & Infrastructure",
  "Land & Ecology",
  "Materials & Goods",
  "Learning & Education",
  "Travel & Movement",
  "Community & Culture",
  "Conflict Transformation & Repair",
  "Finance & Systems",
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
  "Trauma-Informed",
  "Restorative",
  "Somatic",
  "Nonviolent",
  "Peer Supported",
  "Community Led",
  "Justice-Oriented",
];

type Resource = {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  category: string | null;
  practices: string[] | null;
  affiliate_url: string | null;
  why_it_matters: string | null;
  image_url: string | null;
  created_at: string | null;
};

const orbs: { left: string; top: string; size: number; opacity: number }[] = [
  { left: "6%", top: "8%", size: 5, opacity: 0.6 },
  { left: "18%", top: "15%", size: 3, opacity: 0.45 },
  { left: "32%", top: "6%", size: 6, opacity: 0.65 },
  { left: "48%", top: "22%", size: 4, opacity: 0.5 },
  { left: "64%", top: "12%", size: 7, opacity: 0.7 },
  { left: "82%", top: "18%", size: 4, opacity: 0.55 },
  { left: "10%", top: "38%", size: 6, opacity: 0.65 },
  { left: "42%", top: "44%", size: 3, opacity: 0.4 },
  { left: "72%", top: "40%", size: 8, opacity: 0.7 },
  { left: "22%", top: "68%", size: 5, opacity: 0.55 },
  { left: "56%", top: "72%", size: 4, opacity: 0.5 },
  { left: "88%", top: "85%", size: 6, opacity: 0.6 },
];

function Atmosphere() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(180,210,255,0.9) 0%, rgba(120,170,230,0.85) 25%, rgba(70,120,200,0.9) 60%, rgba(30,70,150,1) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.18) 0%, transparent 58%)",
          pointerEvents: "none",
        }}
      />
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: "rgba(255,244,200,0.65)",
            opacity: orb.opacity,
            boxShadow:
              "0 0 8px 3px rgba(255,220,140,0.18), 0 0 20px 5px rgba(255,200,100,0.08)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

function truncate(str: string | null, len: number): string {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

export default function ContributorSubmitPage() {
  const router = useRouter();

  // ── Existing resources ──
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  // ── Edit state ──
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCategory, setEditCategory] = useState<string[]>([]);
  const [editAffiliateUrl, setEditAffiliateUrl] = useState("");
  const [editWhyItMatters, setEditWhyItMatters] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editPractices, setEditPractices] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── New submission state ──
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [description, setDescription] = useState("");
  const [whyItMatters, setWhyItMatters] = useState("");
  const [practices, setPractices] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoadingResources(true);
    try {
      const res = await fetch("/api/contributor");
      if (res.ok) {
        const data = await res.json();
        setResources(data);
      } else {
        showFlash("Something went wrong — please refresh.", 4000);
      }
    } catch {
      showFlash("Something went wrong — please refresh.", 4000);
    } finally {
      setLoadingResources(false);
    }
  }

  function showFlash(msg: string, durationMs = 2500) {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), durationMs);
  }

  function startEdit(r: Resource) {
    setEditingId(r.id);
    setEditName(r.name || "");
    setEditDescription(r.description || "");
    setEditUrl(r.url || "");
    setEditCategory(Array.isArray(r.category) ? r.category : r.category ? [r.category] : []);
    setEditAffiliateUrl(r.affiliate_url || "");
    setEditWhyItMatters(r.why_it_matters || "");
    setEditImageUrl(r.image_url || "");
    setEditPractices(r.practices || []);
    setDeleteConfirmId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleSave(id: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: editName,
          description: editDescription,
          url: editUrl,
          category: editCategory,
          affiliate_url: editAffiliateUrl,
          why_it_matters: editWhyItMatters,
          image_url: editImageUrl,
          practices: editPractices,
        }),
      });
      if (res.ok) {
        setEditingId(null);
        showFlash("Saved. Live now.");
        await fetchResources();
      } else {
        showFlash("Something went wrong — please refresh.", 4000);
      }
    } catch {
      showFlash("Something went wrong — please refresh.", 4000);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/affiliates?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        showFlash("Deleted.");
        setResources((prev) => prev.filter((r) => r.id !== id));
      } else {
        showFlash("Something went wrong — please refresh.", 4000);
      }
    } catch {
      showFlash("Something went wrong — please refresh.", 4000);
    } finally {
      setDeleting(false);
    }
  }

  function togglePractice(practice: string) {
    setPractices((current) =>
      current.includes(practice)
        ? current.filter((item) => item !== practice)
        : [...current, practice]
    );
  }

  function toggleEditPractice(practice: string) {
    setEditPractices((current) =>
      current.includes(practice)
        ? current.filter((item) => item !== practice)
        : [...current, practice]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          url,
          image_url: imageUrl,
          affiliate_url: affiliateUrl,
          description,
          why_it_matters: whyItMatters,
          practices,
          contributor_id: "contributor_001",
          contributor_name: "Lucia",
          status: "approved",
        }),
      });

      if (res.ok) {
        setName("");
        setCategory([]);
        setUrl("");
        setImageUrl("");
        setAffiliateUrl("");
        setDescription("");
        setWhyItMatters("");
        setPractices([]);
        showFlash("Added. Live now.");
        await fetchResources();
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 12,
    border: "1px solid rgba(100,150,220,0.25)",
    background: "rgba(255,255,255,0.9)",
    color: "#0d2a4a",
    fontSize: "0.98rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 8,
    fontSize: "0.92rem",
    fontWeight: 600,
    color: "#0d2a4a",
  };

  const helperStyle: React.CSSProperties = {
    marginTop: 0,
    marginBottom: 10,
    color: "#3a5a7a",
    lineHeight: 1.55,
    fontSize: "0.9rem",
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(12px)",
    padding: "clamp(24px, 4vw, 36px)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#0d2a4a",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(44px, 7vw, 72px) 20px 72px",
      }}
    >
      <Atmosphere />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontSize: "0.82rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.7)",
            margin: 0,
            marginBottom: 16,
          }}
        >
          Canary Commons
        </p>

        {/* ── Flash message ── */}
        {flashMessage && (
          <div
            style={{
              position: "fixed",
              top: 24,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 24px",
              borderRadius: 999,
              background: "rgba(255,216,107,0.95)",
              color: "#1a2a0e",
              fontWeight: 700,
              fontSize: "0.9rem",
              zIndex: 100,
              boxShadow: "0 4px 20px rgba(255,200,80,0.3)",
            }}
          >
            {flashMessage}
          </div>
        )}

        {/* ── Greeting ── */}
        <div style={cardStyle}>
          <h1
            style={{
              fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
              lineHeight: 1.25,
              margin: 0,
              marginBottom: 8,
              fontWeight: 650,
              color: "#8a6d2a",
            }}
          >
            Hi, Lucia — thanks for adding more online affiliate resources.
          </h1>

          {/* ── Existing resources ── */}
          <div style={{ marginTop: 24 }}>
            <h2
              style={{
                fontSize: "1.05rem",
                fontWeight: 650,
                color: "#0d2a4a",
                margin: "0 0 14px",
              }}
            >
              Your resources ({resources.length})
            </h2>

            {loadingResources ? (
              <p style={{ color: "#3a5a7a", fontSize: "0.9rem" }}>
                Loading...
              </p>
            ) : resources.length === 0 ? (
              <p
                style={{
                  color: "#3a5a7a",
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                }}
              >
                No resources yet. Add your first one below.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {resources.map((r) => {
                  const isEditing = editingId === r.id;
                  const isDeleting = deleteConfirmId === r.id;

                  if (isEditing) {
                    return (
                      <div
                        key={r.id}
                        style={{
                          padding: "16px",
                          borderRadius: 14,
                          border: "1px solid rgba(255,200,80,0.3)",
                          background: "rgba(255,248,230,0.5)",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gap: 12,
                            marginBottom: 14,
                          }}
                        >
                          <div>
                            <label style={labelStyle}>Name</label>
                            <input
                              style={inputStyle}
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Category (up to 5)</label>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {PRIMARY_CATEGORY_OPTIONS.map((cat) => {
                                const isSelected = editCategory.includes(cat);
                                const isDisabled = !isSelected && editCategory.length >= 5;
                                return (
                                  <button key={cat} type="button" onClick={() => !isDisabled && setEditCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])} style={{ borderRadius: 999, border: isSelected ? "1px solid rgba(255,200,80,0.45)" : "1px solid rgba(100,150,220,0.22)", padding: "8px 12px", fontSize: "0.85rem", cursor: isDisabled ? "default" : "pointer", background: isSelected ? "rgba(255,216,107,0.18)" : "rgba(255,255,255,0.7)", color: isSelected ? "#7a4f00" : "#3a5a7a", opacity: isDisabled ? 0.4 : 1 }}>
                                    {cat}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div>
                            <label style={labelStyle}>Display URL</label>
                            <input
                              style={inputStyle}
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>
                              Affiliate tracking link
                            </label>
                            <input
                              style={inputStyle}
                              value={editAffiliateUrl}
                              onChange={(e) =>
                                setEditAffiliateUrl(e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>
                              Image / logo URL
                            </label>
                            <input
                              style={inputStyle}
                              value={editImageUrl}
                              onChange={(e) =>
                                setEditImageUrl(e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Description</label>
                            <textarea
                              style={{ ...inputStyle, resize: "vertical" }}
                              rows={3}
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>Why it matters</label>
                            <textarea
                              style={{ ...inputStyle, resize: "vertical" }}
                              rows={3}
                              value={editWhyItMatters}
                              onChange={(e) =>
                                setEditWhyItMatters(e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label style={labelStyle}>
                              Practices / Values
                            </label>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 8,
                              }}
                            >
                              {PRACTICE_OPTIONS.map((p) => {
                                const sel = editPractices.includes(p);
                                return (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => toggleEditPractice(p)}
                                    style={{
                                      borderRadius: 999,
                                      border: sel
                                        ? "1px solid rgba(255,200,80,0.45)"
                                        : "1px solid rgba(100,150,220,0.22)",
                                      padding: "8px 12px",
                                      fontSize: "0.85rem",
                                      cursor: "pointer",
                                      background: sel
                                        ? "rgba(255,216,107,0.18)"
                                        : "rgba(255,255,255,0.7)",
                                      color: sel ? "#7a4f00" : "#3a5a7a",
                                    }}
                                  >
                                    {p}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleSave(r.id)}
                            disabled={saving}
                            style={{
                              padding: "10px 20px",
                              borderRadius: 999,
                              border: "none",
                              background: "#FFD86B",
                              color: "#1a2a0e",
                              fontWeight: 700,
                              fontSize: "0.9rem",
                              cursor: saving ? "not-allowed" : "pointer",
                              opacity: saving ? 0.7 : 1,
                              boxShadow:
                                "0 0 20px rgba(255,216,107,0.25), 0 4px 14px rgba(255,200,80,0.18)",
                            }}
                          >
                            {saving ? "Saving…" : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#3a5a7a",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={r.id}
                      style={{
                        padding: "14px 16px",
                        borderRadius: 14,
                        border: "1px solid rgba(100,150,220,0.15)",
                        background: "rgba(255,255,255,0.5)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 650,
                              color: "#0d2a4a",
                              fontSize: "0.95rem",
                            }}
                          >
                            {r.name}
                          </div>
                          {r.url && (
                            <div
                              style={{
                                fontSize: "0.8rem",
                                color: "#6b7c94",
                                marginTop: 2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {truncate(r.url, 50)}
                            </div>
                          )}
                          {r.description && (
                            <div
                              style={{
                                fontSize: "0.82rem",
                                color: "#3a5a7a",
                                marginTop: 4,
                                lineHeight: 1.5,
                              }}
                            >
                              {truncate(r.description, 120)}
                            </div>
                          )}
                          {(r.category ||
                            (r.practices && r.practices.length > 0)) && (
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 6,
                                marginTop: 8,
                              }}
                            >
                              {r.category && (Array.isArray(r.category) ? r.category.length > 0 : true) && (
                                (Array.isArray(r.category) ? r.category : [r.category]).map((cat) => (
                                  <span
                                    key={cat}
                                    style={{
                                      fontSize: "0.72rem",
                                      padding: "3px 8px",
                                      borderRadius: 999,
                                      background: "rgba(255,216,107,0.18)",
                                      color: "#7a4f00",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {cat}
                                  </span>
                                ))
                              )}
                              {r.practices?.map((p) => (
                                <span
                                  key={p}
                                  style={{
                                    fontSize: "0.72rem",
                                    padding: "3px 8px",
                                    borderRadius: 999,
                                    background: "rgba(100,150,220,0.1)",
                                    color: "#3a5a7a",
                                  }}
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexShrink: 0,
                            paddingTop: 2,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => startEdit(r)}
                            style={{
                              padding: "4px 12px",
                              borderRadius: 999,
                              border: "1px solid rgba(100,150,220,0.2)",
                              background: "rgba(255,255,255,0.6)",
                              color: "#3a5a7a",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteConfirmId(
                                isDeleting ? null : r.id
                              )
                            }
                            style={{
                              padding: "4px 12px",
                              borderRadius: 999,
                              border: "1px solid rgba(180,100,100,0.2)",
                              background: "rgba(255,240,240,0.4)",
                              color: "#8a4040",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Delete confirm */}
                      {isDeleting && (
                        <div
                          style={{
                            marginTop: 12,
                            padding: "12px 14px",
                            borderRadius: 10,
                            background: "rgba(255,240,240,0.6)",
                            border: "1px solid rgba(180,100,100,0.15)",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "0.85rem",
                              color: "#6a2020",
                              margin: "0 0 10px",
                            }}
                          >
                            Delete this listing? This cannot be undone.
                          </p>
                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleDelete(r.id)}
                              disabled={deleting}
                              style={{
                                padding: "8px 16px",
                                borderRadius: 999,
                                border: "none",
                                background: deleting
                                  ? "rgba(180,100,100,0.4)"
                                  : "rgba(180,80,80,0.85)",
                                color: "#fff",
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                cursor: deleting
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              {deleting ? "Deleting…" : "Confirm delete"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#3a5a7a",
                                fontSize: "0.82rem",
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Submit form ── */}
        <div style={{ ...cardStyle, marginTop: 20 }}>
          <h2
            style={{
              fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)",
              lineHeight: 1.18,
              margin: 0,
              marginBottom: 14,
              fontWeight: 650,
              color: "#0d2a4a",
            }}
          >
            Add a new resource
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <input
              placeholder="Resource name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />

            <div>
              <label style={labelStyle}>Primary Category (up to 5)</label>
              <p style={helperStyle}>
                Choose the main areas of life this resource belongs to.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PRIMARY_CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = category.includes(cat);
                  const isDisabled = !isSelected && category.length >= 5;
                  return (
                    <button key={cat} type="button" onClick={() => !isDisabled && setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])} style={{ borderRadius: 999, border: isSelected ? "1px solid rgba(255,200,80,0.45)" : "1px solid rgba(100,150,220,0.22)", padding: "8px 12px", fontSize: "0.85rem", cursor: isDisabled ? "default" : "pointer", background: isSelected ? "rgba(255,216,107,0.18)" : "rgba(255,255,255,0.7)", color: isSelected ? "#7a4f00" : "#3a5a7a", opacity: isDisabled ? 0.4 : 1 }}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Display URL — the clean link people will see
              </label>
              <input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Image or logo URL (optional)</label>
              <p style={helperStyle}>
                Right-click any image on their website → Copy Image Address
              </p>
              <input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Affiliate tracking link</label>
              <p style={helperStyle}>
                The full tracking URL for this resource
              </p>
              <input
                placeholder="https://example.com/?ref=canary"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                style={inputStyle}
              />
            </div>

            <textarea
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />

            <div>
              <label style={labelStyle}>Why it matters</label>
              <textarea
                placeholder="Why does this belong here? What life-forward direction does it support?"
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <div>
              <label style={labelStyle}>Practices / Values</label>
              <p style={{ ...helperStyle, fontStyle: "italic" }}>
                Mark all that apply.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {PRACTICE_OPTIONS.map((practice) => {
                  const isSelected = practices.includes(practice);

                  return (
                    <button
                      key={practice}
                      type="button"
                      onClick={() => togglePractice(practice)}
                      style={{
                        borderRadius: 999,
                        border: isSelected
                          ? "1px solid rgba(255,200,80,0.45)"
                          : "1px solid rgba(100,150,220,0.22)",
                        padding: "10px 14px",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        background: isSelected
                          ? "rgba(255,216,107,0.18)"
                          : "rgba(255,255,255,0.7)",
                        color: isSelected ? "#7a4f00" : "#3a5a7a",
                      }}
                    >
                      {practice}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: 8,
                padding: "15px 20px",
                borderRadius: 999,
                border: "none",
                background: "#FFD86B",
                color: "#1a2a0e",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow:
                  "0 0 28px rgba(255,216,107,0.35), 0 4px 14px rgba(255,200,80,0.22)",
                opacity: submitting ? 0.8 : 1,
              }}
            >
              {submitting ? "Submitting..." : "Add resource"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
