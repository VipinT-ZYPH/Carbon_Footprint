/**
 * Rule-based Sustainability Coach Engine
 *
 * Generates personalized recommendations based on:
 * - Carbon personality type
 * - Quiz category scores (transport / food / home / shopping / waste)
 * - Eco Score & annual footprint
 * - Completed challenges & streak
 *
 * No external API calls — everything runs locally.
 */

import { challenges } from "../data/challengesData";

// ─── Intent detection ─────────────────────────────────────────────────────────

const INTENT_PATTERNS = [
  {
    intent: "greeting",
    patterns: [/^(hi|hello|hey|howdy|sup|what'?s up|yo)\b/i],
  },
  {
    intent: "biggest_opportunity",
    patterns: [
      /biggest (opportunity|impact|win|change|improvement)/i,
      /single (best|biggest|most important)/i,
      /where (should|do) i start/i,
      /most effective/i,
      /what (can|should) i do/i,
      /top (tip|advice|recommendation)/i,
    ],
  },
  {
    intent: "food",
    patterns: [
      /\b(food|eat|diet|meal|meat|vegan|vegetarian|plant.based|cook|recipe|grocery|restaurant|delivery)\b/i,
    ],
  },
  {
    intent: "transport",
    patterns: [
      /\b(transport|car|drive|driving|commut|bus|train|bike|cycling|fly|flight|ev|electric vehicle|public transit)\b/i,
    ],
  },
  {
    intent: "home",
    patterns: [
      /\b(home|house|energy|electric|heating|cooling|thermostat|solar|insul|appliance|boiler|renewable)\b/i,
    ],
  },
  {
    intent: "shopping",
    patterns: [
      /\b(shop|buy|purchas|cloth|fashion|secondhand|thrift|second.hand|consum|spend|product)\b/i,
    ],
  },
  {
    intent: "waste",
    patterns: [
      /\b(waste|recycl|compost|trash|rubbish|bin|single.use|plastic|landfill|reuse)\b/i,
    ],
  },
  {
    intent: "seven_day_plan",
    patterns: [
      /\b(7.?day|week(ly)?|plan|schedule|routine|challenge plan|action plan)\b/i,
    ],
  },
  {
    intent: "explain_footprint",
    patterns: [
      /explain|what (is|does) (my|the)|understand|mean(s?)|how (bad|good)|in simple/i,
      /carbon footprint/i,
      /eco score/i,
      /\bscore\b/i,
    ],
  },
  {
    intent: "motivation",
    patterns: [
      /\b(motivat|stuck|guilt|overwhelm|fail|hard|difficult|frustrated|stress|anxious|hopeless|small|alone|pointless|useless)\b/i,
      /does it (even )?matter/i,
      /not (enough|making a difference)/i,
    ],
  },
  {
    intent: "comparison",
    patterns: [
      /\b(compar|average|how do i (rank|compare)|global|national|country|neighbour)\b/i,
    ],
  },
  {
    intent: "budget",
    patterns: [
      /\b(budget|cheap|afford|free|money|cost|expensive|low.income|student|broke)\b/i,
    ],
  },
  {
    intent: "challenge_suggestion",
    patterns: [
      /\b(challenge|task|activity|what (can|should) i (try|do) today|suggest)\b/i,
    ],
  },
  {
    intent: "progress",
    patterns: [
      /\b(progress|streak|points|level|achievement|how (am|have) i (doing|been))\b/i,
    ],
  },
];

function detectIntent(text) {
  const lower = text.trim().toLowerCase();
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some((p) => p.test(lower))) return intent;
  }
  return "fallback";
}

// ─── Helper formatters ────────────────────────────────────────────────────────

