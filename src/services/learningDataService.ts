import type { LearningRecord, PersistedLearningState } from "../types/learning";
import type { DailyTarget, StudyMode } from "../types/study";

export function loadLearningState(): Promise<PersistedLearningState> {
  return window.learningData.loadState() as Promise<PersistedLearningState>;
}

export function saveDailyTarget(target: DailyTarget): Promise<PersistedLearningState> {
  return window.learningData.setDailyTarget(target) as Promise<PersistedLearningState>;
}

export function saveStudyMode(mode: StudyMode): Promise<PersistedLearningState> {
  return window.learningData.setStudyMode(mode) as Promise<PersistedLearningState>;
}

export function saveAnswer(
  record: LearningRecord,
  sessionIndex: number,
): Promise<PersistedLearningState> {
  return window.learningData.recordAnswer(createAnswerPayload(record, sessionIndex)) as Promise<PersistedLearningState>;
}

export function createAnswerPayload(record: LearningRecord, sessionIndex: number) {
  return { ...record, sessionIndex };
}
