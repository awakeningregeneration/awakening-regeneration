"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────

type Topic = {
  id: string;
  slug: string;
  title: string;
  subheader: string;
  sort_order: number;
};

type Approach = {
  id: string;
  topic_id: string;
  name: string;
  description: string;
  sort_order: number;
};

type Example = {
  id: string;
  title: string;
  url: string;
  summary: string;
  favicon_url: string | null;
};

type View = "topics" | "topic" | "approach";

// ── Shared styles ────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(100,150,220,0.2)",
  background: "rgba(255,255,255,0.6)",
  color: "#0d2a4a",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 72,
  fontFamily: "inherit",
};

const cardStyle: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid rgba(100,150,220,0.15)",
  background: "rgba(255,255,255,0.5)",
  padding: "12px 16px",
};

const goldBtn: React.CSSProperties = {
  background: "#FFD86B",
  color: "#1a2a0e",
  fontWeight: 700,
  borderRadius: 999,
  border: "none",
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "0.9rem",
};

const smallBtn: React.CSSProperties = {
  background: "none",
  border: "1px solid rgba(100,150,220,0.2)",
  borderRadius: 8,
  padding: "4px 10px",
  fontSize: "0.8rem",
  color: "#4a5d73",
  cursor: "pointer",
};

const reorderBtn: React.CSSProperties = {
  background: "none",
  border: "1px solid rgba(100,150,220,0.15)",
  borderRadius: 6,
  padding: "2px 7px",
  fontSize: "0.75rem",
  color: "#4a5d73",
  cursor: "pointer",
  lineHeight: 1.4,
};

const divider: React.CSSProperties = {
  height: 1,
  background: "rgba(100,150,220,0.12)",
  margin: "18px 0",
};

const sectionHeading: React.CSSProperties = {
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#8a6d2a",
  margin: "0 0 10px",
};

function ErrMsg({ msg }: { msg: string }) {
  return (
    <p style={{ fontSize: "0.85rem", color: "#a04040", margin: "8px 0 0" }}>{msg}</p>
  );
}

function OkMsg({ msg }: { msg: string }) {
  return (
    <p style={{ fontSize: "0.85rem", color: "#2a6a3a", margin: "8px 0 0" }}>{msg}</p>
  );
}

// ── Main component ───────────────────────────────────────────

export default function ConstellationAdmin({ handle: _handle }: { handle: string }) {
  const [view, setView] = useState<View>("topics");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedApproach, setSelectedApproach] = useState<Approach | null>(null);

  return (
    <div style={{ marginTop: 4 }}>
      {view === "topics" && (
        <TopicListView
          onSelectTopic={(t) => {
            setSelectedTopic(t);
            setView("topic");
          }}
        />
      )}
      {view === "topic" && selectedTopic && (
        <TopicDetailView
          topic={selectedTopic}
          onBack={() => setView("topics")}
          onSelectApproach={(a) => {
            setSelectedApproach(a);
            setView("approach");
          }}
        />
      )}
      {view === "approach" && selectedApproach && selectedTopic && (
        <ApproachDetailView
          approach={selectedApproach}
          topic={selectedTopic}
          onBack={() => setView("topic")}
        />
      )}
    </div>
  );
}

// ── Topic list view ──────────────────────────────────────────