function fmt(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tons`;
  return `${Math.round(kg)} kg`;
}

function pct(a, b) {
  return Math.round((Math.abs(a - b) / b) * 100);
}

function topCategories(categoryScores, n = 2) {
  return Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([cat]) => cat);
}

function categoryLabel(cat) {
  const labels = {
    transport: "transport",
    food: "food",
    home: "home energy",
    shopping: "shopping",
    waste: "waste & recycling",
  };
  return labels[cat] || cat;
}

function categoryEmoji(cat) {
  const map = {
    transport: "🚗",
    food: "🍽️",
    home: "⚡",
    shopping: "🛍️",
    waste: "♻️",
  };
  return map[cat] || "🌿";
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function suggestChallenge(category, completedIds) {
  const pool = challenges.filter(
    (c) => c.category === category && !completedIds.includes(c.id),
  );
  if (pool.length === 0)
    return challenges.find((c) => c.category === category) || challenges[0];
  return randomFrom(pool.filter((c) => c.difficulty === "easy") || pool);
}

// ─── Response generators ──────────────────────────────────────────────────────

function greetingResponse(ctx) {
  if (!ctx) {
    return `Hey there! 👋 I'm Eco, your personal sustainability coach.

I'm here to give you practical, honest advice about reducing your carbon footprint — no guilt, just actionable steps.

**To get the most out of me**, take the carbon quiz first so I can personalise my recommendations to your actual lifestyle. Or just ask me anything to get started!

Try asking:
- "What's my biggest opportunity?"
- "Give me a 7-day eco plan"
- "How can I eat more sustainably on a budget?"`;
  }

  const { personality, ecoScore, highestCategory } = ctx;
  return `Hey! Great to see you 👋

You're a **${personality}** with an Eco Score of **${ecoScore}/100**. Your biggest opportunity right now is your **${categoryLabel(highestCategory)}** habits.

What would you like to work on today? I can:
- Build you a **personalised 7-day plan**
- Dive deep into your **${categoryLabel(highestCategory)}** category
- Suggest **today's challenge** based on your profile
- Explain **what your score really means**

Just ask!`;
}

function biggestOpportunityResponse(ctx) {
  if (!ctx) {
    return `Without your quiz data I can't pinpoint your personal biggest win — but here are the **highest-impact changes** for most people:

1. 🍽️ **Diet** — Switching from heavy meat to flexitarian saves ~1,500 kg CO₂/yr. Biggest single lifestyle lever.
2. 🚗 **Transport** — Ditching a petrol car for public transit saves ~2,000 kg/yr.
3. ⚡ **Home energy** — Switching to a renewable electricity plan can cut 2,000+ kg/yr overnight.
4. ✈️ **Flying** — One long-haul flight can equal months of driving.

Take the quiz and I'll tell you which of these applies most to *you*.`;
  }

  const { highestCategory, categoryScores, totalKg, personality, ecoScore } =
    ctx;
  const top = topCategories(categoryScores, 2);
  const topKg = categoryScores[top[0]];
  const secondKg = categoryScores[top[1]] || 0;

  const categoryAdvice = {
    transport: {
      headline: "Your transport habits are your single biggest lever.",
      actions: [
        `Your transport contributes **${fmt(topKg)} CO₂/yr** — that's ${Math.round((topKg / totalKg) * 100)}% of your total footprint.`,
        `**Quickest win:** Replace just 2 car journeys per week with cycling or public transit → saves roughly **400–800 kg/yr**.`,
        `**If you can go further:** Switching to an EV or moving to car-free living could cut this category by **60–80%**.`,
        `**Even small steps count:** Carpooling with one person halves your per-trip emissions immediately.`,
      ],
      challenge: suggestChallenge("transport", ctx.completedChallengeIds),
    },
    food: {
      headline: "Your diet is your most powerful tool for change.",
      actions: [
        `Food accounts for **${fmt(topKg)} CO₂/yr** in your profile — ${Math.round((topKg / totalKg) * 100)}% of your footprint.`,
        `**Quickest win:** Going meat-free for 3 dinners per week saves approximately **600–900 kg CO₂/yr**.`,
        `**Why it works:** Beef produces 20× more greenhouse gas per gram of protein than legumes.`,
        `**No pressure to go vegan:** Even replacing beef with chicken or swapping 2 meals/week to plant-based makes a measurable difference.`,
      ],
      challenge: suggestChallenge("food", ctx.completedChallengeIds),
    },
    home: {
      headline: "Your home energy use is hiding significant savings.",
      actions: [
        `Home energy is costing **${fmt(topKg)} CO₂/yr** — ${Math.round((topKg / totalKg) * 100)}% of your total.`,
        `**Quickest win:** Switch to a 100% renewable electricity tariff — many are the same price as standard plans, yet eliminate **1,500–2,500 kg/yr** immediately.`,
        `**Free changes:** Lower thermostat by 2°C, wash clothes cold, unplug standby devices → saves ~**300 kg/yr** with zero cost.`,
        `**Longer term:** Proper loft/wall insulation is the single highest-ROI home upgrade available.`,
      ],
      challenge: suggestChallenge("home", ctx.completedChallengeIds),
    },
    shopping: {
      headline: "Your shopping habits have more impact than you might think.",
      actions: [
        `Shopping contributes **${fmt(topKg)} CO₂/yr** to your footprint — ${Math.round((topKg / totalKg) * 100)}% of your total.`,
        `**Quickest win:** Before any non-essential purchase, check secondhand first. Buying used clothing reduces its carbon footprint by **up to 82%**.`,
        `**The 24-hour rule:** Wait 24 hours before any impulse buy. Studies show ~40% of those purchases simply don't happen.`,
        `**Repair culture:** Repairing electronics and clothing instead of replacing them is one of the most impactful things you can do in this category.`,
      ],
      challenge: suggestChallenge("shopping", ctx.completedChallengeIds),
    },
    waste: {
      headline: "Better waste habits can make a real difference.",
      actions: [
        `Waste contributes **${fmt(topKg)} CO₂/yr** — ${Math.round((topKg / totalKg) * 100)}% of your footprint.`,
        `**Quickest win:** Set up a compost bin for food scraps. Food in landfill generates methane — 80× more potent than CO₂ over 20 years.`,
        `**Recycling audit:** Check what can actually be recycled in your area. Many people unknowingly "wishcycle" items that contaminate entire loads.`,
        `**Reusables:** Switching to a reusable bag, bottle and coffee cup eliminates hundreds of single-use items per year.`,
      ],
      challenge: suggestChallenge("waste", ctx.completedChallengeIds),
    },
  };

  const advice = categoryAdvice[highestCategory] || categoryAdvice.food;
  const suggested = advice.challenge;

  return `As a **${personality}** with an Eco Score of **${ecoScore}/100**, here's where to focus:

## ${categoryEmoji(highestCategory)} ${advice.headline}

${advice.actions.join("\n\n")}

---

**Your second biggest opportunity:** ${categoryEmoji(top[1])} ${categoryLabel(top[1])} (${fmt(secondKg)}/yr) — don't ignore it, but start with ${categoryLabel(highestCategory)} first for maximum impact.

**Suggested challenge for today:**
> ${suggested.emoji} **${suggested.title}** — ${suggested.description}
> 💨 Saves ${suggested.co2Saved}kg CO₂ · ⚡ +${suggested.points} pts`;
}

