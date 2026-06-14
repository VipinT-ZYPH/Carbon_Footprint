"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Navigation from "../../components/Navigation";
import { getStorageData } from "../../utils/carbonStorage";
import { generateResponse, getThinkingDelay } from "../../utils/coachEngine";

const SUGGESTED_PROMPTS = [
  {
    emoji: "🎯",
    text: "What's my single biggest opportunity to reduce my footprint?",
    intent: "biggest_opportunity",
  },
  {
    emoji: "🗓️",
    text: "Create a 7-day eco-challenge plan personalised for me",
    intent: "seven_day_plan",
  },
  {
    emoji: "🍽️",
    text: "Give me practical food and diet tips for lower emissions",
    intent: "food",
  },
  {
    emoji: "🚗",
    text: "How can I cut my transport emissions without giving up my car?",
    intent: "transport",
  },
  {
    emoji: "💡",
    text: "What home changes have the biggest impact on energy and CO₂?",
    intent: "home",
  },
  {
    emoji: "🛍️",
    text: "How do I shop more sustainably on a tight budget?",
    intent: "shopping",
  },
  {
    emoji: "📊",
    text: "Explain my carbon footprint in simple terms",
    intent: "explain_footprint",
  },
  {
    emoji: "😊",
    text: "I tried to be eco-friendly but struggled. How do I stay motivated?",
    intent: "motivation",
  },
];

// Simple markdown-ish renderer: bold, bullets, headings, horizontal rules
function renderText(text) {
  const lines = text.split("\n");
  const elements = [];
  let keyIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(
        <hr
          key={keyIdx++}
          style={{
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            margin: "14px 0",
          }}
        />,
      );
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      const content = line.replace(/^## /, "");
      elements.push(
        <div
          key={keyIdx++}
          style={{
            fontWeight: 800,
            fontSize: 16,
            color: "white",
            marginBottom: 10,
            marginTop: 4,
          }}
        >
          {renderInline(content)}
        </div>,
      );
      continue;
    }

    // H3 or table header
    if (line.startsWith("| ")) {
      // Skip table lines (just render as text simply)
      const cells = line
        .split("|")
        .filter((c) => c.trim() && !c.trim().match(/^[-:]+$/));
      if (cells.length > 0) {
        elements.push(
          <div
            key={keyIdx++}
            style={{
              display: "flex",
              gap: 12,
              padding: "6px 10px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.04)",
              fontSize: 13,
              color: "#d1d5db",
              flexWrap: "wrap",
              marginBottom: 2,
            }}
          >
            {cells.map((c, ci) => (
              <span key={ci} style={{ flex: "1 1 80px", minWidth: 60 }}>
                {renderInline(c.trim())}
              </span>
            ))}
          </div>,
        );
      }
      continue;
    }

    // Bullet points (-, *, •)
    if (/^[-*•] /.test(line.trim())) {
      const content = line.trim().replace(/^[-*•] /, "");
      elements.push(
        <div
          key={keyIdx++}
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 6,
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              color: "#22c55e",
              fontSize: 14,
              marginTop: 1,
              flexShrink: 0,
            }}
          >
            ▸
          </span>
          <span style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.55 }}>
            {renderInline(content)}
          </span>
        </div>,
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line.trim())) {
      const match = line.trim().match(/^(\d+)\. (.+)/);
      if (match) {
        elements.push(
          <div
            key={keyIdx++}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 8,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                minWidth: 22,
                height: 22,
                borderRadius: 6,
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.25)",
                color: "#4ade80",
                fontSize: 11,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {match[1]}
            </span>
            <span style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.55 }}>
              {renderInline(match[2])}
            </span>
          </div>,
        );
        continue;
      }
    }

    // Bold-only line (used as sub-heading)
    if (/^\*\*.+\*\*$/.test(line.trim())) {
      elements.push(
        <div
          key={keyIdx++}
          style={{
            fontWeight: 700,
            color: "#e2e8f0",
            fontSize: 14,
            marginTop: 8,
            marginBottom: 4,
          }}
        >
          {renderInline(line.trim())}
        </div>,
      );
      continue;
    }

    // Empty line → small spacer
    if (line.trim() === "") {
      elements.push(<div key={keyIdx++} style={{ height: 6 }} />);
      continue;
    }

    // Regular text
    elements.push(
      <div
        key={keyIdx++}
        style={{
          color: "#d1d5db",
          fontSize: 14,
          lineHeight: 1.65,
          marginBottom: 2,
        }}
      >
        {renderInline(line)}
      </div>,
    );
  }

  return elements;
}

