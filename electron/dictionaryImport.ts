export interface ImportedVocabularyEntry {
  readonly id: number;
  readonly word: string;
  readonly meaning: string;
}

export function parseImportedVocabularyJson(jsonText: string): readonly ImportedVocabularyEntry[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("导入词库 JSON 格式无效");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("导入词库必须是非空数组");
  }

  const ids = new Set<number>();
  const entries = parsed.map((value) => {
    if (!value || typeof value !== "object") {
      throw new Error("导入词库包含无效单词");
    }
    const candidate = value as Record<string, unknown>;
    const id = candidate.id;
    const word = candidate.word;
    const meaning = candidate.meaning;
    if (
      typeof id !== "number" ||
      !Number.isInteger(id) ||
      typeof word !== "string" ||
      word.trim().length === 0 ||
      typeof meaning !== "string" ||
      ids.has(id)
    ) {
      throw new Error("导入词库包含无效或重复的单词 id");
    }
    ids.add(id);
    return {
      id,
      word,
      meaning,
    } as ImportedVocabularyEntry;
  });

  return Object.freeze(entries);
}
