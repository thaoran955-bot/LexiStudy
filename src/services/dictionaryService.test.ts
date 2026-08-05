import { describe, expect, it } from "vitest";
import {
  BUNDLED_DICTIONARY_ID,
  createBundledDictionary,
  createReservedDictionaryImporter,
  normalizeBundledWords,
} from "./dictionaryService";

describe("dictionary service", () => {
  const entries = [
    { id: 1, word: "nuisance", meaning: "令人讨厌的东西" },
    { id: 2, word: "retain", meaning: "保留" },
  ] as const;

  it("adapts the existing bundled JSON shape without changing its entries", () => {
    expect(createBundledDictionary(entries, "2026-08-04T00:00:00.000Z")).toEqual({
      id: BUNDLED_DICTIONARY_ID,
      name: "六级高频词汇",
      source: "bundled",
      createdAt: "2026-08-04T00:00:00.000Z",
      wordCount: 2,
    });
    expect(normalizeBundledWords(entries)).toEqual([
      {
        id: 1,
        dictionaryId: BUNDLED_DICTIONARY_ID,
        word: "nuisance",
        meaning: "令人讨厌的东西",
        position: 0,
      },
      {
        id: 2,
        dictionaryId: BUNDLED_DICTIONARY_ID,
        word: "retain",
        meaning: "保留",
        position: 1,
      },
    ]);
  });

  it("keeps JSON import as a reserved interface", async () => {
    await expect(createReservedDictionaryImporter().importJson("future.json")).rejects.toThrow(
      "词库导入功能尚未实现",
    );
  });
});
