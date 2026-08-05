import { describe, expect, it } from "vitest";
import { validateVocabulary } from "./vocabularyService";

describe("validateVocabulary", () => {
  it("accepts valid vocabulary entries and returns a read-only collection", () => {
    const entries = validateVocabulary([{ id: 1, word: "hello", meaning: "你好" }]);

    expect(entries).toEqual([{ id: 1, word: "hello", meaning: "你好" }]);
    expect(Object.isFrozen(entries)).toBe(true);
  });

  it("rejects entries with missing or invalid fields", () => {
    expect(() => validateVocabulary([{ id: "1", word: "hello", meaning: "你好" }])).toThrow(
      "词库格式无效",
    );
  });
});
