export const MIN_MASTERY_LEVEL = 0;
export const MAX_MASTERY_LEVEL = 5;
const INCORRECT_REVIEW_DELAY_MS = 15_000;

export interface WordLearningState {
  readonly studyCount: number;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly masteryLevel: number;
  readonly consecutiveCorrect: number;
  readonly nextReviewAt: string | null;
  readonly lastAnsweredAt: string | null;
}

export function createInitialLearningState(): WordLearningState {
  return {
    studyCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    masteryLevel: MIN_MASTERY_LEVEL,
    consecutiveCorrect: 0,
    nextReviewAt: null,
    lastAnsweredAt: null,
  };
}

export function applyLearningAnswer(
  current: WordLearningState,
  recognized: boolean,
  answeredAt: string,
): WordLearningState {
  const answeredAtTimestamp = Date.parse(answeredAt);
  if (Number.isNaN(answeredAtTimestamp)) throw new Error("答题时间格式无效");

  const masteryLevel = recognized
    ? Math.min(current.masteryLevel + 1, MAX_MASTERY_LEVEL)
    : Math.max(current.masteryLevel - 1, MIN_MASTERY_LEVEL);
  const reviewDelay = recognized ? getCorrectReviewDelay(masteryLevel) : INCORRECT_REVIEW_DELAY_MS;

  return {
    studyCount: current.studyCount + 1,
    correctCount: current.correctCount + (recognized ? 1 : 0),
    incorrectCount: current.incorrectCount + (recognized ? 0 : 1),
    masteryLevel,
    consecutiveCorrect: recognized ? current.consecutiveCorrect + 1 : 0,
    nextReviewAt: new Date(answeredAtTimestamp + reviewDelay).toISOString(),
    lastAnsweredAt: answeredAt,
  };
}

export function isReviewDue(state: WordLearningState, now: string): boolean {
  if (state.masteryLevel > 2 || !state.nextReviewAt) return false;
  return Date.parse(state.nextReviewAt) <= Date.parse(now);
}

function getCorrectReviewDelay(masteryLevel: number): number {
  if (masteryLevel <= 2) return 2 * 60 * 1000;
  if (masteryLevel === 3) return 10 * 60 * 1000;
  if (masteryLevel === 4) return 30 * 60 * 1000;
  return 2 * 60 * 60 * 1000;
}
