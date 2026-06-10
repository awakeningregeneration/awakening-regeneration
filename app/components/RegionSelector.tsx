"use client";

type RegionSelectorProps = {
  selectedState: string;
  selectedCounty: string;
  counties: string[];
  states: string[];
  hasStateSelection: boolean;
  onStateChange: (newState: string) => void;
  onCountyChange: (newCounty: string) => void;
};

export default function RegionSelector({
  selectedState,
  selectedCounty,
  counties,
  states,
  hasStateSelection,
  onStateChange,
  onCountyChange,
}: RegionSelectorProps) {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 14,
        border: "1px solid rgba(255,216,107,0.2)",
        borderLeft: "3px solid rgba(255,216,107,0.5)",
        padding: 16,
        marginBottom: 12,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(211,227,247,0.7)",
          marginBottom: 10,
        }}
      >
        Region
      </div>

      <label
        style={{
          display: "block",
          fontSize: 12,
          marginBottom: 6,
          color: "rgba(211,227,247,0.8)",
          opacity: hasStateSelection ? 0.85 : 0.45,
        }}
      >
        County
      </label>

      <select
        value={selectedCounty}
        disabled={!hasStateSelection}
        onChange={(e) => onCountyChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid rgba(148,196,236,0.3)",
          background: "rgba(255,255,255,0.1)",
          color: "#e8f4ff",
          fontSize: 14,
          outlineColor: "rgba(255,216,107,0.6)",
          cursor: "pointer",
          opacity: hasStateSelection ? 1 : 0.65,
          marginBottom: 10,
        }}
      >
        {counties.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label
        style={{
          display: "block",
          fontSize: 12,
          marginBottom: 6,
          color: "rgba(211,227,247,0.8)",
          opacity: 0.85,
        }}
      >
        State
      </label>

      <select
        value={selectedState}
        onChange={(e) => onStateChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid rgba(148,196,236,0.3)",
          background: "rgba(255,255,255,0.1)",
          color: "#e8f4ff",
          fontSize: 14,
          outlineColor: "rgba(255,216,107,0.6)",
          cursor: "pointer",
        }}
      >
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </section>
  );
}
