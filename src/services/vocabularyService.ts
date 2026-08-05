import type { VocabularyEntry } from "../types/vocabulary";

function isVocabularyEntry(value: unknown): value is VocabularyEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    Number.isInteger(entry.id) &&
    typeof entry.word === "string" &&
    typeof entry.meaning === "string"
  );
}

export function validateVocabulary(value: unknown): readonly VocabularyEntry[] {
  if (!Array.isArray(value) || !value.every(isVocabularyEntry)) {
    throw new Error("词库格式无效");
  }

  return Object.freeze(
    value.map((entry) =>
      Object.freeze({
        id: entry.id,
        word: entry.word,
        meaning: entry.meaning,
      }),
    ),
  );
}

export async function loadVocabulary(): Promise<readonly VocabularyEntry[]> {
  const value = await window.vocabulary.load();
  return validateVocabulary(value);
}
