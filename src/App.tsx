import { useEffect, useMemo, useState } from "react";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import {
  importDictionaryFromFile,
  loadCurrentDictionary,
  loadDictionaries,
  selectDictionary,
} from "./services/dictionaryService";
import { saveAnswer, saveDailyTarget, saveStudyMode } from "./services/learningDataService";
import type { LearningRecord, LearningProgress, PersistedLearningState } from "./types/learning";
import type { Dictionary } from "./types/dictionary";
import { getResumeIndex, getStudyQueue } from "./types/study";
import type { DailyTarget, StudyMode } from "./types/study";
import type { VocabularyEntry } from "./types/vocabulary";
import { HomePage } from "./pages/HomePage";
import { DictionaryManagementPage } from "./pages/DictionaryManagementPage";
import { SettingsPage } from "./pages/SettingsPage";
import { KeyboardShortcutsPage } from "./pages/KeyboardShortcutsPage";
import { StatsPage } from "./pages/StatsPage";
import { StudyPage } from "./pages/StudyPage";

const emptyProgress: LearningProgress = {
  totalWords: 0,
  answeredWords: 0,
  recognizedWords: 0,
  unknownWords: 0,
};

function MenuNavigationBridge() {
  const navigate = useNavigate();

  useEffect(() => window.appMenu.onNavigate(navigate), [navigate]);

  return null;
}

interface MenuDictionaryImportBridgeProps {
  readonly onDictionaryImported: (dictionary: Dictionary) => void;
}

function MenuDictionaryImportBridge({ onDictionaryImported }: MenuDictionaryImportBridgeProps) {
  const navigate = useNavigate();

  useEffect(
    () =>
      window.appMenu.onImportDictionary(() => {
        void importDictionaryFromFile()
          .then((dictionary) => {
            if (!dictionary) return;
            onDictionaryImported(dictionary);
            navigate("/dictionaries");
          })
          .catch(() => undefined);
      }),
    [navigate, onDictionaryImported],
  );

  return null;
}