function foodResponse(ctx) {
  const isFoodHeavy = ctx && categoryLabel(ctx.highestCategory) === "food";
  const personalNote = ctx
    ? `Your food habits contribute approximately **${fmt(ctx.categoryScores?.food || 0)} CO₂/yr** — that's ${ctx.categoryScores?.food ? Math.round((ctx.categoryScores.food / ctx.totalKg) * 100) : "~30"}% of your total footprint.`
    : "Food is typically responsible for 25–35% of most people's carbon footprint.";

  return `## 🍽️ Sustainable Food Guide

${personalNote}

**The biggest food lever: protein choices**
- 🥩 Beef: ~27 kg CO₂ per kg of food
- 🐔 Chicken: ~6 kg CO₂ per kg
- 🐟 Fish: ~3–6 kg CO₂ per kg
- 🫘 Lentils/legumes: ~0.9 kg CO₂ per kg
- 🥦 Vegetables: ~0.4 kg CO₂ per kg

**5 practical wins (no lifestyle overhaul needed):**

1. **Meat-free Mondays** → saves ~200 kg CO₂/yr alone
2. **Swap beef for chicken or fish** when you do eat meat → halves the impact
3. **Plan meals weekly** → studies show this cuts food waste by 30%
4. **Buy ugly/imperfect produce** → same nutrition, less waste, often cheaper
5. **Cook at home instead of delivery** → saves ~2.8 kg CO₂ per meal + packaging

**5 cheap plant-based meals to try:**
- 🫘 Lentil dahl with rice (~£1.20/serving)
- 🌮 Black bean tacos with avocado
- 🍲 Chickpea and spinach curry
- 🥚 Egg fried rice with frozen veg
- 🍜 Peanut noodles with tofu

${isFoodHeavy ? "\n**Since food is your biggest opportunity**, even 3 plant-based meals per week could reduce your footprint by 15–20%." : ""}`;
}

function transportResponse(ctx) {
  const isTopCat = ctx && ctx.highestCategory === "transport";
  const transportKg = ctx?.categoryScores?.transport || 0;
  const personalNote = ctx
    ? `Transport makes up **${fmt(transportKg)}/yr** of your footprint — ${Math.round((transportKg / ctx.totalKg) * 100)}% of your total.`
    : "Transport is typically 25–30% of a person's carbon footprint.";

  return `## 🚗 Sustainable Transport Guide

${personalNote}

**CO₂ per passenger per mile:**
- ✈️ Domestic flight: ~0.26 kg
- 🚗 Petrol car (alone): ~0.21 kg
- 🚌 Average bus: ~0.08 kg
- 🚆 Train: ~0.04 kg
- 🚲 Cycling/walking: 0 kg

**How to reduce without giving up your car:**

1. **Batch your errands** — combining 3 trips into 1 can cut your driving emissions by 60% for those journeys
2. **Carpool on commutes** — one passenger halves your per-person emission immediately
3. **Use the car-free test** — for any trip under 2 miles, walk or cycle. That alone can save 300–600 kg/yr
4. **Work from home 1 extra day/week** — can save 400–800 kg/yr depending on commute distance
5. **Service your car** — a well-maintained engine uses up to 10% less fuel

**If you're ready for bigger changes:**
- Switching to an EV on the UK grid: reduces car emissions by ~60–70%
- Going car-free and using transit: saves an average of **2,400 kg CO₂/yr**

${isTopCat ? "\n**Transport is your biggest opportunity** — even small changes here will move your Eco Score significantly." : ""}`;
}

function homeResponse(ctx) {
  const homeKg = ctx?.categoryScores?.home || 0;
  const isTopCat = ctx && ctx.highestCategory === "home";
  const personalNote = ctx
    ? `Your home energy use generates **${fmt(homeKg)} CO₂/yr** — ${Math.round((homeKg / ctx.totalKg) * 100)}% of your footprint.`
    : "Home energy use typically accounts for 20–30% of personal carbon footprints.";

  return `## ⚡ Home Energy Guide

${personalNote}

**Quick free wins (do today):**
- 🌡️ Lower thermostat 2°C → saves ~10% on heating bills + ~200 kg CO₂/yr
- 🧺 Wash clothes at 30°C instead of 60°C → saves 90% of laundry energy
- 🔌 Unplug standby devices → saves up to 10% of electricity use
- 💡 Switch to LED bulbs → 75–80% less energy per bulb

**Medium effort (this month):**
- ☀️ **Switch to a renewable energy tariff** — this is the single biggest home action. Many providers offer 100% renewable plans at the same price as standard. Eliminates ~1,500–2,500 kg CO₂/yr instantly.
- 🚿 Fit a low-flow shower head → saves water heating energy (often free from suppliers)
- 🥶 Use your freezer efficiently → a full freezer is more efficient than a half-empty one

**Bigger investments (when ready):**
- 🏠 Loft insulation: typical payback in 2–3 years, saves ~1,000 kg/yr
- 🔥 Heat pump: replaces gas boiler, reduces heating emissions by 60–70%
- ☀️ Solar panels: eliminates or reverses energy bill, ~1,500 kg CO₂/yr

${isTopCat ? "\n**Home energy is your biggest lever right now** — starting with a green tariff switch costs £0 and has an immediate impact." : ""}`;
}

