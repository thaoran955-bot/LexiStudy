import { describe, expect, it } from "vitest";
import {
  getAnswerText,
  getDailySession,
  getFrontText,
  getResumeIndex,
  getStudyKeyAction,
  handleStudyKeyDown,
  getStudyQueue,
  isStudySpaceKey,
} from "./study";

const vocabulary = Array.from({ length: 60 }, (_, index) => ({
  id: index + 1,
  word: `word-${index + 1}`,
  meaning: `释义-${index + 1}`,
}));

describe("study session helpers", () => {
  it("limits a daily session to the selected target in source order", () => {
    const session = getDailySession(vocabulary, 35);

    expect(session).toHaveLength(35);
    expect(session[0].id).toBe(1);
    expect(session[34].id).toBe(35);
    expect(getDailySession(vocabulary, 50)).toHaveLength(50);
  });

  it("puts due review words first and keeps new words in source order", () => {
    const queue = getStudyQueue(vocabulary.slice(0, 4), 35, [3, 1]);

    expect(queue.map((entry) => entry.id)).toEqual([3, 1, 2, 4]);
  });

  it("clamps the resume index to the current daily target", () => {
    expect(getResumeIndex(12, 50)).toBe(12);
    expect(getResumeIndex(80, 50)).toBe(50);
    expect(getResumeIndex(-1, 35)).toBe(0);
  });

  it("switches the front and answer sides by study mode", () => {
    const entry = vocabulary[0];

    expect(getFrontText(entry, "en-to-zh")).toBe("word-1");
    expect(getAnswerText(entry, "en-to-zh")).toBe("释义-1");
    expect(getFrontText(entry, "zh-to-en")).toBe("释义-1");
    expect(getAnswerText(entry, "zh-to-en")).toBe("word-1");
  });

  it("maps keyboard shortcuts to actions only after the answer is shown", () => {
    expect(getStudyKeyAction("Space", false)).toBe("show-answer");
    expect(getStudyKeyAction("ArrowRight", true)).toBe("known");
    expect(getStudyKeyAction("ArrowLeft", true)).toBe("unknown");
    expect(getStudyKeyAction("Escape", false)).toBe("home");
    expect(getStudyKeyAction("ArrowRight", false)).toBeNull();
  });

  it("accepts browser key values for the answer shortcut", () => {
    expect(getStudyKeyAction(" ", false)).toBe("show-answer");
  });

  it("recognizes Space values that require default behavior blocking", () => {
    expect(isStudySpaceKey("Space")).toBe(true);
    expect(isStudySpaceKey("Spacebar")).toBe(true);
    expect(isStudySpaceKey(" ")).toBe(true);
    expect(isStudySpaceKey("ArrowRight")).toBe(false);
  });

  it("prevents Space default behavior before showing the answer", () => {
    let prevented = false;
    let propagationStopped = false;
    let immediatePropagationStopped = false;
    let answerShown = false;

    handleStudyKeyDown(
      {
        code: "Space",
        key: " ",
        repeat: false,
        preventDefault: () => {
          prevented = true;
        },
        stopPropagation: () => {
          propagationStopped = true;
        },
        stopImmediatePropagation: () => {
          immediatePropagationStopped = true;
        },
      },
      false,
      {
        showAnswer: () => {
          answerShown = true;
        },
        markKnown: () => undefined,
        markUnknown: () => undefined,
        goHome: () => undefined,
      },
    );

    expect(prevented).toBe(true);
    expect(propagationStopped).toBe(true);
    expect(immediatePropagationStopped).toBe(true);
    expect(answerShown).toBe(true);
  });
});
