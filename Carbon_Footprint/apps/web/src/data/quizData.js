export const quizQuestions = [
  {
    id: "commute",
    category: "transport",
    question: "How do you usually get around day-to-day?",
    emoji: "🚗",
    color: "#3b82f6",
    options: [
      {
        label: "Walk or cycle",
        value: "walk",
        co2: 0,
        emoji: "🚲",
        sublabel: "0 kg CO₂/yr",
      },
      {
        label: "Public transit",
        value: "transit",
        co2: 600,
        emoji: "🚌",
        sublabel: "~600 kg/yr",
      },
      {
        label: "Electric / hybrid car",
        value: "hybrid",
        co2: 1200,
        emoji: "⚡",
        sublabel: "~1,200 kg/yr",
      },
      {
        label: "Petrol / diesel car",
        value: "gas",
        co2: 3000,
        emoji: "🚗",
        sublabel: "~3,000 kg/yr",
      },
      {
        label: "Large SUV or truck",
        value: "suv",
        co2: 4500,
        emoji: "🛻",
        sublabel: "~4,500 kg/yr",
      },
    ],
  },
  {
    id: "flights",
    category: "transport",
    question: "How many flights do you take per year?",
    emoji: "✈️",
    color: "#06b6d4",
    options: [
      {
        label: "None",
        value: "0",
        co2: 0,
        emoji: "🏠",
        sublabel: "0 kg CO₂/yr",
      },
      {
        label: "1–2 short flights",
        value: "1-2",
        co2: 700,
        emoji: "🗺️",
        sublabel: "~700 kg/yr",
      },
      {
        label: "3–5 flights",
        value: "3-5",
        co2: 2000,
        emoji: "✈️",
        sublabel: "~2,000 kg/yr",
      },
      {
        label: "6+ or long haul",
        value: "6+",
        co2: 4000,
        emoji: "🌍",
        sublabel: "~4,000 kg/yr",
      },
    ],
  },
  {
    id: "diet",
    category: "food",
    question: "How would you describe your diet?",
    emoji: "🍽️",
    color: "#f97316",
    options: [
      {
        label: "Vegan",
        value: "vegan",
        co2: 500,
        emoji: "🌱",
        sublabel: "~500 kg/yr",
      },
      {
        label: "Vegetarian",
        value: "vegetarian",
        co2: 1000,
        emoji: "🥗",
        sublabel: "~1,000 kg/yr",
      },
      {
        label: "Mostly plant-based",
        value: "flexitarian",
        co2: 1600,
        emoji: "🌿",
        sublabel: "~1,600 kg/yr",
      },
      {
        label: "Regular meat eater",
        value: "omnivore",
        co2: 2500,
        emoji: "🥩",
        sublabel: "~2,500 kg/yr",
      },
      {
        label: "Heavy meat / daily beef",
        value: "heavy_meat",
        co2: 3500,
        emoji: "🍔",
        sublabel: "~3,500 kg/yr",
      },
    ],
  },
  {
    id: "food_waste",
    category: "food",
    question: "How much food do you typically waste?",
    emoji: "🗑️",
    color: "#eab308",
    options: [
      {
        label: "Almost none — I plan meals",
        value: "none",
        co2: 100,
        emoji: "📋",
        sublabel: "~100 kg/yr",
      },
      {
        label: "A little, occasionally",
        value: "little",
        co2: 300,
        emoji: "😊",
        sublabel: "~300 kg/yr",
      },
      {
        label: "About average",
        value: "average",
        co2: 500,
        emoji: "🤷",
        sublabel: "~500 kg/yr",
      },
      {
        label: "Quite a bit",
        value: "lots",
        co2: 800,
        emoji: "😬",
        sublabel: "~800 kg/yr",
      },
    ],
  },
  {
    id: "energy",
    category: "home",
    question: "What powers your home?",
    emoji: "⚡",
    color: "#a855f7",
    options: [
      {
        label: "100% renewable / solar",
        value: "renewable",
        co2: 200,
        emoji: "☀️",
        sublabel: "~200 kg/yr",
      },
      {
        label: "Mixed / green energy plan",
        value: "mixed",
        co2: 1000,
        emoji: "🌤️",
        sublabel: "~1,000 kg/yr",
      },
      {
        label: "Standard grid electricity",
        value: "standard",
        co2: 2000,
        emoji: "🏭",
        sublabel: "~2,000 kg/yr",
      },
      {
        label: "Gas heating + standard grid",
        value: "gas_home",
        co2: 3200,
        emoji: "🔥",
        sublabel: "~3,200 kg/yr",
      },
    ],
  },
  {
    id: "home_size",
    category: "home",
    question: "How would you describe your living situation?",
    emoji: "🏠",
    color: "#14b8a6",
    options: [
      {
        label: "Small apartment, shared",
        value: "small_shared",
        co2: 200,
        emoji: "🏢",
        sublabel: "~200 kg/yr",
      },
      {
        label: "Small apartment, alone",
        value: "small_alone",
        co2: 500,
        emoji: "🏠",
        sublabel: "~500 kg/yr",
      },
      {
        label: "Medium house",
        value: "medium",
        co2: 800,
        emoji: "🏡",
        sublabel: "~800 kg/yr",
      },
      {
        label: "Large house",
        value: "large",
        co2: 1500,
        emoji: "🏰",
        sublabel: "~1,500 kg/yr",
      },
    ],
  },
  {
    id: "shopping",
    category: "shopping",
    question: "How often do you buy new clothes, gadgets, or goods?",
    emoji: "🛍️",
    color: "#ec4899",
    options: [
      {
        label: "Rarely — I buy secondhand",
        value: "minimal",
        co2: 300,
        emoji: "♻️",
        sublabel: "~300 kg/yr",
      },
      {
        label: "A few times a year",
        value: "conscious",
        co2: 700,
        emoji: "🎯",
        sublabel: "~700 kg/yr",
      },
      {
        label: "Monthly, fairly average",
        value: "average",
        co2: 1200,
        emoji: "🛒",
        sublabel: "~1,200 kg/yr",
      },
      {
        label: "Frequently, I love shopping",
        value: "frequent",
        co2: 2000,
        emoji: "🛍️",
        sublabel: "~2,000 kg/yr",
      },
      {
        label: "Very often, always buying new",
        value: "heavy",
        co2: 3000,
        emoji: "💳",
        sublabel: "~3,000 kg/yr",
      },
    ],
  },
  {
    id: "recycling",
    category: "waste",
    question: "How would you describe your waste and recycling habits?",
    emoji: "♻️",
    color: "#22c55e",
    options: [
      {
        label: "I compost and recycle everything",
        value: "excellent",
        co2: 100,
        emoji: "🌱",
        sublabel: "~100 kg/yr",
      },
      {
        label: "I recycle most things",
        value: "good",
        co2: 300,
        emoji: "♻️",
        sublabel: "~300 kg/yr",
      },
      {
        label: "I recycle sometimes",
        value: "average",
        co2: 600,
        emoji: "🤔",
        sublabel: "~600 kg/yr",
      },
      {
        label: "Rarely recycle",
        value: "poor",
        co2: 900,
        emoji: "😔",
        sublabel: "~900 kg/yr",
      },
    ],
  },
];

