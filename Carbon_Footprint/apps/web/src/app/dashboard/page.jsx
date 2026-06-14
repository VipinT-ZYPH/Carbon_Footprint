"use client";
import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import {
  getStorageData,
  getDailyChallenge,
  completeChallenge,
  getLevel,
  clearAllData,
} from "../../utils/carbonStorage";
import { categoryConfig, translateCo2 } from "../../data/quizData";
import {
  challenges as allChallenges,
  categoryConfig as challengeCategories,
} from "../../data/challengesData";

function EcoRing({ score, size = 140 }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{
            filter: `drop-shadow(0 0 8px ${color})`,
            transition: "stroke-dashoffset 1.2s ease",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
          }}
        >
          {score}
        </div>
        <div style={{ fontSize: 10, color, fontWeight: 700, marginTop: 2 }}>
          ECO SCORE
        </div>
      </div>
    </div>
  );
}

function StatCard({ emoji, value, label, color = "#22c55e", sublabel }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
        {label}
      </div>
      {sublabel && (
        <div style={{ fontSize: 11, color: "#374151", marginTop: 2 }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [levelInfo, setLevelInfo] = useState(null);
  const [animScore, setAnimScore] = useState(0);

  const loadData = () => {
    const stored = getStorageData();
    setData(stored);
    const daily = getDailyChallenge(allChallenges);
    setDailyChallenge(daily);
    setLevelInfo(getLevel(stored.totalPoints || 0));
    setTimeout(() => setAnimScore(stored.footprint?.ecoScore || 0), 300);
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleCompleteDaily = async () => {
    if (!dailyChallenge || completing) return;
    setCompleting(true);
    const result = completeChallenge(
      dailyChallenge.id,
      dailyChallenge.co2Saved,
      dailyChallenge.points,
    );
    await new Promise((r) => setTimeout(r, 600));
    setJustCompleted(true);
    setCompleting(false);
    loadData();
    setTimeout(() => setJustCompleted(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Reset all progress and retake the quiz?")) {
      clearAllData();
      window.location.href = "/quiz";
    }
  };

  if (!mounted) return null;

  if (!data?.footprint) {
    return (
      <div style={{ minHeight: "100vh", background: "#050e07" }}>
        <Navigation />
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 24 }}>🌱</div>
          <h2
            style={{
              color: "white",
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            No footprint data yet
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, marginBottom: 32 }}>
            Take the quiz to see your personalized dashboard.
          </p>
          <a
            href="/quiz"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #15803d, #22c55e)",
              color: "white",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
            }}
          >
            Take the Quiz ✨
          </a>
        </div>
      </div>
    );
  }

  const {
    footprint,
    completedChallenges = [],
    streak = {},
    totalCo2Saved = 0,
    totalPoints = 0,
  } = data;
  const { personality, categoryScores, totalKg, highestCategory } = footprint;

  const dailyDone =
    dailyChallenge &&
    completedChallenges.some((c) => c.id === dailyChallenge.id);
  const recentCompleted = completedChallenges.slice(-3).reverse();

  const co2Translations = [
    {
      icon: "🚗",
      text: `Not driving ${Math.round(totalCo2Saved * 4.2)} km`,
      min: 1,
    },
    {
      icon: "📱",
      text: `Charging your phone ${Math.round(totalCo2Saved * 500)} times`,
      min: 0.5,
    },
    {
      icon: "🌳",
      text: `${(totalCo2Saved / 21).toFixed(1)} trees absorbing for 1 year`,
      min: 5,
    },
  ].filter((t) => totalCo2Saved >= t.min);

  return (
    <div style={{ minHeight: "100vh", background: "#050e07" }}>
      <Navigation />

      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 100px" }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 28 }}>{personality.emoji}</span>
            <div>
              <h1
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                Your Dashboard
              </h1>
              <span
                style={{
                  color: personality.color,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {personality.name}
              </span>
            </div>
          </div>
          {streak?.count > 0 && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 20,
                background: "rgba(251,146,60,0.1)",
                border: "1px solid rgba(251,146,60,0.25)",
                color: "#fb923c",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              🔥 {streak.count} day streak
            </div>
          )}
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {/* Eco Score */}
          <div
            style={{
              gridColumn: "span 1",
              padding: "28px 24px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <EcoRing score={animScore} />
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                FOOTPRINT
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                {(totalKg / 1000).toFixed(1)} tons/yr
              </div>
            </div>
            <a
              href="/results"
              style={{
                fontSize: 12,
                color: "#22c55e",
                textDecoration: "none",
                fontWeight: 600,
                opacity: 0.8,
              }}
            >
              View full analysis →
            </a>
          </div>

          {/* Stats grid */}
          <div style={{ gridColumn: "span 2" }}>
            <div className="grid grid-cols-2 gap-4" style={{ height: "100%" }}>
              <StatCard
                emoji="💨"
                value={
                  totalCo2Saved > 0 ? `${totalCo2Saved.toFixed(1)}kg` : "0 kg"
                }
                label="CO₂ Saved"
                color="#22c55e"
                sublabel="Since you started"
              />
              <StatCard
                emoji="⚡"
                value={totalPoints}
                label="Points Earned"
                color="#f97316"
                sublabel={
                  levelInfo
                    ? `Level ${levelInfo.level} · ${levelInfo.name}`
                    : ""
                }
              />
              <StatCard
                emoji="🏆"
                value={completedChallenges.length}
                label="Challenges Done"
                color="#a855f7"
              />
              <StatCard
                emoji="🔥"
                value={streak?.count || 0}
                label="Day Streak"
                color="#fb923c"
                sublabel={
                  streak?.count > 0
                    ? "Keep it up!"
                    : "Complete a challenge to start"
                }
              />
            </div>
          </div>
        </div>

        {/* Level progress */}
        {levelInfo && (
          <div
            style={{
              padding: "20px 24px",
              borderRadius: 18,
              marginBottom: 20,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 32 }}>{levelInfo.emoji}</div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>
                  Level {levelInfo.level} · {levelInfo.name}
                </span>
                <span style={{ color: "#64748b", fontSize: 13 }}>
                  {totalPoints}
                  {levelInfo.next ? ` / ${levelInfo.next} pts` : " pts"}
                </span>
              </div>
              {levelInfo.next && (
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, (totalPoints / levelInfo.next) * 100)}%`,
                      borderRadius: 3,
                      background: "linear-gradient(90deg, #16a34a, #22c55e)",
                      boxShadow: "0 0 8px rgba(34,197,94,0.5)",
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Daily Challenge */}
        {dailyChallenge && (
          <div
            style={{
              padding: "28px",
              borderRadius: 24,
              marginBottom: 20,
              background: dailyDone
                ? "rgba(34,197,94,0.06)"
                : `linear-gradient(135deg, ${challengeCategories[dailyChallenge.category]?.bg || "rgba(34,197,94,0.08)"}, rgba(0,0,0,0))`,
              border: dailyDone
                ? "1px solid rgba(34,197,94,0.2)"
                : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#22c55e",
                  padding: "3px 10px",
                  borderRadius: 10,
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                ⚡ TODAY'S CHALLENGE
              </span>
              {dailyDone && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#22c55e",
                    padding: "3px 10px",
                    borderRadius: 10,
                    background: "rgba(34,197,94,0.15)",
                  }}
                >
                  ✓ COMPLETED
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `${challengeCategories[dailyChallenge.category]?.color}20`,
                  border: `1px solid ${challengeCategories[dailyChallenge.category]?.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                {dailyChallenge.emoji}
              </div>

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: 18,
                    marginBottom: 6,
                  }}
                >
                  {dailyChallenge.title}
                </h3>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: 14,
                    lineHeight: 1.5,
                    marginBottom: 12,
                  }}
                >
                  {dailyChallenge.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 10,
                      background: "rgba(34,197,94,0.1)",
                      color: "#22c55e",
                      fontWeight: 600,
                    }}
                  >
                    💨 Save {dailyChallenge.co2Saved}kg CO₂
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 10,
                      background: "rgba(249,115,22,0.1)",
                      color: "#fb923c",
                      fontWeight: 600,
                    }}
                  >
                    ⚡ +{dailyChallenge.points} pts
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "3px 10px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.06)",
                      color: "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    ⏱ {dailyChallenge.timeRequired}
                  </span>
                </div>
              </div>

              {!dailyDone ? (
                <button
                  onClick={handleCompleteDaily}
                  disabled={completing}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #15803d, #22c55e)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    boxShadow: "0 0 20px rgba(34,197,94,0.3)",
                    transition: "all 0.2s",
                    minWidth: 140,
                  }}
                >
                  {completing ? "⏳ Saving..." : "✓ Mark Done"}
                </button>
              ) : (
                <div
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    color: "#22c55e",
                    fontWeight: 700,
                    fontSize: 14,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✓ Done today
                </div>
              )}
            </div>

            {justCompleted && (
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#4ade80",
                  fontWeight: 600,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                🎉 Amazing! You saved {dailyChallenge.co2Saved}kg CO₂ and earned{" "}
                {dailyChallenge.points} points!
              </div>
            )}
          </div>
        )}

        {/* Category breakdown */}
        <div
          style={{
            padding: "28px",
            borderRadius: 24,
            marginBottom: 20,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 17,
                margin: 0,
              }}
            >
              Footprint Categories
            </h2>
            <a
              href="/results"
              style={{
                color: "#22c55e",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Full analysis →
            </a>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-10"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {Object.entries(categoryScores)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, kg]) => {
                const conf = categoryConfig[cat];
                const pct = totalKg > 0 ? (kg / totalKg) * 100 : 0;
                return (
                  <div key={cat}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span>{conf.emoji}</span>
                        <span
                          style={{
                            color: "#d1d5db",
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {conf.label}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ color: "#64748b", fontSize: 13 }}>
                          {Math.round(pct)}%
                        </span>
                        <span
                          style={{
                            color: "white",
                            fontSize: 13,
                            fontWeight: 600,
                          }}
                        >
                          {translateCo2(kg)}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: "rgba(255,255,255,0.05)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          borderRadius: 3,
                          background: conf.color,
                          boxShadow: `0 0 6px ${conf.color}60`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* CO₂ impact translation */}
        {totalCo2Saved > 0 && co2Translations.length > 0 && (
          <div
            style={{
              padding: "24px",
              borderRadius: 20,
              marginBottom: 20,
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(20,184,166,0.05))",
              border: "1px solid rgba(34,197,94,0.15)",
            }}
          >
            <h2
              style={{
                color: "white",
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 16,
              }}
            >
              🌍 Your Impact in Real Terms
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {co2Translations.map((t, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <span style={{ color: "#94a3b8", fontSize: 14 }}>
                    {t.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent activity */}
        {recentCompleted.length > 0 && (
          <div
            style={{
              padding: "24px",
              borderRadius: 20,
              marginBottom: 24,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                  margin: 0,
                }}
              >
                Recent Completions
              </h2>
              <a
                href="/challenges"
                style={{
                  color: "#22c55e",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                All challenges →
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentCompleted.map((c) => {
                const ch = allChallenges.find((a) => a.id === c.id);
                if (!ch) return null;
                return (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{ch.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: "#d1d5db",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {ch.title}
                      </div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>
                        {new Date(c.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      style={{
                        color: "#22c55e",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      +{c.co2Saved}kg saved
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              href: "/challenges",
              emoji: "⚡",
              label: "Browse Challenges",
              color: "#f97316",
            },
            {
              href: "/coach",
              emoji: "🤖",
              label: "Ask AI Coach",
              color: "#60a5fa",
            },
            {
              href: "/quiz",
              emoji: "🔄",
              label: "Retake Quiz",
              color: "#a855f7",
            },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 18px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = `${link.color}40`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")
              }
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${link.color}15`,
                  border: `1px solid ${link.color}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {link.emoji}
              </span>
              <span style={{ color: "#d1d5db", fontWeight: 600, fontSize: 14 }}>
                {link.label}
              </span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button
            onClick={handleReset}
            style={{
              background: "transparent",
              border: "none",
              color: "#374151",
              fontSize: 12,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Reset all data
          </button>
        </div>
      </div>
    </div>
  );
}
