"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_OPTIONS = [
  "Food & Nourishment","Home & Shelter","Health & Wellbeing","Energy & Infrastructure",
  "Land & Ecology","Materials & Goods","Learning & Education","Travel & Movement",
  "Community & Culture","Conflict Transformation & Repair","Finance & Systems",
];

const PRACTICE_OPTIONS = [
  "Organic","Regenerative","Permaculture","Fair Trade","Biodegradable","Compostable",
  "Recycled Materials","Upcycled Materials","Low Waste","Zero Waste","Local",
  "Worker-Owned / Cooperative","Community Owned","Renewable Energy","Educational",
  "Accessible / Sliding Scale","Volunteer Run","Nonprofit / Mission Driven",
  "Indigenous Led","Women Led","Trauma-Informed","Restorative","Somatic","Nonviolent",
  "Peer Supported","Community Led","Justice-Oriented","Natural Practices","Non-GMO",
  "Grass-Fed","Ethically Sourced/Raised","Free-Range","Organic Options",
];

type AffiliateResource = {
  id: number;
  name: string;
  description: string | null;
  url: string | null;
  affiliate_url: string | null;
  why_it_matters: string | null;
  logo_url: string | null;
  category: string[] | null;
  practices: string[] | null;
  status: string;
  contributor_id: string | null;
  contributor_name: string | null;
  created_at: string;
};

type Contributor = {
  id: string;
  name: string;
  email: string;
  slug: string;
  created_at: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 10,
  border: "1px solid rgba(100,150,220,0.2)", background: "rgba(255,255,255,0.6)",
  color: "#0d2a4a", fontSize: "0.9rem", outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block", marginBottom: 6, fontSize: "0.85rem",
  fontWeight: 600, color: "#0d2a4a",
};

