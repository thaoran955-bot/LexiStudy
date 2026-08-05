import { describe, expect, it } from "vitest";
import { createAnswerPayload } from "./learningDataService";

describe("learning data service", () => {
  it("adds the persisted session index to an answer payload", () => {
    const payload = createAnswerPayload(
      {
      wordId: 1,
      recognized: true,
      answeredAt: "2026-08-04T00:00:00.000Z",
      },
      1,
    );

    expect(payload).toEqual({
      wordId: 1,
      recognized: true,
      answeredAt: "2026-08-04T00:00:00.000Z",
      sessionIndex: 1,
    });
  });
});
