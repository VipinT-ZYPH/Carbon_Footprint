"use client";
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { getStorageData } from "../utils/carbonStorage";

const features = [
  {
    emoji: "🧬",
    title: "Carbon Personality Quiz",
    desc: "Answer 8 smart questions and discover your unique carbon personality and footprint breakdown.",
    color: "#22c55e",
  },
  {
    emoji: "🤖",
    title: "AI Sustainability Coach",
    desc: "Get personalized, actionable advice from an AI that knows your habits and biggest opportunities.",
    color: "#60a5fa",
  },
  {
    emoji: "⚡",
    title: "Daily Eco Challenges",
    desc: "Complete bite-sized daily challenges tailored to your impact areas. Track streaks and earn points.",
    color: "#f97316",
  },
  {
    emoji: "📊",
    title: "Progress Dashboard",
    desc: "Watch your Eco Score climb. See CO₂ saved, streaks, levels, and category-by-category progress.",
    color: "#a855f7",
  },
  {
    emoji: "🎯",
    title: "Smart Action Plans",
    desc: "AI prioritizes your highest-impact actions — so you're never overwhelmed, always making progress.",
    color: "#ec4899",
  },
  {
    emoji: "🌍",
    title: "Real Impact Tracking",
    desc: "Translate your savings into real-world equivalents. See exactly what your choices mean for the planet.",
    color: "#14b8a6",
  },
];

const steps = [
  {
    num: "01",
    title: "Take the Quiz",
    desc: "Answer 8 lifestyle questions in under 2 minutes.",
    emoji: "📝",
  },
  {
    num: "02",
    title: "See Your Footprint",
    desc: "Get your carbon personality, Eco Score, and breakdown.",
    emoji: "📊",
  },
  {
    num: "03",
    title: "Get Your Plan",
    desc: "AI generates a personalized action plan for your lifestyle.",
    emoji: "🤖",
  },
  {
    num: "04",
    title: "Build the Habit",
    desc: "Complete daily challenges, earn points, and watch your score rise.",
    emoji: "🏆",
  },
];

const stats = [
  { value: "7 tons", label: "World average CO₂/year", emoji: "🌍" },
  { value: "30%", label: "Reduction from diet changes", emoji: "🥦" },
  { value: "80%", label: "Less CO₂ — public vs car", emoji: "🚌" },
  { value: "82%", label: "Lower impact — secondhand", emoji: "♻️" },
];

export default function LandingPage() {
  const [hasQuiz, setHasQuiz] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const data = getStorageData();
    if (data.footprint) setHasQuiz(true);
  }, []);

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#050e07" }}>
      <Navigation />

      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          padding: "80px 24px 60px",
        }}
      >
        {/* Animated background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34,197,94,0.06), transparent 60%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-6xl mx-auto w-full relative">
          <div className="text-center">
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 20,
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
                marginBottom: 32,
                fontSize: 13,
                fontWeight: 600,
                color: "#4ade80",
                letterSpacing: "0.02em",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 8px #22c55e",
                  display: "inline-block",
                }}
              />
              AI-POWERED CLIMATE ACTION
            </div>

            <h1
              style={{
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: 900,
                lineHeight: 1.05,
                color: "white",
                marginBottom: 24,
                letterSpacing: "-0.03em",
              }}
            >
              Turn awareness into
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #22c55e, #4ade80, #86efac)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                daily climate action
              </span>
            </h1>

            <p
              style={{
                fontSize: "clamp(16px, 2.5vw, 20px)",
                color: "#94a3b8",
                maxWidth: 560,
                margin: "0 auto 48px",
                lineHeight: 1.7,
              }}
            >
              Discover your carbon footprint, get AI-powered recommendations,
              and build eco-habits through daily challenges — in under 2
              minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={hasQuiz ? "/dashboard" : "/quiz"}
                style={{
                  padding: "16px 36px",
                  borderRadius: 50,
                  background: "linear-gradient(135deg, #15803d, #22c55e)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 17,
                  textDecoration: "none",
                  boxShadow:
                    "0 0 40px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                  transition: "all 0.2s",
                  display: "inline-block",
                }}
              >
                {hasQuiz ? "📊 Go to Dashboard" : "✨ Find My Footprint — Free"}
              </a>
              {hasQuiz && (
                <a
                  href="/quiz"
                  style={{
                    padding: "16px 28px",
                    borderRadius: 50,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#d1d5db",
                    fontWeight: 600,
                    fontSize: 16,
                    textDecoration: "none",
                  }}
                >
                  Retake Quiz
                </a>
              )}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 justify-center mt-12">
              {[
                "No signup required",
                "2-min quiz",
                "AI-personalized",
                "100% free",
              ].map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#64748b",
                    fontSize: 14,
                  }}
                >
                  <span style={{ color: "#22c55e" }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
            style={{ maxWidth: 800, margin: "80px auto 0" }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 16px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>
                  {stat.emoji}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#22c55e",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 24px", background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              style={{
                color: "#22c55e",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              HOW IT WORKS
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              From curious to climate-smart in 4 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontSize: 13,
                    fontWeight: 800,
                    color: "rgba(34,197,94,0.3)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {step.num}
                </div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>
                  {step.emoji}
                </div>
                <h3
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: 17,
                    marginBottom: 8,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: 14,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              style={{
                color: "#22c55e",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              FEATURES
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Everything you need to reduce your impact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <div
                key={i}
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  transition: "transform 0.2s, border-color 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${feat.color}33`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `${feat.color}20`,
                    border: `1px solid ${feat.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    marginBottom: 18,
                  }}
                >
                  {feat.emoji}
                </div>
                <h3
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: 17,
                    marginBottom: 10,
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: 14,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px 120px" }}>
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            padding: "64px 32px",
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(22,163,74,0.15), rgba(20,184,166,0.1))",
            border: "1px solid rgba(34,197,94,0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 400,
              background:
                "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />
          <div style={{ fontSize: 48, marginBottom: 20 }}>🌱</div>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Your climate journey starts with one quiz
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 17,
              lineHeight: 1.6,
              marginBottom: 36,
            }}
          >
            No sign up. No judgment. Just honest insights and a practical plan
            that fits your life.
          </p>
          <a
            href="/quiz"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              borderRadius: 50,
              background: "linear-gradient(135deg, #15803d, #22c55e)",
              color: "white",
              fontWeight: 700,
              fontSize: 17,
              textDecoration: "none",
              boxShadow: "0 0 40px rgba(34,197,94,0.35)",
            }}
          >
            Start the Quiz — 2 minutes ✨
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 24px",
          textAlign: "center",
          color: "#374151",
          fontSize: 14,
        }}
      >
        <span style={{ color: "#22c55e", fontWeight: 700 }}>🌍 EcoQuest</span>
        <span style={{ color: "#1f2937", marginLeft: 12 }}>
          Built for a greener future · Hackathon 2026
        </span>
      </footer>
    </div>
  );
}
