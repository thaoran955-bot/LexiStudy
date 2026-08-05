export interface LearningRecord {
  readonly dictionaryId?: string;
  readonly wordId: number;
  readonly recognized: boolean;
  readonly answeredAt: string;
}

export interface LearningProgress {
  readonly totalWords: number;
  readonly answeredWords: number;
  readonly recognizedWords: number;
  readonly unknownWords: number;
}

export interface PersistedWordStat {
  readonly dictionaryId: string;
  readonly wordId: number;
  readonly studyCount: number;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly masteryLevel: number;
  readonly consecutiveCorrect: number;
  readonly nextReviewAt: string | null;
  readonly lastAnsweredAt: string | null;
}

export interface PersistedLearningState {
  readonly currentDictionaryId: string;
  readonly dailyTarget: 35 | 50;
  readonly studyMode: "en-to-zh" | "zh-to-en";
  readonly sessionIndex: number;
  readonly progress: Omit<LearningProgress, "totalWords">;
  readonly wordStats: readonly PersistedWordStat[];
  readonly reviewWordIds: readonly number[];
}
