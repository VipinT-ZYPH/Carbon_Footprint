const STORAGE_KEY = "carbon_footprint_app_v1";

const defaultData = {
  quizAnswers: null,
  footprint: null,
  completedChallenges: [],
  streak: { count: 0, lastCompletedDate: null },
  totalCo2Saved: 0,
  totalPoints: 0,
  quizCompletedAt: null,
  dailyChallengeId: null,
  dailyChallengeDate: null,
  ecoScoreHistory: [],
};

export function getStorageData() {
  if (typeof window === "undefined") return { ...defaultData };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return { ...defaultData };
  }
}

export function saveStorageData(partial) {
  if (typeof window === "undefined") return;
  try {
    const current = getStorageData();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...current, ...partial }),
    );
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}

export function saveQuizResults(quizAnswers, footprint) {
  const now = new Date().toISOString();
  const current = getStorageData();
  const history = current.ecoScoreHistory || [];
  // Keep last 10 scores
  const updatedHistory = [
    ...history,
    { score: footprint.ecoScore, date: now },
  ].slice(-10);
  saveStorageData({
    quizAnswers,
    footprint,
    quizCompletedAt: now,
    ecoScoreHistory: updatedHistory,
  });
}

export function completeChallenge(challengeId, co2Saved, points) {
  const data = getStorageData();
  const alreadyDone = data.completedChallenges.some(
    (c) => c.id === challengeId,
  );
  if (alreadyDone) return { ...data, alreadyCompleted: true };

  const today = new Date().toDateString();
  const lastDate = data.streak?.lastCompletedDate;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let newStreakCount = data.streak?.count || 0;
  if (lastDate === today) {
    // Already completed today — don't change streak
  } else if (lastDate === yesterday) {
    newStreakCount += 1;
  } else {
    newStreakCount = 1;
  }

  const updated = {
    completedChallenges: [
      ...data.completedChallenges,
      {
        id: challengeId,
        completedAt: new Date().toISOString(),
        co2Saved,
        points,
      },
    ],
    streak: { count: newStreakCount, lastCompletedDate: today },
    totalCo2Saved: (data.totalCo2Saved || 0) + co2Saved,
    totalPoints: (data.totalPoints || 0) + points,
  };

  saveStorageData(updated);
  return { ...data, ...updated, alreadyCompleted: false };
}

export function getDailyChallenge(challenges) {
  if (!challenges || challenges.length === 0) return null;
  const data = getStorageData();
  const today = new Date().toDateString();

  // Return today's assigned challenge if already set
  if (data.dailyChallengeDate === today && data.dailyChallengeId) {
    const found = challenges.find((c) => c.id === data.dailyChallengeId);
    if (found) return found;
  }

  // Pick challenge based on highest category from footprint
  const priorityCategory = data.footprint?.highestCategory || null;

  let eligible = challenges.filter(
    (c) => !data.completedChallenges.some((cc) => cc.id === c.id),
  );
  if (eligible.length === 0) eligible = [...challenges];

  // Prefer challenges from highest-impact category
  const prioritized = priorityCategory
    ? eligible.filter((c) => c.category === priorityCategory)
    : [];

  const pool = prioritized.length > 0 ? prioritized : eligible;

  // Deterministic daily pick
  const dayIndex = Math.floor(Date.now() / 86400000);
  const daily = pool[dayIndex % pool.length];

  saveStorageData({ dailyChallengeId: daily.id, dailyChallengeDate: today });
  return daily;
}

export function getLevel(totalPoints) {
  if (totalPoints < 100)
    return { level: 1, name: "Seedling", emoji: "🌱", next: 100 };
  if (totalPoints < 300)
    return { level: 2, name: "Sprout", emoji: "🌿", next: 300 };
  if (totalPoints < 600)
    return { level: 3, name: "Sapling", emoji: "🌳", next: 600 };
  if (totalPoints < 1000)
    return { level: 4, name: "Eco Warrior", emoji: "⚡", next: 1000 };
  if (totalPoints < 2000)
    return { level: 5, name: "Green Guardian", emoji: "🛡️", next: 2000 };
  return { level: 6, name: "Climate Champion", emoji: "🏆", next: null };
}

export function clearAllData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
