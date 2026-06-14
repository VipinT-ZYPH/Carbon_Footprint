"use client";
import { useState, useEffect } from "react";
import { getStorageData } from "../utils/carbonStorage";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", emoji: "📊" },
  { href: "/challenges", label: "Challenges", emoji: "⚡" },
  { href: "/coach", label: "AI Coach", emoji: "🤖" },
];

export default function Navigation() {
  const [ecoScore, setEcoScore] = useState(null);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const data = getStorageData();
    if (data.footprint) {
      setEcoScore(data.footprint.ecoScore);
      setHasQuiz(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: scrolled ? "rgba(5, 14, 8, 0.92)" : "rgba(5, 14, 8, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(34,197,94,0.15)"
            : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 no-underline group">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  boxShadow: "0 0 20px rgba(34,197,94,0.3)",
                  transition: "box-shadow 0.2s",
                }}
                className="group-hover:shadow-green-500/50"
              >
                🌍
              </div>
              <span className="font-bold text-white text-lg tracking-tight hidden sm:block">
                Eco<span className="text-green-400">Quest</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    color: currentPath === link.href ? "#4ade80" : "#94a3b8",
                    background:
                      currentPath === link.href
                        ? "rgba(34,197,94,0.1)"
                        : "transparent",
                    border:
                      currentPath === link.href
                        ? "1px solid rgba(34,197,94,0.2)"
                        : "1px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {hasQuiz && ecoScore !== null && (
                <a href="/dashboard" style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 12px",
                      borderRadius: 20,
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.25)",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background:
                          ecoScore >= 70
                            ? "#22c55e"
                            : ecoScore >= 40
                              ? "#eab308"
                              : "#ef4444",
                        boxShadow: `0 0 6px ${ecoScore >= 70 ? "#22c55e" : ecoScore >= 40 ? "#eab308" : "#ef4444"}`,
                      }}
                    />
                    <span
                      style={{
                        color: "#4ade80",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      Eco {ecoScore}
                    </span>
                  </div>
                </a>
              )}
              {!hasQuiz && (
                <a
                  href="/quiz"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #16a34a, #22c55e)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    boxShadow: "0 0 20px rgba(34,197,94,0.3)",
                    transition: "all 0.2s",
                  }}
                >
                  Take Quiz ✨
                </a>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg"
                style={{
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(5, 14, 8, 0.98)",
              padding: "8px 16px 16px",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 12px",
                  borderRadius: 8,
                  color: "#d1d5db",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 500,
                  marginTop: 4,
                }}
              >
                <span>{link.emoji}</span>
                {link.label}
              </a>
            ))}
            {!hasQuiz && (
              <a
                href="/quiz"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  marginTop: 12,
                  padding: "12px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  color: "white",
                  textAlign: "center",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Take the Quiz ✨
              </a>
            )}
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div style={{ height: 64 }} />
    </>
  );
}
