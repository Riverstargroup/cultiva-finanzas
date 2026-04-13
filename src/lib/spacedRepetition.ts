/**
 * SM-2 Spaced Repetition Algorithm (simplified)
 */

export interface SM2State {
  repetitions: number;
  interval_days: number;
  ease_factor: number;
}

export interface SM2Result extends SM2State {
  next_due_at: string; // ISO timestamp
  last_quality: number;
  last_score: number;
}

/**
 * Calculate score from scenario performance.
 * @param choseBest - did user choose the best option?
 * @param recallCorrect - number of correct recall answers
 * @param recallTotal - total recall questions
 * @returns score 0..1
 */
export function calculateScore(
  choseBest: boolean,
  recallCorrect: number,
  recallTotal: number
): number {
  const optionScore = choseBest ? 0.5 : 0;
  const recallScore = recallTotal > 0 ? (recallCorrect / recallTotal) * 0.5 : 0;
  return optionScore + recallScore;
}

/**
 * Run SM-2 algorithm given a quality score.
 */
export function calculateSM2(
  score: number,
  current: SM2State
): SM2Result {
  const quality = Math.round(score * 5); // 0..5
  let { repetitions, interval_days, ease_factor } = current;

  if (quality < 3) {
    repetitions = 0;
    interval_days = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval_days = 1;
    } else if (repetitions === 2) {
      interval_days = 3;
    } else {
      interval_days = Math.round(interval_days * ease_factor);
    }
    ease_factor = Math.max(
      1.3,
      ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
  }

  const now = new Date();
  const next = new Date(now.getTime() + interval_days * 24 * 60 * 60 * 1000);

  return {
    repetitions,
    interval_days,
    ease_factor: Math.round(ease_factor * 100) / 100,
    next_due_at: next.toISOString(),
    last_quality: quality,
    last_score: Math.round(score * 100) / 100,
  };
}
