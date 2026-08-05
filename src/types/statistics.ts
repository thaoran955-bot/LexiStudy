export interface MasteryDistribution {
  readonly level: number;
  readonly count: number;
}

export interface ErrorRanking {
  readonly dictionaryId: string;
  readonly wordId: number;
  readonly word: string;
  readonly meaning: string;
  readonly incorrectCount: number;
  readonly studyCount: number;
  readonly masteryLevel: number;
}

export interface LearningStatistics {
  readonly totalWords: number;
  readonly unlearnedWords: number;
  readonly learningWords: number;
  readonly masteredWords: number;
  readonly todayTarget: 35 | 50;
  readonly todayAnswered: number;
  readonly todayCompleted: number;
  readonly todayProgress: number;
  readonly totalStudyCount: number;
  readonly correctRate: number;
  readonly masteryDistribution: readonly MasteryDistribution[];
  readonly topErrors: readonly ErrorRanking[];
}
