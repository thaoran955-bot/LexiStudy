import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import { createLearningDatabase, type LearningDatabase } from "./database";

const databases: LearningDatabase[] = [];

afterEach(() => {
  for (const database of databases.splice(0)) database.close();
});

describe("LearningDatabase", () => {
  const bundledWords = [
    { id: 3, word: "retain", meaning: "保留" },
    { id: 10, word: "nuisance", meaning: "令人讨厌的东西" },
  ];

  it("creates dictionary, word, learning_record, and settings tables", () => {
    const directory = mkdtempSync(path.join(os.tmpdir(), "vocabulary-schema-"));
    const databasePath = path.join(directory, "learning.sqlite");
    const database = createLearningDatabase(databasePath);
    databases.push(database);
    database.close();
    databases.splice(databases.indexOf(database), 1);

    const rawDatabase = new DatabaseSync(databasePath);
    const tables = rawDatabase
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
      .all() as Array<{ name: string }>;
    rawDatabase.close();
    rmSync(directory, { recursive: true, force: true });

    expect(tables.map((table) => table.name)).toEqual(
      expect.arrayContaining(["dictionary", "word", "learning_record", "word_learning_state", "settings"]),
    );
  });

  it("initializes defaults, stores settings, and counts word answers", () => {
    const database = createLearningDatabase(":memory:");
    databases.push(database);
    database.registerBundledVocabulary(bundledWords);

    expect(database.loadState().dailyTarget).toBe(35);

    database.setDailyTarget(50);
    database.recordAnswer({
      wordId: 10,
      recognized: true,
      answeredAt: "2026-08-04T09:00:00.000Z",
      sessionIndex: 1,
    });
    database.recordAnswer({
      wordId: 10,
      recognized: false,
      answeredAt: "2026-08-04T09:01:00.000Z",
      sessionIndex: 2,
    });

    const state = database.loadState("2026-08-04T09:01:15.000Z");
    expect(state.dailyTarget).toBe(50);
    expect(state.sessionIndex).toBe(2);
    expect(state.progress).toEqual({ answeredWords: 2, recognizedWords: 1, unknownWords: 1 });
    expect(state.wordStats).toEqual([
      {
        dictionaryId: "builtin.vocabulary-final",
        wordId: 10,
        studyCount: 2,
        correctCount: 1,
        incorrectCount: 1,
        masteryLevel: 0,
        consecutiveCorrect: 0,
        nextReviewAt: "2026-08-04T09:01:15.000Z",
        lastAnsweredAt: "2026-08-04T09:01:00.000Z",
      },
    ]);
    expect(state.reviewWordIds).toEqual([10]);
  });

  it("persists the daily target and default study mode in settings", () => {
    const database = createLearningDatabase(":memory:");
    databases.push(database);
    database.registerBundledVocabulary(bundledWords);

    database.setDailyTarget(50);
    database.setStudyMode("zh-to-en");

    expect(database.loadState()).toMatchObject({
      dailyTarget: 50,
      studyMode: "zh-to-en",
    });
  });

  it("restores settings and progress after reopening the same database file", () => {
    const directory = mkdtempSync(path.join(os.tmpdir(), "vocabulary-db-"));
    const databasePath = path.join(directory, "learning.sqlite");
    const first = createLearningDatabase(databasePath);
    databases.push(first);
    first.registerBundledVocabulary(bundledWords);
    first.setDailyTarget(50);
    first.setStudyMode("zh-to-en");
    first.recordAnswer({
      wordId: 3,
      recognized: true,
      answeredAt: "2026-08-04T10:00:00.000Z",
      sessionIndex: 1,
    });
    first.close();
    databases.splice(databases.indexOf(first), 1);

    const reopened = createLearningDatabase(databasePath);
    databases.push(reopened);
    expect(reopened.loadState("2026-08-04T10:02:00.000Z")).toMatchObject({
      dailyTarget: 50,
      studyMode: "zh-to-en",
      sessionIndex: 1,
      progress: { answeredWords: 1, recognizedWords: 1, unknownWords: 0 },
      wordStats: [
        {
          dictionaryId: "builtin.vocabulary-final",
          wordId: 3,
          studyCount: 1,
          correctCount: 1,
          incorrectCount: 0,
          masteryLevel: 1,
          consecutiveCorrect: 1,
          nextReviewAt: "2026-08-04T10:02:00.000Z",
          lastAnsweredAt: "2026-08-04T10:00:00.000Z",
        },
      ],
    });
    reopened.close();
    databases.splice(databases.indexOf(reopened), 1);
    rmSync(directory, { recursive: true, force: true });
  });

  it("migrates settings and learning records from the previous schema", () => {
    const directory = mkdtempSync(path.join(os.tmpdir(), "vocabulary-migration-"));
    const databasePath = path.join(directory, "learning.sqlite");
    const legacyDatabase = new DatabaseSync(databasePath);
    legacyDatabase.exec(`
      CREATE TABLE app_state (
        id INTEGER PRIMARY KEY,
        daily_target INTEGER NOT NULL,
        study_mode TEXT NOT NULL,
        session_index INTEGER NOT NULL
      );
      INSERT INTO app_state VALUES (1, 50, 'zh-to-en', 1);
      CREATE TABLE learning_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word_id INTEGER NOT NULL,
        recognized INTEGER NOT NULL,
        answered_at TEXT NOT NULL,
        session_index INTEGER NOT NULL
      );
      INSERT INTO learning_records VALUES (1, 3, 1, '2026-08-04T10:00:00.000Z', 1);
    `);
    legacyDatabase.close();

    const database = createLearningDatabase(databasePath);
    databases.push(database);
    database.registerBundledVocabulary(bundledWords);

    expect(database.loadState()).toMatchObject({
      dailyTarget: 50,
      studyMode: "zh-to-en",
      sessionIndex: 1,
      progress: { answeredWords: 1, recognizedWords: 1, unknownWords: 0 },
    });
    database.close();
    databases.splice(databases.indexOf(database), 1);
    rmSync(directory, { recursive: true, force: true });
  });

  it("aggregates statistics from dictionary, word, and learning records", () => {
    const database = createLearningDatabase(":memory:");
    databases.push(database);
    database.registerBundledVocabulary([
      ...bundledWords,
      { id: 20, word: "accurate", meaning: "准确的" },
    ]);
    database.setDailyTarget(50);
    database.recordAnswer({
      wordId: 10,
      recognized: false,
      answeredAt: "2026-08-04T10:00:00.000Z",
      sessionIndex: 1,
    });
    database.recordAnswer({
      wordId: 3,
      recognized: true,
      answeredAt: "2026-08-04T10:01:00.000Z",
      sessionIndex: 2,
    });
    database.recordAnswer({
      wordId: 3,
      recognized: true,
      answeredAt: "2026-08-04T10:02:00.000Z",
      sessionIndex: 3,
    });

    expect(database.loadStatistics("2026-08-04T12:00:00.000Z")).toEqual({
      totalWords: 3,
      unlearnedWords: 2,
      learningWords: 1,
      masteredWords: 0,
      todayTarget: 50,
      todayAnswered: 3,
      todayCompleted: 3,
      todayProgress: 6,
      totalStudyCount: 3,
      correctRate: 66.7,
      masteryDistribution: [
        { level: 0, count: 2 },
        { level: 1, count: 0 },
        { level: 2, count: 1 },
        { level: 3, count: 0 },
        { level: 4, count: 0 },
        { level: 5, count: 0 },
      ],
      topErrors: [
        {
          dictionaryId: "builtin.vocabulary-final",
          wordId: 10,
          word: "nuisance",
          meaning: "令人讨厌的东西",
          incorrectCount: 1,
          studyCount: 1,
          masteryLevel: 0,
        },
      ],
    });
  });

  it("imports a separate dictionary without changing bundled learning data", () => {
    const database = createLearningDatabase(":memory:");
    databases.push(database);
    database.registerBundledVocabulary(bundledWords);
    database.recordAnswer({
      wordId: 3,
      recognized: true,
      answeredAt: "2026-08-04T11:00:00.000Z",
      sessionIndex: 1,
    });

    const imported = database.importDictionary(
      "雅思词汇",
      [
        { id: 1, word: "abandon", meaning: "放弃" },
        { id: 2, word: "achieve", meaning: "达到" },
      ],
      "imported.ielts",
      "2026-08-04T11:30:00.000Z",
    );

    expect(imported).toEqual({
      id: "imported.ielts",
      name: "雅思词汇",
      source: "imported",
      createdAt: "2026-08-04T11:30:00.000Z",
      wordCount: 2,
    });
    expect(database.listDictionaries()).toEqual([
      {
        id: "builtin.vocabulary-final",
        name: "六级高频词汇",
        source: "bundled",
        createdAt: "2026-08-04T00:00:00.000Z",
        wordCount: 2,
      },
      imported,
    ]);
    expect(database.loadState()).toMatchObject({
      progress: { answeredWords: 1, recognizedWords: 1, unknownWords: 0 },
      wordStats: [
        expect.objectContaining({
          dictionaryId: "builtin.vocabulary-final",
          wordId: 3,
          studyCount: 1,
        }),
      ],
    });
  });

  it("persists the current dictionary and isolates learning progress by dictionary", () => {
    const database = createLearningDatabase(":memory:");
    databases.push(database);
    database.registerBundledVocabulary(bundledWords);
    const imported = database.importDictionary(
      "雅思词汇",
      [{ id: 3, word: "abandon", meaning: "放弃" }],
      "imported.ielts",
      "2026-08-04T12:00:00.000Z",
    );

    database.recordAnswer({
      wordId: 3,
      recognized: true,
      answeredAt: "2026-08-04T12:01:00.000Z",
      sessionIndex: 1,
    });
    database.setCurrentDictionary(imported.id);

    expect(database.loadDictionaryWords()).toEqual([
      { id: 3, word: "abandon", meaning: "放弃" },
    ]);
    expect(database.loadState()).toMatchObject({
      currentDictionaryId: imported.id,
      sessionIndex: 0,
      progress: { answeredWords: 0, recognizedWords: 0, unknownWords: 0 },
      wordStats: [],
    });

    database.recordAnswer({
      wordId: 3,
      recognized: false,
      answeredAt: "2026-08-04T12:02:00.000Z",
      sessionIndex: 1,
    });
    database.setCurrentDictionary("builtin.vocabulary-final");

    expect(database.loadState()).toMatchObject({
      currentDictionaryId: "builtin.vocabulary-final",
      sessionIndex: 1,
      progress: { answeredWords: 1, recognizedWords: 1, unknownWords: 0 },
      wordStats: [expect.objectContaining({ dictionaryId: "builtin.vocabulary-final", wordId: 3 })],
    });
  });

  it("restores the selected dictionary after reopening the database", () => {
    const directory = mkdtempSync(path.join(os.tmpdir(), "vocabulary-selection-"));
    const databasePath = path.join(directory, "learning.sqlite");
    const first = createLearningDatabase(databasePath);
    databases.push(first);
    first.registerBundledVocabulary(bundledWords);
    const imported = first.importDictionary(
      "托福词汇",
      [{ id: 1, word: "adapt", meaning: "适应" }],
      "imported.toefl",
      "2026-08-04T13:00:00.000Z",
    );
    first.setCurrentDictionary(imported.id);
    first.close();
    databases.splice(databases.indexOf(first), 1);

    const reopened = createLearningDatabase(databasePath);
    databases.push(reopened);
    reopened.registerBundledVocabulary(bundledWords);
    expect(reopened.getCurrentDictionary()).toEqual(imported);
    expect(reopened.loadState().currentDictionaryId).toBe(imported.id);
    reopened.close();
    databases.splice(databases.indexOf(reopened), 1);
    rmSync(directory, { recursive: true, force: true });
  });
});