function shoppingResponse(ctx) {
  const shoppingKg = ctx?.categoryScores?.shopping || 0;
  const isTopCat = ctx && ctx.highestCategory === "shopping";
  const personalNote = ctx
    ? `Shopping generates **${fmt(shoppingKg)} CO₂/yr** for you — ${Math.round((shoppingKg / ctx.totalKg) * 100)}% of your total footprint.`
    : "Shopping and consumption typically contributes 15–25% of a person's carbon footprint.";

  return `## 🛍️ Sustainable Shopping Guide

${personalNote}

**The hidden carbon in your stuff:**
- 👕 A cotton T-shirt: ~7 kg CO₂ to produce
- 👖 A pair of jeans: ~33 kg CO₂
- 📱 A smartphone: ~70 kg CO₂
- 💻 A laptop: ~300–400 kg CO₂
- 🛋️ A sofa: ~150 kg CO₂

**5 rules for a lower-impact wardrobe:**

1. **Secondhand first** — check Vinted, Depop, eBay, or local charity shops before buying new. Buying used reduces impact by up to 82%.
2. **Cost-per-wear thinking** — a £60 quality item worn 200× beats a £10 item worn 10×.
3. **The 24-hour rule** — pause 24 hours before any non-essential purchase. ~40% of impulse buys become "actually I don't need this."
4. **Repair it** — a cobbler, tailor, or YouTube tutorial can extend life by years.
5. **One-in-one-out** — when you buy something new, donate or sell something you no longer use.

**For electronics specifically:**
- Refurbished devices have 50–70% lower carbon footprint than new
- A phone lasting 4 years instead of 2 halves its annual impact

${isTopCat ? '\n**Shopping is your top opportunity** — adopting "secondhand first" as a habit alone could save 400–800 kg CO₂/yr.' : ""}`;
}

function wasteResponse(ctx) {
  const wasteKg = ctx?.categoryScores?.waste || 0;
  const personalNote = ctx
    ? `Waste contributes **${fmt(wasteKg)} CO₂/yr** to your footprint.`
    : "Waste and recycling habits contribute around 5–15% of personal footprints.";

  return `## ♻️ Waste & Recycling Guide

${personalNote}

**Why waste matters more than you think:**
Food in landfill decomposes without oxygen, producing **methane** — 80× more potent than CO₂ over 20 years. Getting food waste right is critical.

**The waste hierarchy (in order of impact):**
1. 🚫 **Refuse** — don't take it in the first place (bags, packaging, freebies)
2. ♻️ **Reduce** — buy less, use less
3. 🔄 **Reuse** — repair, donate, refill
4. ♻️ **Recycle** — only after the above
5. 🗑️ **Landfill** — last resort

**Practical steps for this week:**
- 🧺 **Food waste first** — use a dedicated food scrap bin and either compost or use council food waste collection
- 📋 **Meal plan** — planning meals reduces food waste by 25–30%
- 🔍 **Recycling audit** — check your local council's website for what's actually recyclable. "Wishcycling" contaminates loads
- 🛍️ **Reusable kit** — bag, water bottle, coffee cup. Takes 15 uses to offset manufacturing — after that it's pure savings
- 🛒 **Loose produce** — buying fruit and veg without packaging at markets avoids plastic entirely`;
}

