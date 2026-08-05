export type DictionarySource = "bundled" | "imported";

import type { PersistedLearningState } from "./learning";
import type { VocabularyEntry } from "./vocabulary";

export interface Dictionary {
  readonly id: string;
  readonly name: string;
  readonly source: DictionarySource;
  readonly createdAt: string;
  readonly wordCount: number;
}

export interface Word {
  readonly id: number;
  readonly dictionaryId: string;
  readonly word: string;
  readonly meaning: string;
  readonly position: number;
}

export interface DictionaryLearningRecord {
  readonly dictionaryId: string;
  readonly wordId: number;
  readonly recognized: boolean;
  readonly answeredAt: string;
}

export interface CurrentDictionaryContext {
  readonly dictionary: Dictionary;
  readonly entries: readonly VocabularyEntry[];
  readonly learningState: PersistedLearningState;
}

export interface DictionaryImporter {
  importJson(filePath: string): Promise<Dictionary>;
}
