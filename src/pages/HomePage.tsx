import { Link } from "react-router-dom";
import { ProgressCard } from "../components/ProgressCard";
import type { Dictionary } from "../types/dictionary";
import type { LearningProgress } from "../types/learning";
import type { DailyTarget } from "../types/study";

interface HomePageProps {
  progress: LearningProgress;
  dailyTarget: DailyTarget;
  sessionIndex: number;
  sessionLength: number;
  currentDictionary: Dictionary;
  onTargetChange: (target: DailyTarget) => void;
  onStartSession: () => void;
}

export function HomePage({ progress, dailyTarget, sessionIndex, sessionLength, currentDictionary, onTargetChange, onStartSession }: HomePageProps) {
  const hasProgress = sessionIndex > 0 && sessionIndex < sessionLength;
  const isComplete = sessionIndex >= sessionLength;

  return (
    <div className="page-stack home-page">
      <header className="page-header home-hero">
        <div>
          <span className="eyebrow">Good morning</span>
          <h1>今天，开始一点点进步。</h1>
          <p>保持节奏，完成今天的 {dailyTarget} 个新词目标。</p>
        </div>
        <Link className="primary-button" to="/study" onClick={() => { if (isComplete) onStartSession(); }}>
          {hasProgress ? "继续学习" : isComplete ? "再学一轮" : "开始学习"} <span>→</span>
        </Link>
      </header>
      <section className="current-dictionary-panel dictionary-context">
        <div>
          <span className="eyebrow">当前词库</span>
          <h2>{currentDictionary.name}</h2>
          <p>{currentDictionary.wordCount} 个单词 · {currentDictionary.source === "bundled" ? "内置词库" : "用户导入"}</p>
        </div>
        <Link className="secondary-button" to="/dictionaries">选择词库 <span>→</span></Link>
      </section>
      <div className="home-focus-grid">
        <div className="home-progress">
          <ProgressCard dailyTarget={dailyTarget} sessionIndex={sessionIndex} totalWords={progress.totalWords} />
        </div>
        <section className="target-panel">
          <div>
            <span className="eyebrow">今日目标</span>
            <h2>选择今天要学习的新词数量</h2>
          </div>
          <div className="target-options">
            {[35, 50].map((target) => (
              <button
                className={dailyTarget === target ? "target-option selected" : "target-option"}
                key={target}
                onClick={() => onTargetChange(target as DailyTarget)}
              >
                <strong>{target}</strong><span>个新词</span>
              </button>
            ))}
          </div>
        </section>
      </div>
      <div className="metric-grid home-metrics">
        <div className="metric-card"><span>词库总数</span><strong>{progress.totalWords}</strong><small>固定本地词库</small></div>
        <div className="metric-card"><span>今日已学</span><strong>{sessionIndex}</strong><small>本地 SQLite 记录</small></div>
        <div className="metric-card"><span>认识</span><strong>{progress.recognizedWords}</strong><small>已保存答题记录</small></div>
      </div>
      <section className="info-panel home-guidance">
        <div>
          <span className="eyebrow">学习提示</span>
          <h2>每次只专注一个单词</h2>
          <p>先回忆，再查看释义。后续阶段会加入复习调度。</p>
        </div>
        <span className="info-icon">✦</span>
      </section>
    </div>
  );
}