function renderInline(text) {
  // Handle **bold** and *italic*
  const parts = [];
  let remaining = text;
  let idx = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(
          <span key={idx++}>{remaining.slice(0, boldMatch.index)}</span>,
        );
      }
      parts.push(
        <strong key={idx++} style={{ color: "#f1f5f9", fontWeight: 700 }}>
          {boldMatch[1]}
        </strong>,
      );
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      parts.push(<span key={idx++}>{remaining}</span>);
      break;
    }
  }

  return parts.length > 0 ? parts : text;
}

function TypingDots() {
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        alignItems: "center",
        padding: "2px 0",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            opacity: 0.7,
            animation: `typing-dot 1.1s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Message({ role, content, isThinking, intentBadge }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 18,
        animation: "msg-appear 0.25s ease",
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            flexShrink: 0,
            background: "linear-gradient(135deg, #15803d, #22c55e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            marginRight: 10,
            marginTop: 2,
            boxShadow: "0 0 12px rgba(34,197,94,0.3)",
          }}
        >
          🌿
        </div>
      )}

      <div style={{ maxWidth: "80%", minWidth: 0 }}>
        {intentBadge && !isUser && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.07em",
              color: "#22c55e",
              marginBottom: 6,
              paddingLeft: 2,
              opacity: 0.8,
            }}
          >
            {intentBadge}
          </div>
        )}
        <div
          style={{
            padding: "13px 17px",
            borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
            background: isUser
              ? "linear-gradient(135deg, #15803d, #22c55e)"
              : "rgba(255,255,255,0.05)",
            border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {isThinking ? (
            <TypingDots />
          ) : isUser ? (
            <div
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {content}
            </div>
          ) : (
            <div>{renderText(content)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

const INTENT_LABELS = {
  biggest_opportunity: "🎯 BIGGEST OPPORTUNITY",
  food: "🍽️ FOOD & DIET",
  transport: "🚗 TRANSPORT",
  home: "⚡ HOME ENERGY",
  shopping: "🛍️ SHOPPING",
  waste: "♻️ WASTE & RECYCLING",
  seven_day_plan: "🗓️ 7-DAY PLAN",
  explain_footprint: "📊 FOOTPRINT EXPLAINED",
  motivation: "💪 MOTIVATION",
  comparison: "🌍 COMPARISON",
  budget: "💸 ECO ON A BUDGET",
  challenge_suggestion: "⚡ CHALLENGE",
  progress: "📈 PROGRESS",
  greeting: "👋 WELCOME",
  fallback: "🌿 ECO COACH",
};

export default function CoachPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [context, setContext] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [conversationIntents, setConversationIntents] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const data = getStorageData();

    if (data?.footprint) {
      setContext({
        ecoScore: data.footprint.ecoScore,
        personality: data.footprint.personality?.name,
        highestCategory: data.footprint.highestCategory,
        completedChallenges: data.completedChallenges?.length || 0,
        totalCo2Saved: data.totalCo2Saved || 0,
        streak: data.streak?.count || 0,
      });
    }

    const welcome = data?.footprint
      ? `Hi! I'm **Eco**, your personal sustainability coach 🌿\n\nI can see you're a **"${data.footprint.personality?.name}"** with an Eco Score of **${data.footprint.ecoScore}/100**. Your biggest opportunity is in the **${data.footprint.highestCategory}** category.\n\nI use your quiz results to give personalised, practical advice — no AI calls, just smart recommendations built around your actual footprint.\n\nAsk me anything to get started!`
      : `Hi! I'm **Eco**, your personal sustainability coach 🌿\n\nI give practical, personalised sustainability advice based on your carbon personality and quiz results.\n\n**Tip:** Take the quiz first so I can personalise every recommendation to your lifestyle. Or just ask me anything!`;

    setMessages([{ role: "assistant", content: welcome, intent: "greeting" }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = useCallback(
    async (text) => {
      const messageText = (text || input).trim();
      if (!messageText || thinking) return;

      setInput("");
      const userMsg = { role: "user", content: messageText };
      setMessages((prev) => [...prev, userMsg]);
      setThinking(true);

      // Get full storage data for context
      const storageData = getStorageData();

      // Generate the response (pure JS, no API call)
      const { response, intent } = generateResponse(
        messageText,
        storageData,
        conversationIntents,
      );
      const delay = getThinkingDelay(response);

      // Simulate natural thinking time
      await new Promise((r) => setTimeout(r, delay));

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, intent },
      ]);
      setConversationIntents((prev) => [...prev, intent]);
      setThinking(false);
    },
    [input, thinking, conversationIntents],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showPrompts = messages.length <= 1 && !thinking;

  if (!mounted) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050e07",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navigation />

      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          width: "100%",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "28px 0 16px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "linear-gradient(135deg, #15803d, #22c55e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 0 20px rgba(34,197,94,0.3)",
              }}
            >
              🌿
            </div>
            <div>
              <h1
                style={{
                  color: "white",
                  fontSize: 20,
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                Sustainability Coach
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 3,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 6px #22c55e",
                  }}
                />
                <span
                  style={{ color: "#22c55e", fontSize: 12, fontWeight: 600 }}
                >
                  Eco · Rule-based · Instant
                </span>
              </div>
            </div>
          </div>

          {context && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 10,
              }}
            >
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
                Eco {context.ecoScore}
              </span>
              <span
                style={{
                  fontSize: 12,
                  padding: "3px 10px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  color: "#94a3b8",
                  fontWeight: 500,
                }}
              >
                {context.personality}
              </span>
              <span
                style={{
                  fontSize: 12,
                  padding: "3px 10px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  color: "#94a3b8",
                  fontWeight: 500,
                }}
              >
                Top area: {context.highestCategory}
              </span>
              {context.streak > 0 && (
                <span
                  style={{
                    fontSize: 12,
                    padding: "3px 10px",
                    borderRadius: 10,
                    background: "rgba(251,146,60,0.1)",
                    color: "#fb923c",
                    fontWeight: 600,
                  }}
                >
                  🔥 {context.streak} day streak
                </span>
              )}
            </div>
          )}
        </div>

        {/* Suggested prompts */}
        {showPrompts && (
          <div
            style={{
              padding: "18px 0",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p
              style={{
                color: "#374151",
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 10,
                letterSpacing: "0.06em",
              }}
            >
              QUICK STARTERS
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: 7,
              }}
            >
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt.text)}
                  style={{
                    padding: "10px 13px",
                    borderRadius: 11,
                    textAlign: "left",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#94a3b8",
                    fontSize: 13,
                    cursor: "pointer",
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    lineHeight: 1.4,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
                    e.currentTarget.style.color = "#d1d5db";
                    e.currentTarget.style.background = "rgba(34,197,94,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "#94a3b8";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <span style={{ flexShrink: 0, fontSize: 15 }}>
                    {prompt.emoji}
                  </span>
                  <span>{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 0",
            minHeight: 300,
            maxHeight: "calc(100vh - 440px)",
          }}
        >
          {messages.map((msg, i) => (
            <Message
              key={i}
              role={msg.role}
              content={msg.content}
              intentBadge={
                msg.intent && msg.role === "assistant"
                  ? INTENT_LABELS[msg.intent]
                  : null
              }
            />
          ))}

          {thinking && <Message role="assistant" content="" isThinking />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "14px 0 32px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 16,
              padding: "10px 14px",
              transition: "border-color 0.2s",
            }}
            onFocusCapture={(e) =>
              (e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)")
            }
            onBlurCapture={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")
            }
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your footprint, get a plan, or explore any eco topic..."
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: 15,
                resize: "none",
                lineHeight: 1.5,
                maxHeight: 120,
                fontFamily: "inherit",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || thinking}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "none",
                flexShrink: 0,
                background:
                  input.trim() && !thinking
                    ? "linear-gradient(135deg, #15803d, #22c55e)"
                    : "rgba(255,255,255,0.06)",
                color: input.trim() && !thinking ? "white" : "#374151",
                cursor: input.trim() && !thinking ? "pointer" : "not-allowed",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  input.trim() && !thinking
                    ? "0 0 16px rgba(34,197,94,0.3)"
                    : "none",
                transition: "all 0.2s",
              }}
            >
              {thinking ? "⏳" : "↑"}
            </button>
          </div>

          <p
            style={{
              color: "#1f2937",
              fontSize: 11,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Press Enter to send · Shift+Enter for new line · Rule-based · No
            external API
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes msg-appear {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typing-dot {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
