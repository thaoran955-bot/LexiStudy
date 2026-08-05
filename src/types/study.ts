import type { VocabularyEntry } from "./vocabulary";

export type DailyTarget = 35 | 50;
export type StudyMode = "en-to-zh" | "zh-to-en";
export type StudyKeyAction = "show-answer" | "known" | "unknown" | "home" | null;

export interface StudyKeyHandlers {
  showAnswer: () => void;
  markKnown: () => void;
  markUnknown: () => void;
  goHome: () => void;
}

export function getDailySession(
  vocabulary: readonly VocabularyEntry[],
  target: DailyTarget,
): readonly VocabularyEntry[] {
  return vocabulary.slice(0, target);
}

export function getStudyQueue(
  vocabulary: readonly VocabularyEntry[],
  target: DailyTarget,
  reviewWordIds: readonly number[],
): readonly VocabularyEntry[] {
  const entriesById = new Map(vocabulary.map((entry) => [entry.id, entry]));
  const reviewEntries = reviewWordIds
    .map((wordId) => entriesById.get(wordId))
    .filter((entry): entry is VocabularyEntry => Boolean(entry));
  const reviewIds = new Set(reviewWordIds);
  const newEntries = vocabulary.slice(0, target).filter((entry) => !reviewIds.has(entry.id));
  return [...reviewEntries, ...newEntries];
}

export function getResumeIndex(answeredCount: number, target: DailyTarget): number {
  return Math.min(Math.max(answeredCount, 0), target);
}

export function getFrontText(entry: VocabularyEntry, mode: StudyMode): string {
  return mode === "en-to-zh" ? entry.word : entry.meaning || "暂无释义";
}

export function getAnswerText(entry: VocabularyEntry, mode: StudyMode): string {
  return mode === "en-to-zh" ? entry.meaning || "暂无释义" : entry.word;
}

export function getStudyKeyAction(code: string, showAnswer: boolean): StudyKeyAction {
  const normalizedCode = {
    " ": "Space",
    Spacebar: "Space",
    Esc: "Escape",
    Right: "ArrowRight",
    Left: "ArrowLeft",
  }[code] ?? code;

  if (normalizedCode === "Escape") return "home";
  if (normalizedCode === "Space") return showAnswer ? null : "show-answer";
  if (normalizedCode === "ArrowRight") return showAnswer ? "known" : null;
  if (normalizedCode === "ArrowLeft") return showAnswer ? "unknown" : null;
  return null;
}

export function handleStudyKeyDown(
  event: Pick<KeyboardEvent, "code" | "key" | "repeat" | "preventDefault" | "stopPropagation" | "stopImmediatePropagation">,
  showAnswer: boolean,
  handlers: StudyKeyHandlers,
): void {
  const keyValues = [event.code, event.key];
  const isShortcut = keyValues.some((key) =>
    isStudySpaceKey(key) || ["ArrowRight", "ArrowLeft", "Escape", "Esc", "Right", "Left"].includes(key),
  );
  if (!isShortcut) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  if (event.repeat) return;

  const action = getStudyKeyAction(event.code, showAnswer) ?? getStudyKeyAction(event.key, showAnswer);
  if (action === "home") {
    handlers.goHome();
    return;
  }
  if (action === "show-answer") {
    handlers.showAnswer();
    return;
  }
  if (action === "known") {
    handlers.markKnown();
    return;
  }
  if (action === "unknown") {
    handlers.markUnknown();
  }
}

export function isStudySpaceKey(value: string): boolean {
  return value === "Space" || value === "Spacebar" || value === " ";
}
