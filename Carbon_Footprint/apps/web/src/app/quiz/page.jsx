"use client";
import { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import { quizQuestions, calculateFootprint } from "../../data/quizData";
import { saveQuizResults } from "../../utils/carbonStorage";

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("forward");
  const [done, setDone] = useState(false);

  const question = quizQuestions[step];
  const progress = (step / quizQuestions.length) * 100;
  const isLast = step === quizQuestions.length - 1;

  useEffect(() => {
    setSelected(answers[question?.id] || null);
  }, [step]);

  const handleSelect = (value) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      const footprint = calculateFootprint(newAnswers);
      saveQuizResults(newAnswers, footprint);
      setDone(true);
      setTimeout(() => {
        window.location.href = "/results";
      }, 1200);
      return;
    }

    setAnimating(true);
    setDirection("forward");
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 200);
  };

  const handleBack = () => {
    if (step === 0) return;
    setAnimating(true);
    setDirection("back");
    setTimeout(() => {
      setStep((s) => s - 1);
      setAnimating(false);
    }, 200);
  };

  if (done) {
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
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 64,
              marginBottom: 24,
              animation: "spin 1s ease-out",
            }}
          >
            🌍
          </div>
          <h2
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Calculating your footprint...
          </h2>
          <p style={{ color: "#64748b" }}>
            Preparing your personalized results
          </p>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>
        <style jsx global>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-12px); opacity: 0.5; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050e07" }}>
      <Navigation />

      <div
        style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 20,
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              fontSize: 13,
              fontWeight: 600,
              color: "#4ade80",
              marginBottom: 12,
            }}
          >
            Question {step + 1} of {quizQuestions.length}
          </div>
          <h1
            style={{
              color: "white",
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 800,
              marginBottom: 4,
              letterSpacing: "-0.01em",
            }}
          >
            Carbon Footprint Quiz
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
            Your honest answers lead to smarter recommendations
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#64748b", fontSize: 12, fontWeight: 600 }}>
              Progress
            </span>
            <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>
              {Math.round(progress)}%
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
                width: `${progress}%`,
                borderRadius: 3,
                background: "linear-gradient(90deg, #16a34a, #22c55e, #4ade80)",
                transition: "width 0.5s ease",
                boxShadow: "0 0 10px rgba(34,197,94,0.5)",
              }}
            />
          </div>

          {/* Category dots */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            {quizQuestions.map((q, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    i < step
                      ? "#22c55e"
                      : i === step
                        ? "#4ade80"
                        : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction === "forward" ? "-30px" : "30px"})`
              : "translateX(0)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          {/* Category badge */}
          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 20,
                background: `${question.color}15`,
                border: `1px solid ${question.color}30`,
                color: question.color,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {question.emoji} {question.category}
            </span>
          </div>

          <h2
            style={{
              color: "white",
              fontSize: "clamp(20px, 3vw, 26px)",
              fontWeight: 700,
              marginBottom: 28,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}
          >
            {question.question}
          </h2>

          {/* Options grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {question.options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    borderRadius: 16,
                    border: isSelected
                      ? `2px solid ${question.color}`
                      : "2px solid rgba(255,255,255,0.07)",
                    background: isSelected
                      ? `${question.color}15`
                      : "rgba(255,255,255,0.03)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.18s ease",
                    transform: isSelected ? "scale(1.01)" : "scale(1)",
                    boxShadow: isSelected
                      ? `0 0 20px ${question.color}25`
                      : "none",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: isSelected
                        ? `${question.color}25`
                        : "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                      transition: "all 0.18s",
                    }}
                  >
                    {opt.emoji}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: isSelected ? "white" : "#d1d5db",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: 15,
                        marginBottom: 2,
                        transition: "color 0.18s",
                      }}
                    >
                      {opt.label}
                    </div>
                    <div
                      style={{
                        color: isSelected ? question.color : "#4b5563",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {opt.sublabel}
                    </div>
                  </div>

                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: isSelected
                        ? `2px solid ${question.color}`
                        : "2px solid rgba(255,255,255,0.15)",
                      background: isSelected ? question.color : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.18s",
                    }}
                  >
                    {isSelected && (
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 12 10"
                        fill="none"
                      >
                        <path
                          d="M1 5L4.5 8.5L11 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 32,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleBack}
            disabled={step === 0}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: step === 0 ? "#374151" : "#94a3b8",
              fontWeight: 600,
              fontSize: 15,
              cursor: step === 0 ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selected}
            style={{
              flex: 1,
              maxWidth: 280,
              padding: "14px 32px",
              borderRadius: 12,
              border: "none",
              background: selected
                ? "linear-gradient(135deg, #15803d, #22c55e)"
                : "rgba(255,255,255,0.05)",
              color: selected ? "white" : "#374151",
              fontWeight: 700,
              fontSize: 16,
              cursor: selected ? "pointer" : "not-allowed",
              boxShadow: selected ? "0 0 24px rgba(34,197,94,0.3)" : "none",
              transition: "all 0.2s",
            }}
          >
            {isLast ? "🌍 See My Results" : "Next →"}
          </button>
        </div>

        {/* Skip hint */}
        {!selected && (
          <p
            style={{
              textAlign: "center",
              color: "#374151",
              fontSize: 13,
              marginTop: 16,
            }}
          >
            Select an answer to continue
          </p>
        )}
      </div>
    </div>
  );
}
