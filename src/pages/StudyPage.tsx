import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LearningRecord } from "../types/learning";
import { getAnswerText, getFrontText, handleStudyKeyDown } from "../types/study";
import type { StudyMode } from "../types/study";
import type { VocabularyEntry } from "../types/vocabulary";

interface StudyPageProps {
  vocabulary: readonly VocabularyEntry[];
  startIndex: number;
  mode: StudyMode;
  onModeChange: (mode: StudyMode) => void;
  onIndexChange: (index: number) => void;
  onAnswer: (record: LearningRecord) => void;
}

export function StudyPage({ vocabulary, startIndex, mode, onModeChange, onIndexChange, onAnswer }: StudyPageProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(startIndex);
  const [showAnswer, setShowAnswer] = useState(false);
  const entry = vocabulary[index];

  useEffect(() => {
    setIndex(startIndex);
    setShowAnswer(false);
  }, [startIndex]);

  const answer = useCallback((recognized: boolean) => {
    if (!entry) return;
    onAnswer({ wordId: entry.id, recognized, answeredAt: new Date().toISOString() });
    setShowAnswer(false);
    const nextIndex = Math.min(index + 1, vocabulary.length);
    setIndex(nextIndex);
    onIndexChange(nextIndex);
  }, [entry, index, onAnswer, onIndexChange, vocabulary.length]);

  const showAnswerRef = useRef(showAnswer);
  const answerRef = useRef(answer);
  const navigateRef = useRef(navigate);
  showAnswerRef.current = showAnswer;
  answerRef.current = answer;
  navigateRef.current = navigate;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      handleStudyKeyDown(event, showAnswerRef.current, {
        showAnswer: () => setShowAnswer(true),
        markKnown: () => answerRef.current(true),
        markUnknown: () => answerRef.current(false),
        goHome: () => navigateRef.current("/"),
      });
    }

    const captureOptions = { capture: true, passive: false };
    window.addEventListener("keydown", handleKeyDown, captureOptions);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, captureOptions);
    };
  }, []);

  if (!entry) {
    return (
      <div className="page-stack study-page">
        <section className="empty-panel study-complete">
          <span className="empty-icon">✓</span>
          <h2>今日目标已完成</h2>
          <p>你已完成本轮 {vocabulary.length} 个新词。</p>
          <button className="primary-button" onClick={() => { onIndexChange(0); setIndex(0); }}>再学一轮 <span>↻</span></button>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack study-page">
      <header className="page-header compact-header">
        <div><span className="eyebrow">学习中</span><h1>新词练习</h1></div>
        <div className="study-tools">
          <button className={mode === "en-to-zh" ? "mode-button active" : "mode-button"} onClick={() => onModeChange("en-to-zh")}>英译中</button>
          <button className={mode === "zh-to-en" ? "mode-button active" : "mode-button"} onClick={() => onModeChange("zh-to-en")}>中译英</button>
          <span className="study-counter">{index + 1} / {vocabulary.length}</span>
        </div>
      </header>
      <section className="word-card">
        <span className="word-index">WORD {String(entry.id).padStart(4, "0")}</span>
        <h2 className={mode === "zh-to-en" ? "front-meaning" : ""}>{getFrontText(entry, mode)}</h2>
        {showAnswer ? <p className="meaning">{getAnswerText(entry, mode)}</p> : <p className="hidden-meaning">准备好后查看答案</p>}
        <button className="answer-button" onClick={() => setShowAnswer(true)} disabled={showAnswer}>显示答案 <span>Space</span></button>
      </section>
      <div className="answer-actions">
        <button className="secondary-button unknown" onClick={() => answer(false)} disabled={!showAnswer}>不认识 <span>←</span></button>
        <button className="secondary-button known" onClick={() => answer(true)} disabled={!showAnswer}>认识 <span>→</span></button>
      </div>
      <p className="phase-note">答题记录自动保存到本地 SQLite，固定词库文件保持只读。</p>
    </div>
  );
}
