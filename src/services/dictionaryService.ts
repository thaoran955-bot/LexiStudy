import type {
  CurrentDictionaryContext,
  Dictionary,
  DictionaryImporter,
  Word,
} from "../types/dictionary";
import type { VocabularyEntry } from "../types/vocabulary";

export const BUNDLED_DICTIONARY_ID = "builtin.vocabulary-final";
const bundledDictionaryCreatedAt = "2026-08-04T00:00:00.000Z";

export function createBundledDictionary(
  entries: readonly VocabularyEntry[],
  createdAt = bundledDictionaryCreatedAt,
): Dictionary {
  return {
    id: BUNDLED_DICTIONARY_ID,
    name: "六级高频词汇",
    source: "bundled",
    createdAt,
    wordCount: entries.length,
  };
}

export function normalizeBundledWords(entries: readonly VocabularyEntry[]): readonly Word[] {
  return Object.freeze(
    entries.map((entry, position) =>
      Object.freeze({
        id: entry.id,
        dictionaryId: BUNDLED_DICTIONARY_ID,
        word: entry.word,
        meaning: entry.meaning,
        position,
      }),
    ),
  );
}

export function loadDictionaries(): Promise<readonly Dictionary[]> {
  return window.dictionaryData.list() as Promise<readonly Dictionary[]>;
}

export function loadCurrentDictionary(): Promise<CurrentDictionaryContext> {
  return window.dictionaryData.loadCurrent() as Promise<CurrentDictionaryContext>;
}

export function selectDictionary(dictionaryId: string): Promise<CurrentDictionaryContext> {
  return window.dictionaryData.select(dictionaryId) as Promise<CurrentDictionaryContext>;
}

export function importDictionary(name: string, jsonText: string): Promise<Dictionary> {
  return window.dictionaryData.importJson(name, jsonText) as Promise<Dictionary>;
}

export function importDictionaryFromFile(name?: string): Promise<Dictionary | null> {
  return window.dictionaryData.importFile(name) as Promise<Dictionary | null>;
}

export function createReservedDictionaryImporter(): DictionaryImporter {
  return {
    async importJson() {
      throw new Error("词库导入功能尚未实现");
    },
  };
}