export function App() {
  const [vocabulary, setVocabulary] = useState<readonly VocabularyEntry[]>([]);
  const [dictionaries, setDictionaries] = useState<readonly Dictionary[]>([]);
  const [currentDictionaryId, setCurrentDictionaryId] = useState("builtin.vocabulary-final");
  const [progress, setProgress] = useState(emptyProgress);
  const [dailyTarget, setDailyTarget] = useState<DailyTarget>(35);
  const [studyMode, setStudyMode] = useState<StudyMode>("en-to-zh");
  const [sessionIndex, setSessionIndex] = useState(0);
  const [reviewWordIds, setReviewWordIds] = useState<readonly number[]>([]);
  const [studyQueue, setStudyQueue] = useState<readonly VocabularyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    Promise.all([loadCurrentDictionary(), loadDictionaries()])
      .then(([context, dictionaryList]) => {
        setDictionaries(dictionaryList);
        setVocabulary(context.entries);
        setCurrentDictionaryId(context.dictionary.id);
        applyLearningState(context.learningState, context.entries.length);
      })
      .catch(() => setError("词库加载失败，请检查 resources/vocabulary_final.json。"));
  }, []);

  function applyLearningState(learningState: PersistedLearningState, totalWords: number) {
    setCurrentDictionaryId(learningState.currentDictionaryId);
    setDailyTarget(learningState.dailyTarget);
    setStudyMode(learningState.studyMode);
    setSessionIndex(learningState.sessionIndex);
    setReviewWordIds(learningState.reviewWordIds);
    setProgress({ totalWords, ...learningState.progress });
  }

  function handleAnswer(record: LearningRecord) {
    const nextIndex = Math.min(sessionIndex + 1, sessionVocabulary.length);
    if (!record.recognized) {
      setStudyQueue((currentQueue) => {
        const entry = currentQueue[sessionIndex];
        if (!entry) return currentQueue;
        const insertionIndex = Math.min(sessionIndex + 2, currentQueue.length);
        return [
          ...currentQueue.slice(0, insertionIndex),
          entry,
          ...currentQueue.slice(insertionIndex),
        ];
      });
    }
    void saveAnswer({ ...record, dictionaryId: currentDictionaryId }, nextIndex).then((learningState) => {
      applyLearningState(learningState, vocabulary.length);
    });
  }

  function handleDictionaryChange(dictionaryId: string): Promise<void> {
    return selectDictionary(dictionaryId).then((context) => {
      setVocabulary(context.entries);
      setCurrentDictionaryId(context.dictionary.id);
      setStudyQueue([]);
      setDictionaries((current) =>
        current.some((dictionary) => dictionary.id === context.dictionary.id)
          ? current
          : [...current, context.dictionary],
      );
      applyLearningState(context.learningState, context.entries.length);
    });
  }

  function handleDictionaryImported(dictionary: Dictionary) {
    setDictionaries((current) =>
      current.some((item) => item.id === dictionary.id) ? current : [...current, dictionary],
    );
  }

  function handleTargetChange(target: DailyTarget): Promise<void> {
    setDailyTarget(target);
    setSessionIndex((current) => getResumeIndex(current, target));
    return saveDailyTarget(target).then((learningState) => {
      applyLearningState(learningState, vocabulary.length);
    });
  }

  function handleModeChange(mode: StudyMode): Promise<void> {
    setStudyMode(mode);
    return saveStudyMode(mode).then((learningState) => {
      applyLearningState(learningState, vocabulary.length);
    });
  }

  const reviewKey = reviewWordIds.join(",");
  const baseStudyQueue = useMemo(
    () => getStudyQueue(vocabulary, dailyTarget, reviewWordIds),
    [vocabulary, dailyTarget, reviewKey],
  );

  useEffect(() => {
    setStudyQueue(baseStudyQueue);
  }, [baseStudyQueue]);

  if (error) {
    return <main className="error-screen">{error}</main>;
  }

  if (!vocabulary.length) {
    return <main className="loading-screen">正在加载词库…</main>;
  }

  const currentDictionary = dictionaries.find((dictionary) => dictionary.id === currentDictionaryId);
  if (!currentDictionary) {
    return <main className="loading-screen">正在加载当前词库…</main>;
  }

  const sessionVocabulary = studyQueue.length ? studyQueue : baseStudyQueue;

  return (
    <HashRouter>
      <MenuNavigationBridge />
      <MenuDictionaryImportBridge onDictionaryImported={handleDictionaryImported} />
      <Routes>
        <Route element={<AppShell progress={progress} dailyTarget={dailyTarget} sessionIndex={sessionIndex} />}>
          <Route
            path="/"
            element={
              <HomePage
                progress={progress}
                dailyTarget={dailyTarget}
                sessionIndex={sessionIndex}
                sessionLength={sessionVocabulary.length}
                currentDictionary={currentDictionary}
                onTargetChange={handleTargetChange}
                onStartSession={() => setSessionIndex(0)}
              />
            }
          />
          <Route
            path="/study"
            element={
              <StudyPage
                vocabulary={sessionVocabulary}
                startIndex={sessionIndex}
                mode={studyMode}
                onModeChange={handleModeChange}
                onIndexChange={setSessionIndex}
                onAnswer={handleAnswer}
              />
            }
          />
          <Route path="/stats" element={<StatsPage />} />
          <Route
            path="/dictionaries"
            element={
              <DictionaryManagementPage
                dictionaries={dictionaries}
                currentDictionaryId={currentDictionaryId}
                onDictionaryImported={handleDictionaryImported}
                onSelectDictionary={handleDictionaryChange}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                dailyTarget={dailyTarget}
                studyMode={studyMode}
                onTargetChange={handleTargetChange}
                onModeChange={handleModeChange}
              />
            }
          />
          <Route path="/settings/shortcuts" element={<KeyboardShortcutsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
