import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import {
  applyLearningAnswer,
  createInitialLearningState,
  type WordLearningState,
} from "./learningAlgorithm";
import type { ImportedVocabularyEntry } from "./dictionaryImport";

export const BUNDLED_DICTIONARY_ID = "builtin.vocabulary-final";
const BUNDLED_DICTIONARY_NAME = "六级高频词汇";
const BUNDLED_DICTIONARY_CREATED_AT = "2026-08-04T00:00:00.000Z";

export type DailyTarget = 35 | 50;
export type StudyMode = "en-to-zh" | "zh-to-en";

export interface BundledVocabularyEntry {
  readonly id: number;
  readonly word: string;
  readonly meaning: string;
}

export interface AnswerInput {
  readonly dictionaryId?: string;
  readonly wordId: number;
  readonly recognized: boolean;
  readonly answeredAt: string;
  readonly sessionIndex: number;
}

export interface WordStat {
  readonly dictionaryId: string;
  readonly wordId: number;
  readonly studyCount: number;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly masteryLevel: number;
  readonly consecutiveCorrect: number;
  readonly nextReviewAt: string | null;
  readonly lastAnsweredAt: string | null;
}

export interface LearningState {
  readonly currentDictionaryId: string;
  readonly dailyTarget: DailyTarget;
  readonly studyMode: StudyMode;
  readonly sessionIndex: number;
  readonly progress: {
    readonly answeredWords: number;
    readonly recognizedWords: number;
    readonly unknownWords: number;
  };
  readonly wordStats: readonly WordStat[];
  readonly reviewWordIds: readonly number[];
}

export interface MasteryDistribution {
  readonly level: number;
  readonly count: number;
}

export interface ErrorRanking {
  readonly dictionaryId: string;
  readonly wordId: number;
  readonly word: string;
  readonly meaning: string;
  readonly incorrectCount: number;
  readonly studyCount: number;
  readonly masteryLevel: number;
}

export interface LearningStatistics {
  readonly totalWords: number;
  readonly unlearnedWords: number;
  readonly learningWords: number;
  readonly masteredWords: number;
  readonly todayTarget: DailyTarget;
  readonly todayAnswered: number;
  readonly todayCompleted: number;
  readonly todayProgress: number;
  readonly totalStudyCount: number;
  readonly correctRate: number;
  readonly masteryDistribution: readonly MasteryDistribution[];
  readonly topErrors: readonly ErrorRanking[];
}

export type DictionarySource = "bundled" | "imported";

export interface DictionarySummary {
  readonly id: string;
  readonly name: string;
  readonly source: DictionarySource;
  readonly createdAt: string;
  readonly wordCount: number;
}

export interface DictionaryWord {
  readonly id: number;
  readonly word: string;
  readonly meaning: string;
}

export interface LearningDatabase {
  registerBundledVocabulary(entries: readonly BundledVocabularyEntry[]): void;
  importDictionary(
    name: string,
    entries: readonly ImportedVocabularyEntry[],
    dictionaryId?: string,
    createdAt?: string,
  ): DictionarySummary;
  listDictionaries(): readonly DictionarySummary[];
  getCurrentDictionary(): DictionarySummary;
  setCurrentDictionary(dictionaryId: string): DictionarySummary;
  loadDictionaryWords(dictionaryId?: string): readonly DictionaryWord[];
  loadState(now?: string): LearningState;
  loadStatistics(now?: string): LearningStatistics;
  setDailyTarget(target: DailyTarget): void;
  setStudyMode(mode: StudyMode): void;
  recordAnswer(answer: AnswerInput): void;
  close(): void;
}

interface LegacyAppState {
  readonly daily_target: DailyTarget;
  readonly study_mode: StudyMode;
  readonly session_index: number;
}

class SqliteLearningDatabase implements LearningDatabase {
  private readonly database: DatabaseSync;

  constructor(databasePath: string) {
    this.database = new DatabaseSync(databasePath);
    this.database.exec("PRAGMA foreign_keys = ON");
    this.database.exec("PRAGMA journal_mode = WAL");
    const hadSettingsTable = this.hasTable("settings");
    this.createSchema();
    this.seedDefaultSettings();
    if (!hadSettingsTable) this.migrateLegacySettings();
  }