function sevenDayPlanResponse(ctx) {
  if (!ctx) {
    return `Here's a **general 7-day eco starter plan** — take the quiz for a personalised version!

| Day | Focus | Challenge |
|-----|-------|-----------|
| Mon | 🍽️ Food | Go meat-free for the day |
| Tue | 🚗 Transport | Walk or cycle one journey |
| Wed | ⚡ Home | Wash clothes on cold, unplug standbys |
| Thu | 🛍️ Shopping | Spend nothing non-essential |
| Fri | ♻️ Waste | Audit your bins, improve recycling |
| Sat | 🍳 Food | Cook all meals at home, zero delivery |
| Sun | 🌿 Reflect | Review your week, pick one habit to keep |

**Estimated savings for completing the full week:** ~20–30 kg CO₂`;
  }

  const { highestCategory, personality, categoryScores, ecoScore } = ctx;
  const topCats = topCategories(categoryScores, 3);

  const planByCategory = {
    transport: [
      {
        day: "Monday",
        emoji: "🚲",
        focus: "Transport",
        task: "Walk, cycle, or take transit for every journey today — zero car trips",
      },
      {
        day: "Tuesday",
        emoji: "🍽️",
        focus: "Food",
        task: "Go fully meat-free — try a lentil curry or veggie stir-fry",
      },
      {
        day: "Wednesday",
        emoji: "🚌",
        focus: "Transport",
        task: "Use public transit for your commute or main journey",
      },
      {
        day: "Thursday",
        emoji: "🧺",
        focus: "Home",
        task: "Cold wash only, unplug all standbys before bed",
      },
      {
        day: "Friday",
        emoji: "🍳",
        focus: "Food",
        task: "Cook at home instead of ordering delivery",
      },
      {
        day: "Saturday",
        emoji: "🚗",
        focus: "Transport",
        task: "Carpool with someone if you need to drive — or stay car-free",
      },
      {
        day: "Sunday",
        emoji: "📋",
        focus: "Plan",
        task: "Plan next week's meals and travel to reduce last-minute car trips",
      },
    ],
    food: [
      {
        day: "Monday",
        emoji: "🌱",
        focus: "Food",
        task: "Fully plant-based day — no meat, no dairy",
      },
      {
        day: "Tuesday",
        emoji: "📋",
        focus: "Food",
        task: "Plan the whole week's meals to eliminate waste",
      },
      {
        day: "Wednesday",
        emoji: "🚲",
        focus: "Transport",
        task: "Active commute or public transit day",
      },
      {
        day: "Thursday",
        emoji: "🥕",
        focus: "Food",
        task: "Buy local/seasonal produce only — skip the supermarket",
      },
      {
        day: "Friday",
        emoji: "🍳",
        focus: "Food",
        task: "Use up all leftovers — cook a zero-waste meal",
      },
      {
        day: "Saturday",
        emoji: "⚡",
        focus: "Home",
        task: "Research green energy tariff options (15 min), unplug standbys",
      },
      {
        day: "Sunday",
        emoji: "🍽️",
        focus: "Food",
        task: "One more plant-based day and reflect: what felt easiest?",
      },
    ],
    home: [
      {
        day: "Monday",
        emoji: "☀️",
        focus: "Home",
        task: "Research and compare renewable energy tariffs for 15 minutes",
      },
      {
        day: "Tuesday",
        emoji: "🌡️",
        focus: "Home",
        task: "Lower thermostat by 2°C — wear a sweater instead",
      },
      {
        day: "Wednesday",
        emoji: "🧺",
        focus: "Home",
        task: "Cold wash all laundry, air dry if possible",
      },
      {
        day: "Thursday",
        emoji: "🍽️",
        focus: "Food",
        task: "Meat-free day — the combination of home + food changes is powerful",
      },
      {
        day: "Friday",
        emoji: "🔌",
        focus: "Home",
        task: "Audit all standby devices — unplug everything not in use",
      },
      {
        day: "Saturday",
        emoji: "🚿",
        focus: "Home",
        task: "5-minute showers only, and switch off lights when leaving rooms",
      },
      {
        day: "Sunday",
        emoji: "📊",
        focus: "Review",
        task: "Check your energy app or meter — did usage drop? Plan next steps.",
      },
    ],
    shopping: [
      {
        day: "Monday",
        emoji: "🚫",
        focus: "Shopping",
        task: "Buy nothing non-essential — a full no-spend day",
      },
      {
        day: "Tuesday",
        emoji: "🍽️",
        focus: "Food",
        task: "Plant-based meals all day",
      },
      {
        day: "Wednesday",
        emoji: "🔧",
        focus: "Shopping",
        task: "Repair one item (clothes, gadget, furniture) instead of replacing it",
      },
      {
        day: "Thursday",
        emoji: "♻️",
        focus: "Shopping",
        task: "List 3 items you no longer need and donate or sell them",
      },
      {
        day: "Friday",
        emoji: "🛍️",
        focus: "Shopping",
        task: "Browse Vinted/Depop/charity shops before any clothing purchase",
      },
      {
        day: "Saturday",
        emoji: "🏠",
        focus: "Home",
        task: "Cold wash, unplug standbys, adjust thermostat",
      },
      {
        day: "Sunday",
        emoji: "📋",
        focus: "Plan",
        task: "Review your week: what was easier than expected? Keep one habit.",
      },
    ],
    waste: [
      {
        day: "Monday",
        emoji: "♻️",
        focus: "Waste",
        task: "Recycling audit — check every item before it goes in the bin",
      },
      {
        day: "Tuesday",
        emoji: "🍽️",
        focus: "Food",
        task: "Zero food waste day — use everything in the fridge",
      },
      {
        day: "Wednesday",
        emoji: "☕",
        focus: "Waste",
        task: "Reusables only — no single-use cups, bags, or bottles",
      },
      {
        day: "Thursday",
        emoji: "🌱",
        focus: "Food",
        task: "Set up a small compost bin or bag for food scraps",
      },
      {
        day: "Friday",
        emoji: "🚲",
        focus: "Transport",
        task: "Active or public transit commute day",
      },
      {
        day: "Saturday",
        emoji: "🚫",
        focus: "Shopping",
        task: "Buy-nothing day — practise saying no to impulse purchases",
      },
      {
        day: "Sunday",
        emoji: "📊",
        focus: "Review",
        task: "How much less waste did you produce? Celebrate your progress!",
      },
    ],
  };

  const plan = planByCategory[highestCategory] || planByCategory.food;
  const totalCo2 = (25 + Math.round(Math.random() * 10)).toFixed(1);

  let planText = `## 🗓️ Your Personalised 7-Day Plan\n\nAs a **${personality}** with Eco Score **${ecoScore}/100**, your plan targets **${categoryLabel(highestCategory)}** first — your biggest opportunity:\n\n`;

  plan.forEach((day, i) => {
    planText += `**${day.day}** ${day.emoji} — *${day.focus}*\n${day.task}\n\n`;
  });

  planText += `---\n**Complete this full week** and you'll save approximately **~${totalCo2} kg CO₂** while building habits that could last a lifetime.\n\nHead to the **Challenges** page to track each one! 🏆`;

  return planText;
}

