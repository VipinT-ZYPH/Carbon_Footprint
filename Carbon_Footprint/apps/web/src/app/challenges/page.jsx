"use client";
import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import {
  getStorageData,
  completeChallenge,
  getDailyChallenge,
} from "../../utils/carbonStorage";
import { challenges, categoryConfig } from "../../data/challengesData";

const DIFFICULTIES = {
  easy: { label: "Easy", color: "#22c55e" },
  medium: { label: "Medium", color: "#eab308" },
  hard: { label: "Hard", color: "#ef4444" },
};

export default function ChallengesPage() {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [completing, setCompleting] = useState(null);
  const [justDone, setJustDone] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  const loadData = () => {
    const stored = getStorageData();
    setData(stored);
    const daily = getDailyChallenge(challenges);
    setDailyChallenge(daily);
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const handleComplete = async (challenge) => {
    if (completing) return;
    setCompleting(challenge.id);
    await new Promise((r) => setTimeout(r, 500));
    completeChallenge(challenge.id, challenge.co2Saved, challenge.points);
    setJustDone(challenge.id);
    setCompleting(null);
    loadData();
    setTimeout(() => setJustDone(null), 2500);
  };

  if (!mounted) return null;

  const completedIds = (data?.completedChallenges || []).map((c) => c.id);

  const filteredChallenges =
    filter === "all"
      ? challenges
      : challenges.filter((c) => c.category === filter);

  const completedCount = completedIds.length;
  const totalCo2 = (data?.totalCo2Saved || 0).toFixed(1);

  return (
    <div style={{ minHeight: "100vh", background: "#050e07" }}>
      <Navigation />

      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 100px" }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Daily Challenges ⚡
          </h1>
          <p style={{ color: "#64748b", fontSize: 15 }}>
            Complete challenges to earn points, build streaks, and reduce your
            footprint.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              val: completedCount,
              label: "Completed",
              color: "#22c55e",
              emoji: "✅",
            },
            {
              val: `${totalCo2}kg`,
              label: "CO₂ Saved",
              color: "#4ade80",
              emoji: "💨",
            },
            {
              val: data?.totalPoints || 0,
              label: "Points",
              color: "#f97316",
              emoji: "⚡",
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                borderRadius: 16,
                textAlign: "center",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 2 }}>{stat.emoji}</div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {stat.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Today's challenge highlight */}
        {dailyChallenge && (
          <div
            style={{
              padding: "20px 24px",
              borderRadius: 18,
              marginBottom: 28,
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(20,184,166,0.06))",
              border: "1px solid rgba(34,197,94,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 28 }}>{dailyChallenge.emoji}</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#22c55e",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                TODAY'S FEATURED CHALLENGE
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>
                {dailyChallenge.title}
              </div>
              <div style={{ color: "#64748b", fontSize: 13 }}>
                Save {dailyChallenge.co2Saved}kg CO₂ · +{dailyChallenge.points}{" "}
                points
              </div>
            </div>
            <a
              href="/dashboard"
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "#4ade80",
                fontWeight: 600,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              View →
            </a>
          </div>
        )}

        {/* Category filter */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {Object.entries(categoryConfig).map(([key, conf]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                background:
                  filter === key ? conf.color : "rgba(255,255,255,0.05)",
                color: filter === key ? "#000" : "#94a3b8",
                fontWeight: filter === key ? 700 : 500,
                fontSize: 13,
                transition: "all 0.2s",
              }}
            >
              {conf.emoji} {conf.label}
            </button>
          ))}
        </div>

        {/* Progress summary */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>
              Overall progress
            </span>
            <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>
              {completedCount} / {challenges.length} challenges
            </span>
          </div>
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
                width: `${(completedCount / challenges.length) * 100}%`,
                borderRadius: 3,
                background: "linear-gradient(90deg, #16a34a, #22c55e)",
                boxShadow: "0 0 8px rgba(34,197,94,0.4)",
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>

        {/* Challenges grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredChallenges.map((challenge) => {
            const isDone = completedIds.includes(challenge.id);
            const isTodaysDaily = dailyChallenge?.id === challenge.id;
            const isCompleting = completing === challenge.id;
            const wasJustDone = justDone === challenge.id;
            const catConf = categoryConfig[challenge.category];
            const diffConf = DIFFICULTIES[challenge.difficulty];

            return (
              <div
                key={challenge.id}
                style={{
                  padding: "20px 24px",
                  borderRadius: 20,
                  background: isDone
                    ? "rgba(34,197,94,0.05)"
                    : "rgba(255,255,255,0.03)",
                  border:
                    isTodaysDaily && !isDone
                      ? "1px solid rgba(34,197,94,0.3)"
                      : isDone
                        ? "1px solid rgba(34,197,94,0.15)"
                        : "1px solid rgba(255,255,255,0.07)",
                  opacity: isDone ? 0.7 : 1,
                  transition: "all 0.3s",
                }}
              >
                {isTodaysDaily && !isDone && (
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#22c55e",
                      letterSpacing: "0.1em",
                      marginBottom: 10,
                    }}
                  >
                    ⚡ TODAY'S CHALLENGE
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Icon */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: catConf?.bg || "rgba(255,255,255,0.08)",
                      border: `1px solid ${catConf?.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? "✅" : challenge.emoji}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginBottom: 8,
                        alignItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          color: isDone ? "#64748b" : "white",
                          fontWeight: 700,
                          fontSize: 16,
                          margin: 0,
                          textDecoration: isDone ? "line-through" : "none",
                        }}
                      >
                        {challenge.title}
                      </h3>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 8,
                          background: `${diffConf.color}18`,
                          color: diffConf.color,
                          fontWeight: 600,
                        }}
                      >
                        {diffConf.label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 8,
                          background: catConf?.bg || "rgba(255,255,255,0.08)",
                          color: catConf?.color || "#94a3b8",
                          fontWeight: 600,
                        }}
                      >
                        {catConf?.emoji} {catConf?.label}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "#64748b",
                        fontSize: 13,
                        lineHeight: 1.5,
                        marginBottom: 10,
                      }}
                    >
                      {challenge.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "#22c55e",
                          fontWeight: 600,
                        }}
                      >
                        💨 {challenge.co2Saved}kg CO₂
                      </span>
                      <span style={{ color: "#1e2a1f", fontSize: 12 }}>·</span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#f97316",
                          fontWeight: 600,
                        }}
                      >
                        ⚡ +{challenge.points} pts
                      </span>
                      <span style={{ color: "#1e2a1f", fontSize: 12 }}>·</span>
                      <span style={{ fontSize: 12, color: "#475569" }}>
                        ⏱ {challenge.timeRequired}
                      </span>
                    </div>

                    {/* Tip */}
                    <div
                      style={{
                        marginTop: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <span
                        style={{
                          color: "#22c55e",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        💡{" "}
                      </span>
                      <span style={{ color: "#64748b", fontSize: 12 }}>
                        {challenge.tip}
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div style={{ flexShrink: 0 }}>
                    {isDone ? (
                      <div
                        style={{
                          padding: "10px 16px",
                          borderRadius: 10,
                          background: "rgba(34,197,94,0.1)",
                          color: "#22c55e",
                          fontWeight: 700,
                          fontSize: 13,
                          textAlign: "center",
                        }}
                      >
                        ✓ Done
                      </div>
                    ) : (
                      <button
                        onClick={() => handleComplete(challenge)}
                        disabled={isCompleting}
                        style={{
                          padding: "10px 20px",
                          borderRadius: 10,
                          border: "none",
                          background: isCompleting
                            ? "rgba(34,197,94,0.3)"
                            : "linear-gradient(135deg, #15803d, #22c55e)",
                          color: "white",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: isCompleting ? "wait" : "pointer",
                          boxShadow: "0 0 16px rgba(34,197,94,0.25)",
                          transition: "all 0.2s",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isCompleting ? "⏳..." : "✓ Complete"}
                      </button>
                    )}
                  </div>
                </div>

                {wasJustDone && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      color: "#4ade80",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    🎉 Challenge complete! +{challenge.points} pts · Saved{" "}
                    {challenge.co2Saved}kg CO₂
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