  registerBundledVocabulary(entries: readonly BundledVocabularyEntry[]): void {
    this.runTransaction(() => {
      this.database
        .prepare(
          `INSERT INTO dictionary (id, name, source, created_at, word_count)
           VALUES (?, ?, 'bundled', ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             name = excluded.name,
             source = excluded.source,
             created_at = excluded.created_at,
             word_count = excluded.word_count`,
        )
        .run(
          BUNDLED_DICTIONARY_ID,
          BUNDLED_DICTIONARY_NAME,
          BUNDLED_DICTIONARY_CREATED_AT,
          entries.length,
        );

      const insertWord = this.database.prepare(
        `INSERT INTO word (dictionary_id, id, word, meaning, position)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(dictionary_id, id) DO UPDATE SET
           word = excluded.word,
           meaning = excluded.meaning,
           position = excluded.position`,
      );
      entries.forEach((entry, position) => {
        insertWord.run(BUNDLED_DICTIONARY_ID, entry.id, entry.word, entry.meaning, position);
      });
      this.migrateLegacyLearningRecords();
      this.rebuildLearningStatesIfEmpty();
    });
  }

  importDictionary(
    name: string,
    entries: readonly ImportedVocabularyEntry[],
    dictionaryId = `imported.${randomUUID()}`,
    createdAt = new Date().toISOString(),
  ): DictionarySummary {
    if (!name.trim()) throw new Error("词库名称不能为空");
    if (entries.length === 0) throw new Error("词库不能为空");
    const ids = new Set<number>();
    entries.forEach((entry) => {
      if (
        !Number.isInteger(entry.id) ||
        ids.has(entry.id) ||
        typeof entry.word !== "string" ||
        !entry.word.trim() ||
        typeof entry.meaning !== "string"
      ) {
        throw new Error("词库包含无效或重复的单词");
      }
      ids.add(entry.id);
    });

    let importedDictionary: DictionarySummary | undefined;
    this.runTransaction(() => {
      this.database
        .prepare(
          `INSERT INTO dictionary (id, name, source, created_at, word_count)
           VALUES (?, ?, 'imported', ?, ?)`,
        )
        .run(dictionaryId, name.trim(), createdAt, entries.length);
      const insertWord = this.database.prepare(
        `INSERT INTO word (dictionary_id, id, word, meaning, position)
         VALUES (?, ?, ?, ?, ?)`,
      );
      entries.forEach((entry, position) => {
        insertWord.run(dictionaryId, entry.id, entry.word, entry.meaning, position);
      });
      importedDictionary = this.readDictionary(dictionaryId);
    });
    if (!importedDictionary) throw new Error("词库导入失败");
    return importedDictionary;
  }

  listDictionaries(): readonly DictionarySummary[] {
    return this.database
      .prepare(
        `SELECT id,
                name,
                source,
                created_at AS createdAt,
                word_count AS wordCount
         FROM dictionary
         ORDER BY CASE WHEN source = 'bundled' THEN 0 ELSE 1 END,
                  created_at,
                  id`,
      )
      .all()
      .map((row) => {
        const dictionary = row as unknown as DictionarySummary;
        return {
          ...dictionary,
          source: dictionary.source as DictionarySource,
          wordCount: Number(dictionary.wordCount),
        };
      });
  }

  getCurrentDictionary(): DictionarySummary {
    const dictionary = this.readDictionary(this.readCurrentDictionaryId());
    if (!dictionary) throw new Error("当前词库不存在");
    return dictionary;
  }