function explainFootprintResponse(ctx) {
  if (!ctx) {
    return `## 🌍 Understanding Carbon Footprints

A **carbon footprint** is the total greenhouse gas emissions caused by your lifestyle choices — measured in **kg or tons of CO₂ equivalent** per year.

**Key benchmarks:**
- 🌍 Global average: **7 tons CO₂/yr**
- 🇺🇸 US average: **14 tons CO₂/yr**
- 🇬🇧 UK average: **8 tons CO₂/yr**
- 🎯 Climate target (1.5°C pathway): **2.5 tons CO₂/yr by 2030**

**Your Eco Score (0–100):**
- 80–100 = Excellent — well below global average
- 60–79 = Good — below average, keep improving
- 40–59 = Average — around the global mean
- 20–39 = High — above average, significant opportunities
- 0–19 = Very high — immediate action needed

Take the quiz to see where *you* actually stand!`;
  }

  const { totalKg, ecoScore, personality, categoryScores, highestCategory } =
    ctx;
  const globalAvg = 7000;
  const diff = totalKg - globalAvg;
  const aboveBelow = diff > 0 ? "above" : "below";
  const diffPct = pct(totalKg, globalAvg);

  const topTwo = topCategories(categoryScores, 2);
  const topTwoKg = topTwo.map(
    (c) => `${categoryEmoji(c)} ${categoryLabel(c)}: ${fmt(categoryScores[c])}`,
  );

  return `## 📊 Understanding Your Carbon Footprint

You're a **${personality}** with an annual footprint of **${fmt(totalKg)} CO₂** and an Eco Score of **${ecoScore}/100**.

**How you compare:**
- Your footprint is **${diffPct}% ${aboveBelow}** the global average (7 tons/yr)
- ${ecoScore >= 65 ? "✅ You're doing well — in the top tier of sustainable lifestyles globally." : ecoScore >= 45 ? "📊 You're roughly average — meaningful improvements are within reach." : "⚠️ Your footprint is higher than the global mean — but this platform will help."}

**Where your ${fmt(totalKg)} comes from:**
${topTwoKg.join("\n")}
${Object.entries(categoryScores)
  .slice(2)
  .map(([c, kg]) => `${categoryEmoji(c)} ${categoryLabel(c)}: ${fmt(kg)}`)
  .join("\n")}

**What the Eco Score (${ecoScore}) means:**
The score runs from 0 (very high impact) to 100 (near-zero impact). It's calibrated so that 50 = global average (7 tons/yr). Every challenge you complete nudges your score upward.

**Your path to improvement:**
Focusing on **${categoryLabel(highestCategory)}** alone — your biggest category — could reduce your total by **15–25%** with practical daily habits.`;
}

function motivationResponse(ctx) {
  const responses = [
    {
      headline: "Your actions genuinely matter — here's the science.",
      body: ctx
        ? `First: you've already completed **${ctx.completedChallenges} challenge${ctx.completedChallenges !== 1 ? "s" : ""}** and saved **${ctx.totalCo2Saved.toFixed(1)} kg CO₂**. That's real.

**Why individual action still matters:**
- Consumer choices drive **60–70% of global emissions** through supply and demand signals
- Social influence is powerful — one sustainable person influences an average of **3 others** in their network
- Political pressure: individuals who act sustainably are more likely to vote for climate policy and advocate at work

**If you feel overwhelmed:**
Focus on just **one habit** at a time. You don't need to do everything. Picking the single highest-impact change and doing it consistently beats 10 half-hearted attempts.

**Progress, not perfection.** You're already ahead of the majority of people simply by being here and trying.`
        : `Feeling stuck is completely normal — and it doesn't mean you've failed.

**A few reframes that actually help:**

1. **You don't need to be perfect.** Consistently doing 70% is far better than burning out trying to do 100%.
2. **Collective action starts with individuals.** Social influence research shows that one sustainable person changes the behaviour of 3–5 people around them over time.
3. **Focus on identity, not outcomes.** Instead of "I'm trying to eat less meat," try "I'm someone who cares about what's on my plate." Small identity shifts lead to lasting change.
4. **Celebrate micro-wins.** Every plant-based meal, every trip cycled instead of driven — it adds up to tons saved over years.

You're doing better than you think. Keep going. 🌱`,
    },
  ];

  const r = responses[0];
  return `## 💪 ${r.headline}\n\n${r.body}`;
}