export const carbonPersonalities = {
  champion: {
    id: "champion",
    name: "Climate Champion",
    emoji: "🏆",
    tagline: "Setting the gold standard",
    description:
      "You're in the top tier of sustainable living. Your footprint is well below the global average, and your daily habits are genuinely making a difference.",
    color: "#22c55e",
    border: "#16a34a",
  },
  conscious: {
    id: "conscious",
    name: "Conscious Consumer",
    emoji: "🌿",
    tagline: "Making smart choices daily",
    description:
      "You're making genuinely good choices across the board. A few focused changes in your top impact areas could make you a Climate Champion.",
    color: "#34d399",
    border: "#059669",
  },
  commuter: {
    id: "commuter",
    name: "Road Warrior",
    emoji: "🚗",
    tagline: "Transport is your key opportunity",
    description:
      "You're aware and improving, but transport is taking a big bite out of your carbon budget. Swapping even a few car trips a week could make a significant difference.",
    color: "#60a5fa",
    border: "#2563eb",
  },
  foodie: {
    id: "foodie",
    name: "Food Footprint Fixer",
    emoji: "🍽️",
    tagline: "Your plate holds the power",
    description:
      "Your diet is your biggest opportunity. Shifting toward more plant-forward meals just a few days a week could cut your footprint by 20–30%.",
    color: "#fb923c",
    border: "#ea580c",
  },
  energy_user: {
    id: "energy_user",
    name: "Energy Optimizer",
    emoji: "⚡",
    tagline: "Home energy is your frontier",
    description:
      "Your home's energy use is your biggest opportunity. Switching to a renewable energy plan or improving insulation could be transformative for your score.",
    color: "#facc15",
    border: "#ca8a04",
  },
  shopper: {
    id: "shopper",
    name: "Mindful Shopper",
    emoji: "🛍️",
    tagline: "Conscious choices change everything",
    description:
      "Your shopping patterns are making a significant dent. Choosing secondhand, repairing items, and buying less can save hundreds of kg CO₂ each year.",
    color: "#c084fc",
    border: "#9333ea",
  },
  starter: {
    id: "starter",
    name: "Climate Starter",
    emoji: "🌱",
    tagline: "Every journey starts somewhere",
    description:
      "You're at the beginning of your sustainability journey — and that's a great place to be. This platform will help you find the easiest, highest-impact wins first.",
    color: "#94a3b8",
    border: "#64748b",
  },
};

