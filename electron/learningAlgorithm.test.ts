import { describe, expect, it } from "vitest";
import {
  applyLearningAnswer,
  createInitialLearningState,
  isReviewDue,
} from "./learningAlgorithm";

describe("learning algorithm", () => {
  it("starts at level zero and raises mastery with consecutive correct answers", () => {
    const initial = createInitialLearningState();
    const first = applyLearningAnswer(initial, true, "2026-08-04T10:00:00.000Z");
    const second = applyLearningAnswer(first, true, "2026-08-04T10:01:00.000Z");

    expect(initial).toMatchObject({ masteryLevel: 0, studyCount: 0 });
    expect(second).toMatchObject({
      studyCount: 2,
      correctCount: 2,
      incorrectCount: 0,
      masteryLevel: 2,
      consecutiveCorrect: 2,
    });
  });

  it("clamps mastery between zero and five and resets consecutive answers after an error", () => {
    let state = createInitialLearningState();
    for (let index = 0; index < 7; index += 1) {
      state = applyLearningAnswer(state, true, `2026-08-04T10:0${index}:00.000Z`);
    }
    expect(state.masteryLevel).toBe(5);

    state = applyLearningAnswer(state, false, "2026-08-04T11:00:00.000Z");
    expect(state).toMatchObject({ masteryLevel: 4, consecutiveCorrect: 0, incorrectCount: 1 });

    for (let index = 0; index < 6; index += 1) {
      state = applyLearningAnswer(state, false, `2026-08-04T12:0${index}:00.000Z`);
    }
    expect(state.masteryLevel).toBe(0);
  });

  it("makes an incorrect answer due soon and delays higher mastery levels", () => {
    const initial = createInitialLearningState();
    const incorrect = applyLearningAnswer(initial, false, "2026-08-04T10:00:00.000Z");
    const mastered = Array.from({ length: 5 }).reduce(
      (state, _, index) => applyLearningAnswer(state, true, `2026-08-04T10:0${index}:00.000Z`),
      initial,
    );

    expect(incorrect.nextReviewAt).toBe("2026-08-04T10:00:15.000Z");
    expect(isReviewDue(incorrect, "2026-08-04T10:00:15.000Z")).toBe(true);
    expect(isReviewDue(incorrect, "2026-08-04T10:00:14.000Z")).toBe(false);
    expect(new Date(mastered.nextReviewAt).getTime()).toBeGreaterThan(
      new Date(incorrect.nextReviewAt).getTime(),
    );
  });
});