function comparisonResponse(ctx) {
  if (!ctx) {
    return `## 🌍 How You Compare — Global Context

**Average annual carbon footprints:**
- 🌍 Global average: **7 tons CO₂/yr**
- 🇺🇸 USA: **14.4 tons/yr**
- 🇦🇺 Australia: **14.8 tons/yr**
- 🇬🇧 UK: **8.0 tons/yr**
- 🇩🇪 Germany: **9.4 tons/yr**
- 🇫🇷 France: **6.4 tons/yr**
- 🌏 India: **2.0 tons/yr**
- 🎯 1.5°C target: **2.5 tons by 2030**

Take the quiz to see how *your* footprint stacks up!`;
  }

  const { totalKg, ecoScore, personality } = ctx;
  const vs = [
    { label: "🌍 Global average", kg: 7000 },
    { label: "🇺🇸 US average", kg: 14000 },
    { label: "🇬🇧 UK average", kg: 8000 },
    { label: "🎯 1.5°C target (2030)", kg: 2500 },
  ];

  const rows = vs
    .map((v) => {
      const diff = totalKg - v.kg;
      const sign = diff > 0 ? "+" : "";
      const symbol = diff > 0 ? "▲" : "▼";
      return `- ${v.label}: **${sign}${fmt(Math.abs(diff))} ${symbol}** vs. your ${fmt(totalKg)}`;
    })
    .join("\n");

  return `## 🌍 How You Compare

As a **${personality}** with **${fmt(totalKg)}/yr** (Eco Score **${ecoScore}/100**):

${rows}

${
  totalKg < 7000
    ? `✅ **Great news** — you're below the global average. You're already in the top tier globally.`
    : totalKg < 10000
      ? `📊 You're above the global average but below many Western countries. Focused effort will push you below the global mean.`
      : `⚠️ Your footprint is high compared to global averages, but this platform is here to help you close that gap efficiently.`
}

**The real target:** The IPCC says we need to get to **2.5 tons/yr per person by 2030** to limit warming to 1.5°C. That's ambitious — but every reduction is a step in the right direction.`;
}

function budgetResponse(ctx) {
  return `## 💸 Eco on a Budget

Good news: **the most impactful changes are often free or cheaper**, not more expensive.

**Free changes with real impact:**
- 🌡️ Thermostat down 2°C → saves ~£150/yr on bills + ~200 kg CO₂
- 🧺 Cold wash laundry → saves ~£60/yr
- 🔌 Unplug standbys → saves ~£30–50/yr
- 🚶 Walk/cycle short trips → saves fuel + gym costs
- 📋 Meal plan weekly → saves ~£30–50/yr on wasted food

**Food: eating green is often cheaper**
- 🫘 Lentils/beans: ~£0.80–1.20/kg vs. beef at £7–12/kg
- 🥕 Seasonal veg is always the cheapest produce
- 🌱 A plant-based meal is typically 40–60% cheaper than a meat equivalent

**Shopping savings:**
- ♻️ Secondhand is almost always cheaper than new (often 70–90% less)
- 🔧 Repairing > replacing (a cobbler costs £10–20, new shoes £60+)

**One-time investments that pay back quickly:**
- 💡 LED bulbs: ~£2 each, pays back in months
- 🛍️ Reusable bag + bottle: £5–15, infinite uses

${ctx ? `\nGiven your Eco Score of **${ctx.ecoScore}/100**, the free changes above could realistically improve your score by **5–10 points** alone.` : ""}`;
}

function challengeSuggestionResponse(ctx) {
  if (!ctx) {
    const defaultC = randomFrom(
      challenges.filter((c) => c.difficulty === "easy"),
    );
    return `## ⚡ Challenge Suggestion

Here's a great one to try today:

**${defaultC.emoji} ${defaultC.title}**
${defaultC.description}

- 💨 Saves ${defaultC.co2Saved} kg CO₂
- ⚡ +${defaultC.points} points
- ⏱ ${defaultC.timeRequired}
- 💡 ${defaultC.tip}

Take the quiz first for challenges matched to *your* highest-impact areas!`;
  }

  const { highestCategory, completedChallengeIds, streak } = ctx;
  const suggested = suggestChallenge(highestCategory, completedChallengeIds);
  const easy = challenges.filter(
    (c) =>
      c.difficulty === "easy" &&
      c.category !== highestCategory &&
      !completedChallengeIds.includes(c.id),
  );
  const bonus = easy.length > 0 ? randomFrom(easy) : null;

  return `## ⚡ Today's Personalised Challenge

Based on your profile (biggest opportunity: **${categoryLabel(highestCategory)}**):

**${suggested.emoji} ${suggested.title}**
${suggested.description}

- 💨 Saves **${suggested.co2Saved} kg CO₂**
- ⚡ +${suggested.points} points
- ⏱ ${suggested.timeRequired}
- 💡 *${suggested.tip}*
- 🌍 ${suggested.impact}

${streak > 0 ? `You're on a **${streak}-day streak** 🔥 — don't break it!` : "Complete this to start your streak! 🔥"}

${bonus ? `\n**Bonus easy win:** ${bonus.emoji} **${bonus.title}** — ${bonus.description} (+${bonus.points} pts)` : ""}

Head to the **Challenges page** to mark it done and earn your points!`;
}

