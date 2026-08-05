import type { LearningStatistics } from "../types/statistics";

export function loadStatistics(): Promise<LearningStatistics> {
  return window.statistics.load() as Promise<LearningStatistics>;
}
