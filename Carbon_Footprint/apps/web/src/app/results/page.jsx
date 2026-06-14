"use client";
import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import { getStorageData } from "../../utils/carbonStorage";
import { categoryConfig, translateCo2 } from "../../data/quizData";

function EcoScoreRing({ score, size = 160 }) {
  const r = 58;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        margin: "0 auto",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
            transition: "stroke-dashoffset 1.5s ease",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
          }}
        >
          {score}
        </div>
        <div
          style={{ fontSize: 12, color: color, fontWeight: 600, marginTop: 2 }}
        >
          ECO SCORE
        </div>
      </div>
    </div>
  );
}

const categoryInsights = {
  transport: {
    tips: [
      "Try biking or walking for trips under 2 miles",
      "Use public transit once a week instead of driving",
      "Consider carpooling to work or combine errands",
    ],
  },
  food: {
    tips: [
      "Replace one meat meal per day with plant-based",
      "Plan weekly meals to cut food waste by 30%",
      "Buy from local markets to reduce food miles",
    ],
  },
  home: {
    tips: [
      "Switch to a renewable energy plan",
      "Lower your thermostat by 2°C and wear a sweater",
      "Wash laundry on cold cycles — saves 90% of energy",
    ],
  },
  shopping: {
    tips: [
      "Check secondhand before buying anything new",
      "Repair items instead of replacing them",
      "Implement a 24-hour rule before any non-essential purchase",
    ],
  },
  waste: {
    tips: [
      "Set up a simple compost bin for food scraps",
      "Audit your bins weekly to improve recycling",
      "Carry reusable bags, bottles, and cups everywhere",
    ],
  },
};

