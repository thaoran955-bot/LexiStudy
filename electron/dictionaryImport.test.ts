import { describe, expect, it } from "vitest";
import { parseImportedVocabularyJson } from "./dictionaryImport";

describe("parseImportedVocabularyJson", () => {
  it("parses the supported JSON word shape", () => {
    expect(
      parseImportedVocabularyJson('[{"id":1,"word":"abandon","meaning":"放弃"}]'),
    ).toEqual([{ id: 1, word: "abandon", meaning: "放弃" }]);
  });

  it("rejects empty, malformed, incomplete, and duplicate JSON", () => {
    expect(() => parseImportedVocabularyJson("")).toThrow();
    expect(() => parseImportedVocabularyJson("not-json")).toThrow();
    expect(() => parseImportedVocabularyJson("{}")).toThrow();
    expect(() => parseImportedVocabularyJson('[{"id":1,"meaning":"一"}]')).toThrow();
    expect(() => parseImportedVocabularyJson('[{"id":1,"word":"one"}]')).toThrow();
    expect(() =>
      parseImportedVocabularyJson(
        '[{"id":1,"word":"one","meaning":"一"},{"id":1,"word":"two","meaning":"二"}]',
      ),
    ).toThrow();
    expect(parseImportedVocabularyJson('[{"id":2,"word":"valid","meaning":"有效"}]')).toEqual([
      { id: 2, word: "valid", meaning: "有效" },
    ]);
  });
});