function TopicListView({ onSelectTopic }: { onSelectTopic: (t: Topic) => void }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSlug, setEditSlug] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSubheader, setEditSubheader] = useState("");
  const [editErr, setEditErr] = useState<string | null>(null);
  const [editOk, setEditOk] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add form state
  const [addSlug, setAddSlug] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [addSubheader, setAddSubheader] = useState("");
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState<string | null>(null);
  const [addOk, setAddOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/admin/constellation/topics");
    if (!res.ok) {
      setErr("Failed to load topics.");
      setLoading(false);
      return;
    }
    setTopics(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function startEdit(t: Topic) {
    setEditingId(t.id);
    setEditSlug(t.slug);
    setEditTitle(t.title);
    setEditSubheader(t.subheader ?? "");
    setEditErr(null);
    setEditOk(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditErr(null);
    setEditOk(null);
  }

  async function saveEdit(id: string) {
    setSavingId(id);
    setEditErr(null);
    setEditOk(null);
    const res = await fetch("/api/admin/constellation/topics", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, slug: editSlug, title: editTitle, subheader: editSubheader }),
    });
    if (!res.ok) {
      const d = await res.json();
      setEditErr(d.error || "Save failed.");
    } else {
      setEditOk("Saved.");
      setEditingId(null);
      await load();
    }
    setSavingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this topic and all its approaches and examples?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/constellation/topics?id=${id}`, { method: "DELETE" });
    setDeletingId(null);
    await load();
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    await fetch("/api/admin/constellation/topics", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, direction }),
    });
    await load();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addSlug.trim() || !addTitle.trim()) return;
    setAdding(true);
    setAddErr(null);
    setAddOk(null);
    const res = await fetch("/api/admin/constellation/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: addSlug.trim(), title: addTitle.trim(), subheader: addSubheader.trim() }),
    });
    if (!res.ok) {
      const d = await res.json();
      setAddErr(d.error || "Failed to add topic.");
    } else {
      setAddOk("Topic added.");
      setAddSlug("");
      setAddTitle("");
      setAddSubheader("");
      await load();
    }
    setAdding(false);
  }

  if (loading) {
    return <p style={{ color: "#4a5d73", fontSize: "0.9rem" }}>Loading topics…</p>;
  }

  return (
    <div>
      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#8a6d2a", margin: "0 0 14px" }}>
        Topics ({topics.length})
      </h3>

      {err && <ErrMsg msg={err} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {topics.length === 0 && !err && (
          <p style={{ fontSize: "0.9rem", color: "#4a5d73", fontStyle: "italic" }}>No topics yet.</p>
        )}
        {topics.map((t, idx) => (
          <div key={t.id} style={cardStyle}>
            {editingId === t.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  style={inputStyle}
                  placeholder="Slug"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                />
                <input
                  style={inputStyle}
                  placeholder="Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  style={inputStyle}
                  placeholder="Subheader"
                  value={editSubheader}
                  onChange={(e) => setEditSubheader(e.target.value)}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={goldBtn}
                    onClick={() => saveEdit(t.id)}
                    disabled={savingId === t.id}
                  >
                    {savingId === t.id ? "Saving…" : "Save"}
                  </button>
                  <button style={smallBtn} onClick={cancelEdit}>Cancel</button>
                </div>
                {editErr && <ErrMsg msg={editErr} />}
                {editOk && <OkMsg msg={editOk} />}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Reorder buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                  <button
                    style={{ ...reorderBtn, opacity: idx === 0 ? 0.3 : 1 }}
                    disabled={idx === 0}
                    onClick={() => handleReorder(t.id, "up")}
                  >
                    ↑
                  </button>
                  <button
                    style={{ ...reorderBtn, opacity: idx === topics.length - 1 ? 0.3 : 1 }}
                    disabled={idx === topics.length - 1}
                    onClick={() => handleReorder(t.id, "down")}
                  >
                    ↓
                  </button>
                </div>

                {/* Topic name — click to drill in */}
                <button
                  onClick={() => onSelectTopic(t)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    flex: 1,
                    textAlign: "left",
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontWeight: 650, color: "#0d2a4a", fontSize: "0.95rem" }}>
                    {t.title}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#4a5d73", marginLeft: 8 }}>
                    ({t.slug})
                  </span>
                </button>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button style={smallBtn} onClick={() => startEdit(t)}>Edit</button>
                  <button
                    style={{ ...smallBtn, color: "#a04040", borderColor: "rgba(160,64,64,0.2)" }}
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                  >
                    {deletingId === t.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add topic form */}
      <div style={divider} />
      <p style={sectionHeading}>Add topic</p>
      <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          style={inputStyle}
          placeholder="Slug (e.g. fire-wise)"
          value={addSlug}
          onChange={(e) => setAddSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
        />
        <input
          style={inputStyle}
          placeholder="Title"
          value={addTitle}
          onChange={(e) => setAddTitle(e.target.value)}
        />
        <input
          style={inputStyle}
          placeholder="Subheader (optional)"
          value={addSubheader}
          onChange={(e) => setAddSubheader(e.target.value)}
        />
        <div>
          <button
            type="submit"
            style={{ ...goldBtn, opacity: adding || !addSlug.trim() || !addTitle.trim() ? 0.6 : 1 }}
            disabled={adding || !addSlug.trim() || !addTitle.trim()}
          >
            {adding ? "Adding…" : "Add Topic"}
          </button>
        </div>
        {addErr && <ErrMsg msg={addErr} />}
        {addOk && <OkMsg msg={addOk} />}
      </form>
    </div>
  );
}

// ── Topic detail view (approaches) ──────────────────────────

function TopicDetailView({
  topic,
  onBack,
  onSelectApproach,
}: {
  topic: Topic;
  onBack: () => void;
  onSelectApproach: (a: Approach) => void;
}) {
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editErr, setEditErr] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add form state
  const [addName, setAddName] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState<string | null>(null);
  const [addOk, setAddOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const res = await fetch(`/api/admin/constellation/approaches?topic_id=${topic.id}`);
    if (!res.ok) {
      setErr("Failed to load approaches.");
      setLoading(false);
      return;
    }
    setApproaches(await res.json());
    setLoading(false);
  }, [topic.id]);

  useEffect(() => { load(); }, [load]);

  function startEdit(a: Approach) {
    setEditingId(a.id);
    setEditName(a.name);
    setEditDesc(a.description ?? "");
    setEditErr(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditErr(null);
  }

  async function saveEdit(id: string) {
    setSavingId(id);
    setEditErr(null);
    const res = await fetch("/api/admin/constellation/approaches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editName, description: editDesc }),
    });
    if (!res.ok) {
      const d = await res.json();
      setEditErr(d.error || "Save failed.");
    } else {
      setEditingId(null);
      await load();
    }
    setSavingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this approach? Examples attached only to this approach will be orphaned.")) return;
    setDeletingId(id);
    await fetch(`/api/admin/constellation/approaches?id=${id}`, { method: "DELETE" });
    setDeletingId(null);
    await load();
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    await fetch("/api/admin/constellation/approaches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, direction, topic_id: topic.id }),
    });
    await load();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addName.trim()) return;
    setAdding(true);
    setAddErr(null);
    setAddOk(null);
    const res = await fetch("/api/admin/constellation/approaches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic_id: topic.id, name: addName.trim(), description: addDesc.trim() }),
    });
    if (!res.ok) {
      const d = await res.json();
      setAddErr(d.error || "Failed to add approach.");
    } else {
      setAddOk("Approach added.");
      setAddName("");
      setAddDesc("");
      await load();
    }
    setAdding(false);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#4a5d73",
          fontSize: "0.85rem",
          cursor: "pointer",
          padding: 0,
          marginBottom: 14,
          textDecoration: "underline",
          textUnderlineOffset: 2,
        }}
      >
        ← Topics
      </button>

      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#8a6d2a", margin: "0 0 4px" }}>
        {topic.title}
      </h3>
      <p style={{ fontSize: "0.82rem", color: "#4a5d73", margin: "0 0 16px" }}>Approaches</p>

      {loading && <p style={{ color: "#4a5d73", fontSize: "0.9rem" }}>Loading…</p>}
      {err && <ErrMsg msg={err} />}

      {!loading && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {approaches.length === 0 && (
              <p style={{ fontSize: "0.9rem", color: "#4a5d73", fontStyle: "italic" }}>No approaches yet.</p>
            )}
            {approaches.map((a, idx) => (
              <div key={a.id} style={cardStyle}>
                {editingId === a.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      style={inputStyle}
                      placeholder="Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <textarea
                      style={textareaStyle}
                      placeholder="Description"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={goldBtn}
                        onClick={() => saveEdit(a.id)}
                        disabled={savingId === a.id}
                      >
                        {savingId === a.id ? "Saving…" : "Save"}
                      </button>
                      <button style={smallBtn} onClick={cancelEdit}>Cancel</button>
                    </div>
                    {editErr && <ErrMsg msg={editErr} />}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* Reorder */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                      <button
                        style={{ ...reorderBtn, opacity: idx === 0 ? 0.3 : 1 }}
                        disabled={idx === 0}
                        onClick={() => handleReorder(a.id, "up")}
                      >
                        ↑
                      </button>
                      <button
                        style={{ ...reorderBtn, opacity: idx === approaches.length - 1 ? 0.3 : 1 }}
                        disabled={idx === approaches.length - 1}
                        onClick={() => handleReorder(a.id, "down")}
                      >
                        ↓
                      </button>
                    </div>

                    {/* Name — click to drill in */}
                    <button
                      onClick={() => onSelectApproach(a)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        flex: 1,
                        textAlign: "left",
                        minWidth: 0,
                      }}
                    >
                      <span style={{ fontWeight: 650, color: "#0d2a4a", fontSize: "0.92rem" }}>
                        {a.name}
                      </span>
                      {a.description && (
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.8rem",
                            color: "#4a5d73",
                            marginTop: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {a.description}
                        </span>
                      )}
                    </button>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button style={smallBtn} onClick={() => startEdit(a)}>Edit</button>
                      <button
                        style={{ ...smallBtn, color: "#a04040", borderColor: "rgba(160,64,64,0.2)" }}
                        onClick={() => handleDelete(a.id)}
                        disabled={deletingId === a.id}
                      >
                        {deletingId === a.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add approach form */}
          <div style={divider} />
          <p style={sectionHeading}>Add approach</p>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              style={inputStyle}
              placeholder="Approach name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
            />
            <textarea
              style={textareaStyle}
              placeholder="Description (optional)"
              value={addDesc}
              onChange={(e) => setAddDesc(e.target.value)}
            />
            <div>
              <button
                type="submit"
                style={{ ...goldBtn, opacity: adding || !addName.trim() ? 0.6 : 1 }}
                disabled={adding || !addName.trim()}
              >
                {adding ? "Adding…" : "Add Approach"}
              </button>
            </div>
            {addErr && <ErrMsg msg={addErr} />}
            {addOk && <OkMsg msg={addOk} />}
          </form>
        </>
      )}
    </div>
  );
}

// ── Approach detail view (examples) ─────────────────────────

function ApproachDetailView({
  approach,
  topic,
  onBack,
}: {
  approach: Approach;
  topic: Topic;
  onBack: () => void;
}) {
  const [attached, setAttached] = useState<Example[]>([]);
  const [topicApproaches, setTopicApproaches] = useState<Approach[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Remove state
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Inline edit state
  const [editingExampleId, setEditingExampleId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [savingExampleId, setSavingExampleId] = useState<string | null>(null);
  const [editExampleErr, setEditExampleErr] = useState<string | null>(null);

  // "+" picker state — which example has its picker open
  const [pickerExampleId, setPickerExampleId] = useState<string | null>(null);
  const [attachingToApproachId, setAttachingToApproachId] = useState<string | null>(null);
  const [pickerOk, setPickerOk] = useState<Record<string, string>>({});
  const [pickerErr, setPickerErr] = useState<string | null>(null);

  // Add new example form
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState<string | null>(null);
  const [addOk, setAddOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const [r1, r2] = await Promise.all([
      fetch(`/api/admin/constellation/examples?approach_id=${approach.id}`),
      fetch(`/api/admin/constellation/approaches?topic_id=${topic.id}`),
    ]);
    if (!r1.ok || !r2.ok) {
      setErr("Failed to load examples.");
      setLoading(false);
      return;
    }
    const [att, approaches] = await Promise.all([r1.json(), r2.json()]);
    setAttached(att);
    // Exclude the current approach from the picker list
    setTopicApproaches((approaches as Approach[]).filter((a) => a.id !== approach.id));
    setLoading(false);
  }, [approach.id, topic.id]);

  useEffect(() => { load(); }, [load]);

  async function handleRemove(example_id: string) {
    setRemovingId(example_id);
    await fetch("/api/admin/constellation/example-approaches", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ example_id, approach_id: approach.id }),
    });
    setRemovingId(null);
    await load();
  }

  async function handleReorderExample(example_id: string, direction: "up" | "down") {
    await fetch("/api/admin/constellation/example-approaches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ example_id, approach_id: approach.id, direction }),
    });
    await load();
  }

  function startEditExample(ex: Example) {
    setEditingExampleId(ex.id);
    setEditTitle(ex.title);
    setEditUrl(ex.url);
    setEditSummary(ex.summary ?? "");
    setEditExampleErr(null);
    setPickerExampleId(null);
  }

  function cancelEditExample() {
    setEditingExampleId(null);
    setEditExampleErr(null);
  }

  async function saveEditExample(id: string) {
    setSavingExampleId(id);
    setEditExampleErr(null);
    const res = await fetch("/api/admin/constellation/examples", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: editTitle.trim(), url: editUrl.trim(), summary: editSummary.trim() }),
    });
    if (!res.ok) {
      const d = await res.json();
      setEditExampleErr(d.error || "Save failed.");
    } else {
      setEditingExampleId(null);
      await load();
    }
    setSavingExampleId(null);
  }

  async function handleAttachToApproach(example_id: string, target_approach_id: string) {
    setAttachingToApproachId(target_approach_id);
    setPickerErr(null);
    const res = await fetch("/api/admin/constellation/example-approaches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ example_id, approach_id: target_approach_id }),
    });
    if (!res.ok) {
      const d = await res.json();
      setPickerErr(d.error || "Attach failed.");
    } else {
      const targetName = topicApproaches.find((a) => a.id === target_approach_id)?.name ?? "approach";
      setPickerOk((prev) => ({ ...prev, [example_id]: `Added to "${targetName}"` }));
      setTimeout(() => {
        setPickerOk((prev) => { const n = { ...prev }; delete n[example_id]; return n; });
        setPickerExampleId(null);
      }, 2000);
    }
    setAttachingToApproachId(null);
  }

  async function handleAddNew(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    setAdding(true);
    setAddErr(null);
    setAddOk(null);
    const res = await fetch("/api/admin/constellation/examples", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle.trim(),
        url: newUrl.trim(),
        summary: newSummary.trim(),
        approach_id: approach.id,
      }),
    });
    if (!res.ok) {
      const d = await res.json();
      setAddErr(d.error || "Failed to add example.");
    } else {
      setNewTitle("");
      setNewUrl("");
      setNewSummary("");
      await load();
      setAddOk("Added ✓");
      setTimeout(() => setAddOk(null), 2500);
    }
    setAdding(false);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#4a5d73",
          fontSize: "0.85rem",
          cursor: "pointer",
          padding: 0,
          marginBottom: 14,
          textDecoration: "underline",
          textUnderlineOffset: 2,
        }}
      >
        ← {topic.title}
      </button>

      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#8a6d2a", margin: "0 0 4px" }}>
        {approach.name}
      </h3>
      {approach.description && (
        <p style={{ fontSize: "0.85rem", color: "#4a5d73", margin: "0 0 16px" }}>
          {approach.description}
        </p>
      )}

      {loading && <p style={{ color: "#4a5d73", fontSize: "0.9rem" }}>Loading…</p>}
      {err && <ErrMsg msg={err} />}

      {!loading && (
        <>
          {/* ── Section 1: Attached examples ── */}
          <p style={sectionHeading}>Attached examples ({attached.length})</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {attached.length === 0 && (
              <p style={{ fontSize: "0.9rem", color: "#4a5d73", fontStyle: "italic" }}>
                No examples attached yet.
              </p>
            )}
            {attached.map((ex, idx) => {
              const pickerOpen = pickerExampleId === ex.id;
              const isEditing = editingExampleId === ex.id;
              const okMsg = pickerOk[ex.id];
              return (
                <div key={ex.id} style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 0 }}>
                  {isEditing ? (
                    /* ── Inline edit form ── */
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <input
                        style={inputStyle}
                        placeholder="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <input
                        style={inputStyle}
                        placeholder="URL (https://…)"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                      />
                      <textarea
                        style={textareaStyle}
                        placeholder="Summary (optional)"
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={{
                            ...goldBtn,
                            fontSize: "0.85rem",
                            padding: "8px 16px",
                            opacity: savingExampleId === ex.id || !editTitle.trim() || !editUrl.trim() ? 0.6 : 1,
                          }}
                          onClick={() => saveEditExample(ex.id)}
                          disabled={savingExampleId === ex.id || !editTitle.trim() || !editUrl.trim()}
                        >
                          {savingExampleId === ex.id ? "Saving…" : "Save"}
                        </button>
                        <button style={smallBtn} onClick={cancelEditExample}>Cancel</button>
                      </div>
                      {editExampleErr && <ErrMsg msg={editExampleErr} />}
                    </div>
                  ) : (
                    /* ── Read view ── */
                    <>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        {/* Reorder buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0, marginTop: 1 }}>
                          <button
                            style={{ ...reorderBtn, opacity: idx === 0 ? 0.3 : 1 }}
                            disabled={idx === 0}
                            onClick={() => handleReorderExample(ex.id, "up")}
                          >
                            ↑
                          </button>
                          <button
                            style={{ ...reorderBtn, opacity: idx === attached.length - 1 ? 0.3 : 1 }}
                            disabled={idx === attached.length - 1}
                            onClick={() => handleReorderExample(ex.id, "down")}
                          >
                            ↓
                          </button>
                        </div>
                        {/* Favicon */}
                        {ex.favicon_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ex.favicon_url}
                            alt=""
                            width={16}
                            height={16}
                            style={{ marginTop: 3, flexShrink: 0, borderRadius: 3 }}
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 650, color: "#0d2a4a", fontSize: "0.9rem" }}>
                            {ex.title}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#4a5d73", marginTop: 2 }}>
                            {ex.url}
                          </div>
                          {ex.summary && (
                            <div style={{ fontSize: "0.8rem", color: "#4a5d73", marginTop: 3 }}>
                              {ex.summary}
                            </div>
                          )}
                        </div>
                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <button
                            style={smallBtn}
                            onClick={() => startEditExample(ex)}
                          >
                            Edit
                          </button>
                          {/* "+" — also add to another approach */}
                          {topicApproaches.length > 0 && (
                            <button
                              style={{
                                ...smallBtn,
                                fontWeight: 700,
                                padding: "4px 9px",
                                color: pickerOpen ? "#8a6d2a" : "#4a5d73",
                                borderColor: pickerOpen ? "rgba(138,109,42,0.35)" : "rgba(100,150,220,0.2)",
                                background: pickerOpen ? "rgba(255,216,107,0.12)" : "none",
                              }}
                              onClick={() => {
                                setPickerExampleId(pickerOpen ? null : ex.id);
                                setPickerErr(null);
                              }}
                              title="Also add to another approach in this topic"
                            >
                              +
                            </button>
                          )}
                          <button
                            style={{ ...smallBtn, color: "#a04040", borderColor: "rgba(160,64,64,0.2)" }}
                            onClick={() => handleRemove(ex.id)}
                            disabled={removingId === ex.id}
                          >
                            {removingId === ex.id ? "…" : "Remove"}
                          </button>
                        </div>
                      </div>

                      {/* Inline approach picker */}
                      {pickerOpen && (
                        <div
                          style={{
                            marginTop: 10,
                            paddingTop: 10,
                            borderTop: "1px solid rgba(100,150,220,0.12)",
                          }}
                        >
                          <p style={{ ...sectionHeading, margin: "0 0 8px" }}>
                            Also add to…
                          </p>
                          {pickerErr && <ErrMsg msg={pickerErr} />}
                          {okMsg && <OkMsg msg={okMsg} />}
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {topicApproaches.map((a) => (
                              <div
                                key={a.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "7px 10px",
                                  borderRadius: 8,
                                  border: "1px solid rgba(100,150,220,0.12)",
                                  background: "rgba(255,255,255,0.4)",
                                }}
                              >
                                <span style={{ flex: 1, fontSize: "0.88rem", color: "#0d2a4a" }}>
                                  {a.name}
                                </span>
                                <button
                                  style={{ ...smallBtn, flexShrink: 0 }}
                                  onClick={() => handleAttachToApproach(ex.id, a.id)}
                                  disabled={attachingToApproachId === a.id}
                                >
                                  {attachingToApproachId === a.id ? "…" : "Add →"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div style={divider} />

          {/* ── Section 2: Add new example ── */}
          <p style={sectionHeading}>Add new example</p>
          <form onSubmit={handleAddNew} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              style={inputStyle}
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              style={inputStyle}
              placeholder="URL (https://…)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <textarea
              style={textareaStyle}
              placeholder="Summary (optional)"
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
            />
            <div>
              <button
                type="submit"
                style={{
                  ...goldBtn,
                  opacity: adding || !newTitle.trim() || !newUrl.trim() ? 0.6 : 1,
                }}
                disabled={adding || !newTitle.trim() || !newUrl.trim()}
              >
                {adding ? "Adding…" : "Add & Attach"}
              </button>
            </div>
            {addErr && <ErrMsg msg={addErr} />}
            {addOk && <OkMsg msg={addOk} />}
          </form>
        </>
      )}
    </div>
  );
}