function CategoryPicker({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {CATEGORY_OPTIONS.map((cat) => {
        const sel = selected.includes(cat);
        const disabled = !sel && selected.length >= 5;
        return (
          <button key={cat} type="button"
            onClick={() => !disabled && onChange(sel ? selected.filter(c => c !== cat) : [...selected, cat])}
            style={{ borderRadius: 999, border: sel ? "1px solid rgba(138,109,42,0.35)" : "1px solid rgba(100,150,220,0.2)", padding: "6px 11px", fontSize: "0.8rem", cursor: disabled ? "default" : "pointer", background: sel ? "rgba(255,216,107,0.2)" : "rgba(255,255,255,0.5)", color: sel ? "#6a4f00" : "#3a5a7a", opacity: disabled ? 0.4 : 1 }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function PracticePicker({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {PRACTICE_OPTIONS.map((p) => {
        const sel = selected.includes(p);
        return (
          <button key={p} type="button"
            onClick={() => onChange(sel ? selected.filter(x => x !== p) : [...selected, p])}
            style={{ borderRadius: 999, border: sel ? "1px solid rgba(138,109,42,0.35)" : "1px solid rgba(100,150,220,0.2)", padding: "6px 11px", fontSize: "0.8rem", cursor: "pointer", background: sel ? "rgba(255,216,107,0.2)" : "rgba(255,255,255,0.5)", color: sel ? "#6a4f00" : "#3a5a7a" }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}

function truncate(s: string | null | undefined, len: number) {
  if (!s) return "";
  return s.length > len ? s.slice(0, len) + "…" : s;
}

export default function AffiliatesAdmin() {
  const router = useRouter();

  // ── Resources state ──
  const [resources, setResources] = useState<AffiliateResource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [resourcesErr, setResourcesErr] = useState<string | null>(null);

  // ── Edit resource state ──
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editAffiliateUrl, setEditAffiliateUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editWhyItMatters, setEditWhyItMatters] = useState("");
  const [editLogoUrl, setEditLogoUrl] = useState("");
  const [editCategory, setEditCategory] = useState<string[]>([]);
  const [editPractices, setEditPractices] = useState<string[]>([]);
  const [editStatus, setEditStatus] = useState("approved");
  const [saving, setSaving] = useState(false);
  const [editErr, setEditErr] = useState<string | null>(null);

  // ── Delete state ──
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Add new resource state ──
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addAffiliateUrl, setAddAffiliateUrl] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addWhyItMatters, setAddWhyItMatters] = useState("");
  const [addLogoUrl, setAddLogoUrl] = useState("");
  const [addCategory, setAddCategory] = useState<string[]>([]);
  const [addPractices, setAddPractices] = useState<string[]>([]);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addOk, setAddOk] = useState(false);
  const [addErr, setAddErr] = useState<string | null>(null);

  // ── Contributors state ──
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loadingContributors, setLoadingContributors] = useState(true);

  // ── Add contributor state ──
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cSlug, setCSlug] = useState("");
  const [cSlugEdited, setCSlugEdited] = useState(false);
  const [cSubmitting, setCSubmitting] = useState(false);
  const [cOk, setCOk] = useState<string | null>(null);
  const [cErr, setCErr] = useState<string | null>(null);

  useEffect(() => { loadResources(); loadContributors(); }, []);

  // Auto-derive slug from name unless the user has manually edited it
  useEffect(() => {
    if (!cSlugEdited) {
      setCSlug(cName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }, [cName, cSlugEdited]);

  async function loadResources() {
    setLoadingResources(true);
    setResourcesErr(null);
    try {
      const res = await fetch("/api/admin/affiliates");
      if (!res.ok) { setResourcesErr("Failed to load resources."); return; }
      setResources(await res.json());
    } catch { setResourcesErr("Failed to load resources."); }
    finally { setLoadingResources(false); }
  }

  async function loadContributors() {
    setLoadingContributors(true);
    try {
      const res = await fetch("/api/admin/contributors");
      if (res.ok) setContributors(await res.json());
    } catch { /* quiet */ }
    finally { setLoadingContributors(false); }
  }

  function startEdit(r: AffiliateResource) {
    setEditingId(r.id);
    setEditName(r.name || "");
    setEditUrl(r.url || "");
    setEditAffiliateUrl(r.affiliate_url || "");
    setEditDescription(r.description || "");
    setEditWhyItMatters(r.why_it_matters || "");
    setEditLogoUrl(r.logo_url || "");
    setEditCategory(r.category ?? []);
    setEditPractices(r.practices ?? []);
    setEditStatus(r.status || "approved");
    setEditErr(null);
    setDeleteConfirmId(null);
  }

  async function handleSave(id: number) {
    setSaving(true);
    setEditErr(null);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editName, url: editUrl, affiliate_url: editAffiliateUrl, description: editDescription, why_it_matters: editWhyItMatters, logo_url: editLogoUrl, category: editCategory, practices: editPractices, status: editStatus }),
      });
      if (res.ok) {
        setEditingId(null);
        await loadResources();
      } else {
        const d = await res.json();
        setEditErr(d.error || "Save failed.");
      }
    } catch { setEditErr("Save failed."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/affiliates?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirmId(null);
        setResources(prev => prev.filter(r => r.id !== id));
      }
    } catch { /* quiet */ }
    finally { setDeleting(false); }
  }

  async function handleAddResource(e: React.FormEvent) {
    e.preventDefault();
    setAddSubmitting(true);
    setAddErr(null);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: addName, url: addUrl, affiliate_url: addAffiliateUrl, description: addDescription, why_it_matters: addWhyItMatters, logo_url: addLogoUrl, category: addCategory, practices: addPractices, status: "approved" }),
      });
      if (res.ok) {
        setAddName(""); setAddUrl(""); setAddAffiliateUrl(""); setAddDescription("");
        setAddWhyItMatters(""); setAddLogoUrl(""); setAddCategory([]); setAddPractices([]);
        setAddOk(true);
        setTimeout(() => setAddOk(false), 2500);
        await loadResources();
      } else {
        const d = await res.json();
        setAddErr(d.error || "Failed to add resource.");
      }
    } catch { setAddErr("Failed to add resource."); }
    finally { setAddSubmitting(false); }
  }

  async function handleAddContributor(e: React.FormEvent) {
    e.preventDefault();
    setCSubmitting(true);
    setCErr(null);
    setCOk(null);
    try {
      const res = await fetch("/api/admin/contributors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cName, email: cEmail, slug: cSlug }),
      });
      const d = await res.json();
      if (res.ok) {
        setCOk(`/contributor/${d.slug}`);
        setCName(""); setCEmail(""); setCSlug(""); setCSlugEdited(false);
        await loadContributors();
      } else {
        setCErr(d.error || "Failed to create contributor.");
      }
    } catch { setCErr("Failed to create contributor."); }
    finally { setCSubmitting(false); }
  }

  const sectionHead: React.CSSProperties = {
    fontSize: "1.05rem", fontWeight: 650, color: "#8a6d2a", margin: "0 0 14px",
  };
  const divider = { height: 1, background: "rgba(100,150,220,0.15)", margin: "28px 0" };

  return (
    <div>
      {/* ── Resources section ── */}
      <h3 style={sectionHead}>
        Online Resources ({resources.length})
      </h3>

      {resourcesErr && <p style={{ color: "#a04040", fontSize: "0.88rem", margin: "0 0 14px" }}>{resourcesErr}</p>}

      {loadingResources ? (
        <p style={{ color: "#4a5d73", fontSize: "0.9rem" }}>Loading…</p>
      ) : resources.length === 0 ? (
        <p style={{ color: "#4a5d73", fontSize: "0.9rem", fontStyle: "italic" }}>No resources yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
          {resources.map((r) => {
            const isEditing = editingId === r.id;
            const isDeleting = deleteConfirmId === r.id;

            if (isEditing) {
              return (
                <div key={r.id} style={{ padding: 16, borderRadius: 14, border: "1px solid rgba(255,200,80,0.3)", background: "rgba(255,248,230,0.6)" }}>
                  <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={labelStyle}>Name</label>
                        <input style={inputStyle} value={editName} onChange={e => setEditName(e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Status</label>
                        <select style={inputStyle} value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                          <option value="approved">approved</option>
                          <option value="pending">pending</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Display URL</label>
                      <input style={inputStyle} value={editUrl} onChange={e => setEditUrl(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Affiliate tracking link</label>
                      <input style={inputStyle} value={editAffiliateUrl} onChange={e => setEditAffiliateUrl(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Logo / image URL</label>
                      <input style={inputStyle} value={editLogoUrl} onChange={e => setEditLogoUrl(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Description</label>
                      <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Why it matters</label>
                      <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={editWhyItMatters} onChange={e => setEditWhyItMatters(e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <CategoryPicker selected={editCategory} onChange={setEditCategory} />
                    </div>
                    <div>
                      <label style={labelStyle}>Practices</label>
                      <PracticePicker selected={editPractices} onChange={setEditPractices} />
                    </div>
                  </div>
                  {editErr && <p style={{ color: "#a04040", fontSize: "0.82rem", margin: "0 0 10px" }}>{editErr}</p>}
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button type="button" onClick={() => handleSave(r.id)} disabled={saving} style={{ padding: "8px 18px", borderRadius: 999, border: "none", background: "#FFD86B", color: "#1a2a0e", fontWeight: 700, fontSize: "0.88rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "none", color: "#4a5d73", fontSize: "0.82rem", cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              );
            }

            return (
              <div key={r.id} style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(100,150,220,0.15)", background: "rgba(255,255,255,0.5)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 650, color: "#0d2a4a", fontSize: "0.95rem" }}>{r.name}</span>
                      <span style={{
                        padding: "2px 8px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 600,
                        background: r.status === "approved" ? "rgba(42,106,58,0.1)" : "rgba(180,140,30,0.12)",
                        color: r.status === "approved" ? "#1a5c30" : "#7a5a00",
                      }}>
                        {r.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#5a6b80", marginTop: 3 }}>
                      {[
                        r.contributor_name ? `by ${r.contributor_name}` : "direct entry",
                        r.category?.join(", ") || "no category",
                        truncate(r.url, 40),
                      ].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button type="button" onClick={() => startEdit(r)} style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(100,150,220,0.2)", background: "rgba(255,255,255,0.6)", color: "#3a5a7a", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>Edit</button>
                    <button type="button" onClick={() => setDeleteConfirmId(isDeleting ? null : r.id)} style={{ padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(180,100,100,0.2)", background: "rgba(255,240,240,0.4)", color: "#8a4040", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
                {isDeleting && (
                  <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(255,240,240,0.6)", border: "1px solid rgba(180,100,100,0.15)" }}>
                    <p style={{ fontSize: "0.83rem", color: "#6a2020", margin: "0 0 8px" }}>Delete "{r.name}"? This cannot be undone.</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" onClick={() => handleDelete(r.id)} disabled={deleting} style={{ padding: "6px 14px", borderRadius: 999, border: "none", background: deleting ? "rgba(180,100,100,0.4)" : "rgba(180,80,80,0.85)", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer" }}>
                        {deleting ? "Deleting…" : "Confirm delete"}
                      </button>
                      <button type="button" onClick={() => setDeleteConfirmId(null)} style={{ background: "none", border: "none", color: "#4a5d73", fontSize: "0.8rem", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add new resource ── */}
      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() => setAddOpen(o => !o)}
          style={{ background: addOpen ? "rgba(255,216,107,0.18)" : "rgba(255,255,255,0.4)", border: "1px solid rgba(138,109,42,0.18)", borderRadius: 10, padding: "8px 16px", fontSize: "0.88rem", fontWeight: 600, color: "#6a4f00", cursor: "pointer" }}
        >
          {addOpen ? "▾ Add new resource" : "▸ Add new resource"}
        </button>

        {addOpen && (
          <form onSubmit={handleAddResource} style={{ marginTop: 14, display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} value={addName} onChange={e => setAddName(e.target.value)} required placeholder="Resource name" />
              </div>
              <div>
                <label style={labelStyle}>Display URL *</label>
                <input style={inputStyle} value={addUrl} onChange={e => setAddUrl(e.target.value)} required placeholder="https://example.com" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Affiliate tracking link</label>
                <input style={inputStyle} value={addAffiliateUrl} onChange={e => setAddAffiliateUrl(e.target.value)} placeholder="https://example.com/?ref=canary" />
              </div>
              <div>
                <label style={labelStyle}>Logo / image URL</label>
                <input style={inputStyle} value={addLogoUrl} onChange={e => setAddLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={addDescription} onChange={e => setAddDescription(e.target.value)} required placeholder="Short description" />
            </div>
            <div>
              <label style={labelStyle}>Why it matters</label>
              <textarea style={{ ...inputStyle, resize: "vertical" }} rows={2} value={addWhyItMatters} onChange={e => setAddWhyItMatters(e.target.value)} placeholder="Italic tagline shown on cards" />
            </div>
            <div>
              <label style={labelStyle}>Category * (up to 5)</label>
              <CategoryPicker selected={addCategory} onChange={setAddCategory} />
            </div>
            <div>
              <label style={labelStyle}>Practices / Values</label>
              <PracticePicker selected={addPractices} onChange={setAddPractices} />
            </div>
            {addErr && <p style={{ color: "#a04040", fontSize: "0.85rem", margin: 0 }}>{addErr}</p>}
            {addOk && <p style={{ color: "#2a6a3a", fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>Added ✓ — live now.</p>}
            <button type="submit" disabled={addSubmitting || !addName || !addUrl || !addDescription || addCategory.length === 0}
              style={{ padding: "10px 20px", borderRadius: 999, border: "none", background: "#FFD86B", color: "#1a2a0e", fontWeight: 700, fontSize: "0.92rem", cursor: (addSubmitting || !addName || !addUrl || !addDescription || addCategory.length === 0) ? "not-allowed" : "pointer", opacity: (addSubmitting || !addName || !addUrl || !addDescription || addCategory.length === 0) ? 0.6 : 1, alignSelf: "start" }}>
              {addSubmitting ? "Adding…" : "Add resource"}
            </button>
          </form>
        )}
      </div>

      <div style={divider} />

      {/* ── Contributors section ── */}
      <h3 style={sectionHead}>Contributors</h3>
      <p style={{ fontSize: "0.85rem", color: "#4a5d73", margin: "0 0 14px" }}>
        People with their own submission link. Lucia has a separate hardcoded link at{" "}
        <code style={{ fontSize: "0.82rem", background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>/contributor/submit</code>
        {" "}and is not in this list.
      </p>

      {loadingContributors ? (
        <p style={{ color: "#4a5d73", fontSize: "0.88rem" }}>Loading…</p>
      ) : contributors.length === 0 ? (
        <p style={{ color: "#4a5d73", fontSize: "0.88rem", fontStyle: "italic" }}>No contributors yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {contributors.map((c) => (
            <div key={c.id} style={{ padding: "11px 14px", borderRadius: 12, border: "1px solid rgba(100,150,220,0.15)", background: "rgba(255,255,255,0.5)" }}>
              <div style={{ fontWeight: 650, color: "#0d2a4a", fontSize: "0.92rem" }}>{c.name}</div>
              <div style={{ fontSize: "0.8rem", color: "#5a6b80", marginTop: 2 }}>
                {c.email} · <code style={{ fontSize: "0.78rem" }}>/contributor/{c.slug}</code>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add contributor form ── */}
      <div style={{ marginTop: 8, padding: "16px 18px", borderRadius: 14, border: "1px solid rgba(100,150,220,0.18)", background: "rgba(255,255,255,0.4)" }}>
        <h4 style={{ fontSize: "0.92rem", fontWeight: 650, color: "#0d2a4a", margin: "0 0 14px" }}>Add contributor</h4>
        <form onSubmit={handleAddContributor} style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={cName} onChange={e => setCName(e.target.value)} required placeholder="Renee" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" style={inputStyle} value={cEmail} onChange={e => setCEmail(e.target.value)} required placeholder="renee@example.com" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>URL handle (auto-derived, editable)</label>
            <input
              style={{ ...inputStyle, fontFamily: "monospace", fontSize: "0.85rem" }}
              value={cSlug}
              onChange={e => { setCSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setCSlugEdited(true); }}
              required
              placeholder="renee"
            />
            {cSlug && (
              <p style={{ fontSize: "0.78rem", color: "#4a5d73", margin: "5px 0 0" }}>
                Their link: <strong>/contributor/{cSlug}</strong>
              </p>
            )}
          </div>
          {cErr && <p style={{ color: "#a04040", fontSize: "0.85rem", margin: 0 }}>{cErr}</p>}
          {cOk && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(42,106,58,0.08)", border: "1px solid rgba(42,106,58,0.18)" }}>
              <p style={{ color: "#1a5c30", fontSize: "0.85rem", fontWeight: 600, margin: "0 0 4px" }}>Contributor created ✓</p>
              <p style={{ color: "#2a6a3a", fontSize: "0.85rem", margin: 0 }}>
                Send them this link: <strong>{cOk}</strong> (and <strong>{cOk}/submit</strong> to add resources)
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={cSubmitting || !cName || !cEmail || !cSlug}
            style={{ padding: "9px 18px", borderRadius: 999, border: "none", background: "#FFD86B", color: "#1a2a0e", fontWeight: 700, fontSize: "0.88rem", cursor: (cSubmitting || !cName || !cEmail || !cSlug) ? "not-allowed" : "pointer", opacity: (cSubmitting || !cName || !cEmail || !cSlug) ? 0.6 : 1, alignSelf: "start" }}
          >
            {cSubmitting ? "Creating…" : "Create contributor"}
          </button>
        </form>
      </div>
    </div>
  );
}
