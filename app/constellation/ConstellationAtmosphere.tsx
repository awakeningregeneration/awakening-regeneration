/**
 * Shared dark-navy star field used by /constellation and /constellation/[slug].
 * Server component — no interactivity, pure CSS positioning.
 */

type StarPoint = { left: string; top: string; size: number; opacity: number; tier: 1 | 2 | 3 };

const starField: StarPoint[] = [
  // Tier 1 — 60 tiny stars
  { left: "4%",  top: "6%",  size: 2,   opacity: 0.4,  tier: 1 },
  { left: "12%", top: "5%",  size: 1.5, opacity: 0.3,  tier: 1 },
  { left: "20%", top: "8%",  size: 2.5, opacity: 0.5,  tier: 1 },
  { left: "28%", top: "4%",  size: 2,   opacity: 0.45, tier: 1 },
  { left: "36%", top: "7%",  size: 3,   opacity: 0.55, tier: 1 },
  { left: "44%", top: "5%",  size: 1.5, opacity: 0.35, tier: 1 },
  { left: "52%", top: "8%",  size: 2,   opacity: 0.4,  tier: 1 },
  { left: "60%", top: "6%",  size: 2.5, opacity: 0.5,  tier: 1 },
  { left: "72%", top: "4%",  size: 2,   opacity: 0.45, tier: 1 },
  { left: "86%", top: "7%",  size: 1.5, opacity: 0.32, tier: 1 },
  { left: "6%",  top: "18%", size: 2,   opacity: 0.42, tier: 1 },
  { left: "15%", top: "20%", size: 3,   opacity: 0.55, tier: 1 },
  { left: "23%", top: "16%", size: 1.5, opacity: 0.3,  tier: 1 },
  { left: "32%", top: "22%", size: 2,   opacity: 0.4,  tier: 1 },
  { left: "40%", top: "18%", size: 2.5, opacity: 0.48, tier: 1 },
  { left: "48%", top: "20%", size: 2,   opacity: 0.42, tier: 1 },
  { left: "56%", top: "16%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "65%", top: "22%", size: 3,   opacity: 0.58, tier: 1 },
  { left: "76%", top: "20%", size: 2,   opacity: 0.45, tier: 1 },
  { left: "88%", top: "18%", size: 2.5, opacity: 0.5,  tier: 1 },
  { left: "3%",  top: "34%", size: 2,   opacity: 0.4,  tier: 1 },
  { left: "11%", top: "38%", size: 1.5, opacity: 0.32, tier: 1 },
  { left: "19%", top: "36%", size: 2.5, opacity: 0.5,  tier: 1 },
  { left: "27%", top: "32%", size: 2,   opacity: 0.42, tier: 1 },
  { left: "36%", top: "38%", size: 3,   opacity: 0.6,  tier: 1 },
  { left: "45%", top: "34%", size: 1.5, opacity: 0.3,  tier: 1 },
  { left: "53%", top: "38%", size: 2,   opacity: 0.4,  tier: 1 },
  { left: "62%", top: "36%", size: 2.5, opacity: 0.5,  tier: 1 },
  { left: "74%", top: "32%", size: 2,   opacity: 0.45, tier: 1 },
  { left: "90%", top: "38%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "5%",  top: "52%", size: 2,   opacity: 0.42, tier: 1 },
  { left: "14%", top: "56%", size: 2.5, opacity: 0.5,  tier: 1 },
  { left: "22%", top: "50%", size: 1.5, opacity: 0.3,  tier: 1 },
  { left: "31%", top: "54%", size: 2,   opacity: 0.4,  tier: 1 },
  { left: "39%", top: "50%", size: 3,   opacity: 0.55, tier: 1 },
  { left: "47%", top: "56%", size: 2,   opacity: 0.42, tier: 1 },
  { left: "55%", top: "52%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "64%", top: "56%", size: 2.5, opacity: 0.48, tier: 1 },
  { left: "77%", top: "50%", size: 2,   opacity: 0.45, tier: 1 },
  { left: "92%", top: "54%", size: 3,   opacity: 0.6,  tier: 1 },
  { left: "4%",  top: "70%", size: 2,   opacity: 0.4,  tier: 1 },
  { left: "12%", top: "74%", size: 1.5, opacity: 0.32, tier: 1 },
  { left: "21%", top: "68%", size: 2.5, opacity: 0.5,  tier: 1 },
  { left: "29%", top: "72%", size: 2,   opacity: 0.42, tier: 1 },
  { left: "37%", top: "68%", size: 3,   opacity: 0.58, tier: 1 },
  { left: "46%", top: "74%", size: 1.5, opacity: 0.3,  tier: 1 },
  { left: "54%", top: "70%", size: 2,   opacity: 0.4,  tier: 1 },
  { left: "63%", top: "74%", size: 2.5, opacity: 0.48, tier: 1 },
  { left: "75%", top: "68%", size: 2,   opacity: 0.45, tier: 1 },
  { left: "89%", top: "72%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "6%",  top: "88%", size: 2,   opacity: 0.42, tier: 1 },
  { left: "15%", top: "90%", size: 2.5, opacity: 0.5,  tier: 1 },
  { left: "23%", top: "86%", size: 1.5, opacity: 0.3,  tier: 1 },
  { left: "32%", top: "92%", size: 2,   opacity: 0.4,  tier: 1 },
  { left: "40%", top: "88%", size: 3,   opacity: 0.55, tier: 1 },
  { left: "48%", top: "92%", size: 2,   opacity: 0.42, tier: 1 },
  { left: "57%", top: "88%", size: 1.5, opacity: 0.35, tier: 1 },
  { left: "65%", top: "90%", size: 2.5, opacity: 0.48, tier: 1 },
  { left: "78%", top: "86%", size: 2,   opacity: 0.45, tier: 1 },
  { left: "93%", top: "92%", size: 3,   opacity: 0.6,  tier: 1 },
  // Tier 2 — 40 small stars with soft gold glow
  { left: "7%",  top: "11%", size: 3, opacity: 0.55, tier: 2 },
  { left: "18%", top: "13%", size: 4, opacity: 0.65, tier: 2 },
  { left: "29%", top: "10%", size: 3, opacity: 0.5,  tier: 2 },
  { left: "40%", top: "14%", size: 5, opacity: 0.75, tier: 2 },
  { left: "51%", top: "11%", size: 3, opacity: 0.55, tier: 2 },
  { left: "62%", top: "13%", size: 4, opacity: 0.6,  tier: 2 },
  { left: "80%", top: "10%", size: 3, opacity: 0.5,  tier: 2 },
  { left: "93%", top: "14%", size: 4, opacity: 0.65, tier: 2 },
  { left: "4%",  top: "26%", size: 3, opacity: 0.5,  tier: 2 },
  { left: "16%", top: "28%", size: 4, opacity: 0.6,  tier: 2 },
  { left: "28%", top: "24%", size: 5, opacity: 0.72, tier: 2 },
  { left: "40%", top: "30%", size: 3, opacity: 0.55, tier: 2 },
  { left: "52%", top: "26%", size: 4, opacity: 0.65, tier: 2 },
  { left: "64%", top: "28%", size: 3, opacity: 0.48, tier: 2 },
  { left: "78%", top: "26%", size: 4, opacity: 0.58, tier: 2 },
  { left: "90%", top: "30%", size: 5, opacity: 0.7,  tier: 2 },
  { left: "8%",  top: "44%", size: 3, opacity: 0.52, tier: 2 },
  { left: "20%", top: "42%", size: 4, opacity: 0.6,  tier: 2 },
  { left: "32%", top: "46%", size: 3, opacity: 0.5,  tier: 2 },
  { left: "44%", top: "42%", size: 5, opacity: 0.72, tier: 2 },
  { left: "56%", top: "46%", size: 3, opacity: 0.55, tier: 2 },
  { left: "68%", top: "44%", size: 4, opacity: 0.62, tier: 2 },
  { left: "80%", top: "42%", size: 3, opacity: 0.48, tier: 2 },
  { left: "92%", top: "46%", size: 4, opacity: 0.65, tier: 2 },
  { left: "5%",  top: "62%", size: 3, opacity: 0.5,  tier: 2 },
  { left: "17%", top: "60%", size: 4, opacity: 0.6,  tier: 2 },
  { left: "29%", top: "64%", size: 5, opacity: 0.7,  tier: 2 },
  { left: "41%", top: "58%", size: 3, opacity: 0.55, tier: 2 },
  { left: "53%", top: "62%", size: 4, opacity: 0.65, tier: 2 },
  { left: "65%", top: "60%", size: 3, opacity: 0.5,  tier: 2 },
  { left: "77%", top: "64%", size: 4, opacity: 0.58, tier: 2 },
  { left: "89%", top: "62%", size: 5, opacity: 0.72, tier: 2 },
  { left: "7%",  top: "80%", size: 3, opacity: 0.52, tier: 2 },
  { left: "19%", top: "78%", size: 4, opacity: 0.6,  tier: 2 },
  { left: "31%", top: "82%", size: 3, opacity: 0.5,  tier: 2 },
  { left: "43%", top: "80%", size: 5, opacity: 0.72, tier: 2 },
  { left: "55%", top: "78%", size: 3, opacity: 0.55, tier: 2 },
  { left: "67%", top: "82%", size: 4, opacity: 0.62, tier: 2 },
  { left: "82%", top: "80%", size: 3, opacity: 0.48, tier: 2 },
  { left: "95%", top: "82%", size: 4, opacity: 0.65, tier: 2 },
  // Tier 3 — 20 bright orbs with layered warm glow
  { left: "10%", top: "8%",  size: 7,  opacity: 0.7,  tier: 3 },
  { left: "34%", top: "12%", size: 8,  opacity: 0.75, tier: 3 },
  { left: "58%", top: "8%",  size: 6,  opacity: 0.65, tier: 3 },
  { left: "82%", top: "14%", size: 9,  opacity: 0.8,  tier: 3 },
  { left: "22%", top: "26%", size: 10, opacity: 0.85, tier: 3 },
  { left: "48%", top: "30%", size: 6,  opacity: 0.58, tier: 3 },
  { left: "72%", top: "24%", size: 8,  opacity: 0.72, tier: 3 },
  { left: "94%", top: "32%", size: 7,  opacity: 0.68, tier: 3 },
  { left: "14%", top: "48%", size: 9,  opacity: 0.78, tier: 3 },
  { left: "38%", top: "44%", size: 6,  opacity: 0.6,  tier: 3 },
  { left: "60%", top: "48%", size: 10, opacity: 0.85, tier: 3 },
  { left: "86%", top: "44%", size: 7,  opacity: 0.65, tier: 3 },
  { left: "6%",  top: "68%", size: 6,  opacity: 0.58, tier: 3 },
  { left: "30%", top: "64%", size: 8,  opacity: 0.72, tier: 3 },
  { left: "52%", top: "68%", size: 7,  opacity: 0.62, tier: 3 },
  { left: "76%", top: "64%", size: 10, opacity: 0.82, tier: 3 },
  { left: "20%", top: "86%", size: 6,  opacity: 0.6,  tier: 3 },
  { left: "44%", top: "90%", size: 9,  opacity: 0.78, tier: 3 },
  { left: "68%", top: "86%", size: 7,  opacity: 0.65, tier: 3 },
  { left: "92%", top: "90%", size: 8,  opacity: 0.72, tier: 3 },
];

export default function ConstellationAtmosphere() {
  return (
    <>
      {/* Base radial gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(20,55,120,0.28) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Three-tier star field */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}
      >
        {starField.map((p, i) => {
          let boxShadow = "none";
          if (p.tier === 2) {
            boxShadow = "0 0 8px rgba(255,235,180,0.35)";
          } else if (p.tier === 3) {
            boxShadow =
              "0 0 12px 4px rgba(255,220,140,0.28), 0 0 28px 6px rgba(255,200,100,0.12)";
          }
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                borderRadius: "50%",
                background: "rgba(255,248,220,0.85)",
                opacity: p.opacity,
                boxShadow,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