export default function ResultsPage() {
  const [data, setData] = useState(null);
  const [animScore, setAnimScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStorageData();
    if (stored.footprint) {
      setData(stored);
      setTimeout(() => {
        setRevealed(true);
        setTimeout(() => setAnimScore(stored.footprint.ecoScore), 300);
      }, 100);
    } else {
      window.location.href = "/quiz";
    }
  }, []);

  if (!mounted || !data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050e07",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#64748b" }}>
          Loading results...
        </div>
      </div>
    );
  }

  const { footprint } = data;
  const {
    personality,
    totalKg,
    categoryScores,
    sortedCategories,
    globalAverage,
    ecoScore,
  } = footprint;
  const maxScore = Math.max(...Object.values(categoryScores));
  const insights =
    categoryInsights[footprint.highestCategory] || categoryInsights.food;

  const co2Comparison =
    totalKg < globalAverage
      ? `${Math.round(((globalAverage - totalKg) / globalAverage) * 100)}% below global average`
      : `${Math.round(((totalKg - globalAverage) / globalAverage) * 100)}% above global average`;

  return (
    <div style={{ minHeight: "100vh", background: "#050e07" }}>
      <Navigation />

      <div
        style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 100px" }}
      >
        {/* Personality reveal */}
        <div
          style={{
            textAlign: "center",
            padding: "48px 32px",
            borderRadius: 28,
            background: `linear-gradient(135deg, ${personality.color}12, ${personality.color}06)`,
            border: `1px solid ${personality.color}25`,
            marginBottom: 32,
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              height: 300,
              background: `radial-gradient(circle, ${personality.color}10 0%, transparent 70%)`,
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 13,
              fontWeight: 600,
              color: "#94a3b8",
              marginBottom: 20,
            }}
          >
            🧬 YOUR CARBON PERSONALITY
          </div>

          <div style={{ fontSize: 64, marginBottom: 12 }}>
            {personality.emoji}
          </div>
          <h1
            style={{
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            {personality.name}
          </h1>
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: personality.color,
              marginBottom: 16,
              letterSpacing: "0.01em",
            }}
          >
            {personality.tagline}
          </p>
          <p
            style={{
              fontSize: 16,
              color: "#94a3b8",
              lineHeight: 1.65,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {personality.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Eco Score */}
          <div
            style={{
              padding: "36px 28px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 24,
              }}
            >
              Your Eco Score
            </h2>
            <EcoScoreRing score={animScore} />
            <div style={{ marginTop: 24 }}>
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontSize: 14,
                  color: "#64748b",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: ecoScore >= 50 ? "#22c55e" : "#f97316",
                    fontWeight: 700,
                  }}
                >
                  {co2Comparison}
                </span>
                <br />
                <span style={{ color: "#475569", fontSize: 13 }}>
                  100 = zero impact · 50 = world avg · 0 = very high
                </span>
              </div>
            </div>
          </div>

          {/* Total footprint */}
          <div
            style={{
              padding: "36px 28px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h2
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              Annual Footprint
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>
              Estimated from your quiz answers
            </p>

            <div style={{ marginBottom: 20 }}>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-0.03em",
                }}
              >
                {(totalKg / 1000).toFixed(1)}
              </span>
              <span style={{ fontSize: 20, color: "#64748b", marginLeft: 6 }}>
                tons CO₂/yr
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Global average", val: 7.0, color: "#64748b" },
                { label: "US average", val: 14.0, color: "#94a3b8" },
                {
                  label: "Your estimate",
                  val: totalKg / 1000,
                  color: "#22c55e",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "#64748b", fontSize: 13, flex: 1 }}>
                    {item.label}
                  </span>
                  <span
                    style={{ color: item.color, fontSize: 13, fontWeight: 600 }}
                  >
                    {item.val.toFixed(1)}t
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div
          style={{
            padding: "32px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 6,
            }}
          >
            Footprint Breakdown
          </h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>
            Where your carbon comes from
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {sortedCategories.map(([cat, kg]) => {
              const conf = categoryConfig[cat];
              const pct = maxScore > 0 ? (kg / maxScore) * 100 : 0;
              const totalPct =
                totalKg > 0 ? Math.round((kg / totalKg) * 100) : 0;

              return (
                <div key={cat}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span style={{ fontSize: 18 }}>{conf.emoji}</span>
                      <span
                        style={{
                          color: "#d1d5db",
                          fontWeight: 600,
                          fontSize: 15,
                        }}
                      >
                        {conf.label}
                      </span>
                      {cat === footprint.highestCategory && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: `${conf.color}20`,
                            color: conf.color,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                          }}
                        >
                          TOP
                        </span>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", gap: 12, alignItems: "center" }}
                    >
                      <span style={{ color: "#64748b", fontSize: 13 }}>
                        {totalPct}%
                      </span>
                      <span
                        style={{
                          color: "white",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {translateCo2(kg)}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: 4,
                        background: conf.color,
                        boxShadow: `0 0 8px ${conf.color}60`,
                        transition: "width 1s ease 0.3s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top tips for biggest category */}
        <div
          style={{
            padding: "32px",
            borderRadius: 24,
            background: `linear-gradient(135deg, ${personality.color}10, ${personality.color}05)`,
            border: `1px solid ${personality.color}20`,
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 6,
            }}
          >
            Your Top 3 Quick Wins
          </h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>
            Focused on your biggest opportunity:{" "}
            {categoryConfig[footprint.highestCategory]?.label}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {insights.tips.map((tip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${personality.color}20`,
                    border: `1px solid ${personality.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                    color: personality.color,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.5 }}
                >
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/dashboard"
            style={{
              flex: 1,
              padding: "16px",
              textAlign: "center",
              borderRadius: 14,
              background: "linear-gradient(135deg, #15803d, #22c55e)",
              color: "white",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              boxShadow: "0 0 30px rgba(34,197,94,0.3)",
            }}
          >
            📊 Open My Dashboard
          </a>
          <a
            href="/challenges"
            style={{
              flex: 1,
              padding: "16px",
              textAlign: "center",
              borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#d1d5db",
              fontWeight: 600,
              fontSize: 16,
              textDecoration: "none",
            }}
          >
            ⚡ Start Daily Challenges
          </a>
        </div>
      </div>
    </div>
  );
}