function progressResponse(ctx) {
  if (!ctx || (ctx.completedChallenges === 0 && ctx.totalCo2Saved === 0)) {
    return `## 📊 Your Progress

It looks like you haven't completed any challenges yet — that's the perfect time to start!

Head to the **Challenges page** and pick your first one. Even the easiest challenge saves 0.3–5 kg CO₂ and earns you points toward your next level.

Your **Eco Score**, streak, and total CO₂ saved will all appear here once you start. 🌱`;
  }

  const { completedChallenges, totalCo2Saved, streak, totalPoints, ecoScore } =
    ctx;
  const trees = (totalCo2Saved / 21).toFixed(1);
  const miles = Math.round(totalCo2Saved * 4.2);

  return `## 📊 Your Progress So Far

Here's what you've achieved:

- ✅ **${completedChallenges} challenge${completedChallenges !== 1 ? "s" : ""} completed**
- 💨 **${totalCo2Saved.toFixed(1)} kg CO₂ saved** — equivalent to not driving ${miles} miles, or ${trees} trees absorbing for a year
- 🔥 **${streak}-day streak** — ${streak > 2 ? "excellent consistency!" : streak > 0 ? "good start, keep going!" : "complete a challenge today to start your streak"}
- ⚡ **${totalPoints} points** earned
- 🌿 **Eco Score: ${ecoScore}/100**

**What's next?**
${ecoScore < 50 ? 'Focus on your top category — see the "biggest opportunity" question for a targeted plan.' : ecoScore < 70 ? "You're making great progress. Consistent daily habits will push your score into the excellent range." : "Outstanding! You're in the top tier. Keep your streak alive and explore the hardest challenges."}

Every action compounds over time. At your current pace, you're on track to save meaningful CO₂ this year. 🏆`;
}

function fallbackResponse(ctx, userText) {
  const keywords = userText.toLowerCase();

  if (keywords.includes("thank")) {
    return `You're very welcome! 🌿 That's what I'm here for. Keep up the great work — every choice matters. Ask me anything else whenever you need it!`;
  }

  if (keywords.includes("bye") || keywords.includes("goodbye")) {
    return `Take care! 🌱 Remember: small, consistent actions add up to big change. Come back anytime — I'm always here to help. Keep your streak alive! 🔥`;
  }

  const fallbacks = [
    `That's a great question, though it's a little outside my current rule-set. Here's what I *can* help you with:\n\n- 🎯 Your biggest carbon opportunity\n- 🍽️ Food and diet guidance\n- 🚗 Transport tips\n- ⚡ Home energy savings\n- 🛍️ Sustainable shopping\n- ♻️ Waste reduction\n- 🗓️ A personalised 7-day action plan\n- 💪 Motivation and mindset\n\nWhat would you like to explore?`,
    `I might not have an answer for that specific question, but I can help you figure out **the highest-impact thing you can do right now** based on your profile. Want me to do that?`,
    `Good question! I'm most useful when it comes to practical sustainability topics. Try asking me about your **biggest opportunity**, a **7-day plan**, or guidance on **food, transport, home energy, or shopping**.`,
  ];

  return randomFrom(fallbacks);
}

// ─── Main engine entry point ──────────────────────────────────────────────────

/**
 * @param {string} userMessage - The user's input text
 * @param {object|null} storageData - Result of getStorageData()
 * @param {string[]} conversationIntents - Intents already used in this session
 * @returns {{ response: string, intent: string }}
 */
export function generateResponse(
  userMessage,
  storageData,
  conversationIntents = [],
) {
  const intent = detectIntent(userMessage);

  // Build context from storage data
  let ctx = null;
  if (storageData?.footprint) {
    const {
      footprint,
      completedChallenges = [],
      streak = {},
      totalCo2Saved = 0,
      totalPoints = 0,
    } = storageData;
    ctx = {
      personality: footprint.personality?.name || "Climate Starter",
      ecoScore: footprint.ecoScore || 0,
      highestCategory: footprint.highestCategory || "food",
      categoryScores: footprint.categoryScores || {},
      totalKg: footprint.totalKg || 0,
      completedChallenges: completedChallenges.length,
      completedChallengeIds: completedChallenges.map((c) => c.id),
      totalCo2Saved,
      totalPoints,
      streak: streak.count || 0,
    };
  }

  let response;
  switch (intent) {
    case "greeting":
      response = greetingResponse(ctx);
      break;
    case "biggest_opportunity":
      response = biggestOpportunityResponse(ctx);
      break;
    case "food":
      response = foodResponse(ctx);
      break;
    case "transport":
      response = transportResponse(ctx);
      break;
    case "home":
      response = homeResponse(ctx);
      break;
    case "shopping":
      response = shoppingResponse(ctx);
      break;
    case "waste":
      response = wasteResponse(ctx);
      break;
    case "seven_day_plan":
      response = sevenDayPlanResponse(ctx);
      break;
    case "explain_footprint":
      response = explainFootprintResponse(ctx);
      break;
    case "motivation":
      response = motivationResponse(ctx);
      break;
    case "comparison":
      response = comparisonResponse(ctx);
      break;
    case "budget":
      response = budgetResponse(ctx);
      break;
    case "challenge_suggestion":
      response = challengeSuggestionResponse(ctx);
      break;
    case "progress":
      response = progressResponse(ctx);
      break;
    default:
      response = fallbackResponse(ctx, userMessage);
  }

  return { response, intent };
}

/**
 * Simulates a natural typing delay based on response length
 */
export function getThinkingDelay(response) {
  const words = response.split(" ").length;
  // 30ms per word, min 600ms, max 1800ms
  return Math.min(1800, Math.max(600, words * 30));
}