  setCurrentDictionary(dictionaryId: string): DictionarySummary {
    const dictionary = this.readDictionary(dictionaryId);
    if (!dictionary) throw new Error("词库不存在");
    this.database
      .prepare(
        `INSERT INTO settings (key, value)
         VALUES ('current_dictionary_id', ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      )
      .run(dictionaryId);
    return dictionary;
  }

  loadDictionaryWords(dictionaryId = this.readCurrentDictionaryId()): readonly DictionaryWord[] {
    return this.database
      .prepare(
        `SELECT id, word, meaning
         FROM word
         WHERE dictionary_id = ?
         ORDER BY position`,
      )
      .all(dictionaryId) as unknown as DictionaryWord[];
  }

  loadState(now = new Date().toISOString()): LearningState {
    const currentDictionaryId = this.readCurrentDictionaryId();
    const dailyTarget = Number(this.readSetting("daily_target", "35")) as DailyTarget;
    const studyMode = this.readSetting("study_mode", "en-to-zh") as StudyMode;
    const sessionIndex = this.readSessionIndex(currentDictionaryId);
    const stats = this.database
      .prepare(
        `SELECT dictionary_id AS dictionaryId,
                word_id AS wordId,
                study_count AS studyCount,
                correct_count AS correctCount,
                incorrect_count AS incorrectCount,
                mastery_level AS masteryLevel,
                consecutive_correct AS consecutiveCorrect,
                next_review_at AS nextReviewAt,
                last_answered_at AS lastAnsweredAt
         FROM word_learning_state
         WHERE dictionary_id = ?
         GROUP BY dictionary_id, word_id
         ORDER BY dictionary_id, word_id`,
      )
      .all(currentDictionaryId) as unknown as WordStat[];
    const progress = stats.reduce(
      (summary, stat) => ({
        answeredWords: summary.answeredWords + stat.studyCount,
        recognizedWords: summary.recognizedWords + stat.correctCount,
        unknownWords: summary.unknownWords + stat.incorrectCount,
      }),
      { answeredWords: 0, recognizedWords: 0, unknownWords: 0 },
    );
    const reviewWordIds = this.database
      .prepare(
        `SELECT word_id AS wordId
         FROM word_learning_state
         WHERE dictionary_id = ?
           AND mastery_level <= 2
           AND next_review_at IS NOT NULL
           AND next_review_at <= ?
         ORDER BY next_review_at, word_id`,
      )
      .all(currentDictionaryId, now) as Array<{ wordId: number }>;

    return {
      currentDictionaryId,
      dailyTarget,
      studyMode,
      sessionIndex,
      progress,
      wordStats: stats,
      reviewWordIds: reviewWordIds.map((entry) => entry.wordId),
    };
  }

  loadStatistics(now = new Date().toISOString()): LearningStatistics {
    const todayTarget = Number(this.readSetting("daily_target", "35")) as DailyTarget;
    const totalWords = this.readCount("SELECT COUNT(*) AS count FROM word");
    const masteryRows = this.database
      .prepare(
        `SELECT COALESCE(state.mastery_level, 0) AS level,
                COUNT(*) AS count
         FROM word
         LEFT JOIN word_learning_state AS state
           ON state.dictionary_id = word.dictionary_id
          AND state.word_id = word.id
         GROUP BY COALESCE(state.mastery_level, 0)`
      )
      .all() as Array<{ level: number; count: number }>;
    const masteryCounts = new Map(
      masteryRows.map((row) => [Number(row.level), Number(row.count)]),
    );
    const masteryDistribution = Array.from({ length: 6 }, (_, level) => ({
      level,
      count: masteryCounts.get(level) ?? 0,
    }));
    const unlearnedWords = masteryDistribution[0].count;
    const learningWords = masteryDistribution
      .filter((entry) => entry.level >= 1 && entry.level <= 2)
      .reduce((total, entry) => total + entry.count, 0);
    const masteredWords = masteryDistribution
      .filter((entry) => entry.level >= 3)
      .reduce((total, entry) => total + entry.count, 0);

    const answerTotals = this.database
      .prepare(
        `SELECT COUNT(*) AS totalStudyCount,
                COALESCE(SUM(recognized), 0) AS correctCount
         FROM learning_record`,
      )
      .get() as { totalStudyCount: number; correctCount: number };
    const totalStudyCount = Number(answerTotals.totalStudyCount);
    const correctCount = Number(answerTotals.correctCount);
    const correctRate =
      totalStudyCount === 0 ? 0 : Math.round((correctCount / totalStudyCount) * 1000) / 10;

    const todayAnswered = this.readCount(
      "SELECT COUNT(*) AS count FROM learning_record WHERE substr(answered_at, 1, 10) = substr(?, 1, 10)",
      now,
    );
    const todayCompleted = Math.min(todayAnswered, todayTarget);
    const todayProgress = Math.round((todayCompleted / todayTarget) * 1000) / 10;
    const topErrors = this.database
      .prepare(
        `SELECT state.dictionary_id AS dictionaryId,
                state.word_id AS wordId,
                word.word AS word,
                word.meaning AS meaning,
                state.incorrect_count AS incorrectCount,
                state.study_count AS studyCount,
                state.mastery_level AS masteryLevel
         FROM word_learning_state AS state
         INNER JOIN word
           ON word.dictionary_id = state.dictionary_id
          AND word.id = state.word_id
         WHERE state.incorrect_count > 0
         ORDER BY state.incorrect_count DESC,
                  state.study_count DESC,
                  word.position ASC
         LIMIT 20`,
      )
      .all() as unknown as ErrorRanking[];

    return {
      totalWords,
      unlearnedWords,
      learningWords,
      masteredWords,
      todayTarget,
      todayAnswered,
      todayCompleted,
      todayProgress,
      totalStudyCount,
      correctRate,
      masteryDistribution,
      topErrors: topErrors.map((entry) => ({
        ...entry,
        wordId: Number(entry.wordId),
        incorrectCount: Number(entry.incorrectCount),
        studyCount: Number(entry.studyCount),
        masteryLevel: Number(entry.masteryLevel),
      })),
    };
  }

  setDailyTarget(target: DailyTarget): void {
    this.database.prepare("UPDATE settings SET value = ? WHERE key = 'daily_target'").run(String(target));
    const currentDictionaryId = this.readCurrentDictionaryId();
    this.writeSessionIndex(
      currentDictionaryId,
      Math.min(this.readSessionIndex(currentDictionaryId), target),
    );
  }

  setStudyMode(mode: StudyMode): void {
    this.database.prepare("UPDATE settings SET value = ? WHERE key = 'study_mode'").run(mode);
  }

  recordAnswer(answer: AnswerInput): void {
    const dictionaryId = answer.dictionaryId ?? this.readCurrentDictionaryId();
    this.runTransaction(() => {
      const previousState = this.getWordLearningState(dictionaryId, answer.wordId);
      const nextState = applyLearningAnswer(
        previousState ?? createInitialLearningState(),
        answer.recognized,
        answer.answeredAt,
      );
      this.database
        .prepare(
          `INSERT INTO learning_record
             (dictionary_id, word_id, recognized, answered_at, session_index)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .run(
          dictionaryId,
          answer.wordId,
          answer.recognized ? 1 : 0,
          answer.answeredAt,
          answer.sessionIndex,
        );
      this.writeSessionIndex(dictionaryId, answer.sessionIndex);
      this.saveWordLearningState(dictionaryId, answer.wordId, nextState);
    });
  }

  close(): void {
    this.database.close();
  }

  private createSchema(): void {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS dictionary (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        source TEXT NOT NULL CHECK (source IN ('bundled', 'imported')),
        created_at TEXT NOT NULL,
        word_count INTEGER NOT NULL CHECK (word_count >= 0)
      );
      CREATE TABLE IF NOT EXISTS word (
        dictionary_id TEXT NOT NULL,
        id INTEGER NOT NULL,
        word TEXT NOT NULL,
        meaning TEXT NOT NULL,
        position INTEGER NOT NULL CHECK (position >= 0),
        PRIMARY KEY (dictionary_id, id),
        UNIQUE (dictionary_id, position),
        FOREIGN KEY (dictionary_id) REFERENCES dictionary(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS learning_record (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dictionary_id TEXT NOT NULL,
        word_id INTEGER NOT NULL,
        recognized INTEGER NOT NULL CHECK (recognized IN (0, 1)),
        answered_at TEXT NOT NULL,
        session_index INTEGER NOT NULL CHECK (session_index >= 0),
        FOREIGN KEY (dictionary_id, word_id) REFERENCES word(dictionary_id, id)
      );
      CREATE TABLE IF NOT EXISTS word_learning_state (
        dictionary_id TEXT NOT NULL,
        word_id INTEGER NOT NULL,
        study_count INTEGER NOT NULL DEFAULT 0,
        correct_count INTEGER NOT NULL DEFAULT 0,
        incorrect_count INTEGER NOT NULL DEFAULT 0,
        mastery_level INTEGER NOT NULL DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
        consecutive_correct INTEGER NOT NULL DEFAULT 0 CHECK (consecutive_correct >= 0),
        next_review_at TEXT,
        last_answered_at TEXT,
        PRIMARY KEY (dictionary_id, word_id),
        FOREIGN KEY (dictionary_id, word_id) REFERENCES word(dictionary_id, id)
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
  }

  private seedDefaultSettings(): void {
    this.database
      .prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('daily_target', '35')")
      .run();
    this.database
      .prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('study_mode', 'en-to-zh')")
      .run();
    this.database
      .prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('session_index', '0')")
      .run();
    this.database
      .prepare(
        "INSERT OR IGNORE INTO settings (key, value) VALUES ('current_dictionary_id', ?)",
      )
      .run(BUNDLED_DICTIONARY_ID);
  }

  private migrateLegacySettings(): void {
    if (!this.hasTable("app_state")) return;
    const legacyState = this.database
      .prepare("SELECT daily_target, study_mode, session_index FROM app_state WHERE id = 1")
      .get() as LegacyAppState | undefined;
    if (!legacyState) return;
    this.database
      .prepare("UPDATE settings SET value = ? WHERE key = 'daily_target'")
      .run(String(legacyState.daily_target));
    this.database
      .prepare("UPDATE settings SET value = ? WHERE key = 'study_mode'")
      .run(legacyState.study_mode);
    this.database
      .prepare("UPDATE settings SET value = ? WHERE key = 'session_index'")
      .run(String(legacyState.session_index));
  }

  private migrateLegacyLearningRecords(): void {
    if (!this.hasTable("learning_records")) return;
    this.database
      .prepare(
        `INSERT OR IGNORE INTO learning_record
           (id, dictionary_id, word_id, recognized, answered_at, session_index)
         SELECT id, ?, word_id, recognized, answered_at, session_index
         FROM learning_records`,
      )
      .run(BUNDLED_DICTIONARY_ID);
  }

  private rebuildLearningStatesIfEmpty(): void {
    const stateCount = this.database
      .prepare("SELECT COUNT(*) AS count FROM word_learning_state")
      .get() as { count: number };
    if (stateCount.count > 0) return;

    const records = this.database
      .prepare(
        `SELECT dictionary_id AS dictionaryId,
                word_id AS wordId,
                recognized,
                answered_at AS answeredAt
         FROM learning_record
         ORDER BY id`,
      )
      .all() as unknown as Array<{
      dictionaryId: string;
      wordId: number;
      recognized: number;
      answeredAt: string;
    }>;
    const states = new Map<string, WordLearningState>();
    records.forEach((record) => {
      const key = `${record.dictionaryId}:${record.wordId}`;
      const current = states.get(key) ?? createInitialLearningState();
      states.set(key, applyLearningAnswer(current, record.recognized === 1, record.answeredAt));
    });
    states.forEach((state, key) => {
      const separator = key.lastIndexOf(":");
      this.saveWordLearningState(key.slice(0, separator), Number(key.slice(separator + 1)), state);
    });
  }

  private getWordLearningState(dictionaryId: string, wordId: number): WordLearningState | undefined {
    return this.database
      .prepare(
        `SELECT study_count AS studyCount,
                correct_count AS correctCount,
                incorrect_count AS incorrectCount,
                mastery_level AS masteryLevel,
                consecutive_correct AS consecutiveCorrect,
                next_review_at AS nextReviewAt,
                last_answered_at AS lastAnsweredAt
         FROM word_learning_state
         WHERE dictionary_id = ? AND word_id = ?`,
      )
      .get(dictionaryId, wordId) as WordLearningState | undefined;
  }

  private saveWordLearningState(
    dictionaryId: string,
    wordId: number,
    state: WordLearningState,
  ): void {
    this.database
      .prepare(
        `INSERT INTO word_learning_state
           (dictionary_id, word_id, study_count, correct_count, incorrect_count,
            mastery_level, consecutive_correct, next_review_at, last_answered_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(dictionary_id, word_id) DO UPDATE SET
           study_count = excluded.study_count,
           correct_count = excluded.correct_count,
           incorrect_count = excluded.incorrect_count,
           mastery_level = excluded.mastery_level,
           consecutive_correct = excluded.consecutive_correct,
           next_review_at = excluded.next_review_at,
           last_answered_at = excluded.last_answered_at`,
      )
      .run(
        dictionaryId,
        wordId,
        state.studyCount,
        state.correctCount,
        state.incorrectCount,
        state.masteryLevel,
        state.consecutiveCorrect,
        state.nextReviewAt,
        state.lastAnsweredAt,
      );
  }

  private hasTable(tableName: string): boolean {
    return Boolean(
      this.database
        .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?")
        .get(tableName),
    );
  }

  private readSetting(key: string, fallback: string): string {
    return this.readOptionalSetting(key) ?? fallback;
  }

  private readOptionalSetting(key: string): string | undefined {
    const setting = this.database
      .prepare("SELECT value FROM settings WHERE key = ?")
      .get(key) as { value: string } | undefined;
    return setting?.value;
  }

  private readCurrentDictionaryId(): string {
    const configuredId = this.readSetting("current_dictionary_id", BUNDLED_DICTIONARY_ID);
    if (this.readDictionary(configuredId)) return configuredId;
    if (this.readDictionary(BUNDLED_DICTIONARY_ID)) {
      this.database
        .prepare(
          `INSERT INTO settings (key, value)
           VALUES ('current_dictionary_id', ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        )
        .run(BUNDLED_DICTIONARY_ID);
      return BUNDLED_DICTIONARY_ID;
    }
    throw new Error("尚未初始化词库");
  }

  private readSessionIndex(dictionaryId: string): number {
    const dictionarySession = this.readOptionalSetting(`session_index:${dictionaryId}`);
    if (dictionarySession !== undefined) return Number(dictionarySession);
    if (dictionaryId === BUNDLED_DICTIONARY_ID) {
      return Number(this.readSetting("session_index", "0"));
    }
    return 0;
  }

  private writeSessionIndex(dictionaryId: string, sessionIndex: number): void {
    this.database
      .prepare(
        `INSERT INTO settings (key, value)
         VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      )
      .run(`session_index:${dictionaryId}`, String(sessionIndex));
    if (dictionaryId === BUNDLED_DICTIONARY_ID) {
      this.database
        .prepare("UPDATE settings SET value = ? WHERE key = 'session_index'")
        .run(String(sessionIndex));
    }
  }

  private readDictionary(dictionaryId: string): DictionarySummary | undefined {
    const dictionary = this.database
      .prepare(
        `SELECT id,
                name,
                source,
                created_at AS createdAt,
                word_count AS wordCount
         FROM dictionary
         WHERE id = ?`,
      )
      .get(dictionaryId) as unknown as DictionarySummary | undefined;
    if (!dictionary) return undefined;
    return {
      ...dictionary,
      source: dictionary.source as DictionarySource,
      wordCount: Number(dictionary.wordCount),
    };
  }

  private readCount(query: string, ...parameters: string[]): number {
    const result = this.database.prepare(query).get(...parameters) as { count: number };
    return Number(result.count);
  }

  private runTransaction(operation: () => void): void {
    this.database.exec("BEGIN");
    try {
      operation();
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
}

export function createLearningDatabase(databasePath: string): LearningDatabase {
  return new SqliteLearningDatabase(databasePath);
}