export const categoryConfig = {
  transport: {
    label: "Transport",
    emoji: "🚗",
    color: "#3b82f6",
    lightColor: "#93c5fd",
  },
  food: { label: "Food", emoji: "🍽️", color: "#f97316", lightColor: "#fdba74" },
  home: { label: "Home", emoji: "🏠", color: "#a855f7", lightColor: "#d8b4fe" },
  shopping: {
    label: "Shopping",
    emoji: "🛍️",
    color: "#ec4899",
    lightColor: "#f9a8d4",
  },
  waste: {
    label: "Waste",
    emoji: "♻️",
    color: "#22c55e",
    lightColor: "#86efac",
  },
};

export function calculateFootprint(answers) {
  const categoryScores = {
    transport: 0,
    food: 0,
    home: 0,
    shopping: 0,
    waste: 0,
  };

  quizQuestions.forEach((q) => {
    const answer = answers[q.id];
    if (!answer) return;
    const option = q.options.find((o) => o.value === answer);
    if (option)
      categoryScores[q.category] =
        (categoryScores[q.category] || 0) + option.co2;
  });

  const totalKg = Object.values(categoryScores).reduce((a, b) => a + b, 0);
  // Score: 100 at 0 kg, 50 at global avg (7000 kg), 0 at 14000 kg
  const ecoScore = Math.max(0, Math.min(100, Math.round(100 - totalKg / 140)));

  const sorted = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
  const highestCategory = sorted[0][0];

  let personality;
  if (totalKg <= 3000) {
    personality = carbonPersonalities.champion;
  } else if (totalKg <= 5500) {
    personality = carbonPersonalities.conscious;
  } else {
    const map = {
      transport: carbonPersonalities.commuter,
      food: carbonPersonalities.foodie,
      home: carbonPersonalities.energy_user,
      shopping: carbonPersonalities.shopper,
      waste: carbonPersonalities.starter,
    };
    personality = map[highestCategory] || carbonPersonalities.starter;
  }

  return {
    totalKg,
    categoryScores,
    ecoScore,
    personality,
    highestCategory,
    sortedCategories: sorted,
    globalAverage: 7000,
    usAverage: 14000,
    answers,
  };
}

export function translateCo2(kg) {
  if (kg < 1) return `${Math.round(kg * 1000)}g CO₂`;
  if (kg < 1000) return `${kg.toFixed(1)} kg CO₂`;
  return `${(kg / 1000).toFixed(1)} tons CO₂`;
}
