import { useEffect, useState } from "react";
import { loadStatistics } from "../services/statisticsService";
import type { LearningStatistics } from "../types/statistics";
import { calculateRoundedPercentage } from "../utils/percentage";

export function StatsPage() {
  const [statistics, setStatistics] = useState<LearningStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadStatistics()
      .then((nextStatistics) => {
        if (active) setStatistics(nextStatistics);
      })
      .catch(() => {
        if (active) setError("统计数据加载失败，请稍后重试。");
      });
    return () => {
      active = false;
    };
  }, []);

  const maximumMasteryCount = statistics
    ? Math.max(...statistics.masteryDistribution.map((entry) => entry.count), 1)
    : 1;
  const percentage = statistics
    ? calculateRoundedPercentage(statistics.todayCompleted, statistics.todayTarget)
    : 0;
  const progressWidth = percentage;

  if (error) {
    return <section className="empty-panel stats-state"><span className="empty-icon">!</span><h2>{error}</h2></section>;
  }

  if (!statistics) {
    return <section className="empty-panel stats-state"><span className="empty-icon">…</span><h2>正在加载统计数据</h2></section>;
  }

  return (
    <div className="page-stack stats-page">
      <header className="page-header compact-header">
        <div>
          <span className="eyebrow">Statistics</span>
          <h1>学习统计</h1>
          <p>所有数据来自本地 SQLite，不会修改固定词库。</p>
        </div>
      </header>

      <div className="metric-grid stats-grid">
        <div className="metric-card"><span>总词数</span><strong>{statistics.totalWords}</strong><small>当前已载入的全部词汇</small></div>
        <div className="metric-card"><span>未学习</span><strong>{statistics.unlearnedWords}</strong><small>掌握等级 0</small></div>
        <div className="metric-card"><span>学习中</span><strong>{statistics.learningWords}</strong><small>掌握等级 1–2</small></div>
        <div className="metric-card"><span>已掌握</span><strong>{statistics.masteredWords}</strong><small>掌握等级 3–5</small></div>
      </div>

      <section className="stats-panel stats-target-panel">
        <div className="stats-panel-heading">
          <div><span className="section-label">Today</span><h2>今日学习目标</h2></div>
          <strong>{statistics.todayCompleted} / {statistics.todayTarget}</strong>
        </div>
        <div className="stats-progress-track"><span style={{ width: `${progressWidth}%` }} /></div>
        <div className="stats-target-meta">
          <span>今日已学习 {statistics.todayAnswered} 次</span>
          <span>{percentage}% 完成</span>
        </div>
      </section>

      <div className="stats-inline-metrics">
        <div className="stats-inline-card total-study-count"><span>总学习次数</span><strong>{statistics.totalStudyCount}</strong></div>
        <div className="stats-inline-card correct-rate"><span>总正确率</span><strong>{statistics.correctRate}%</strong></div>
      </div>

      <div className="stats-columns">
        <section className="stats-panel">
          <div className="stats-panel-heading"><div><span className="section-label">Mastery</span><h2>掌握等级分布</h2></div></div>
          <div className="mastery-list">
            {statistics.masteryDistribution.map((entry) => (
              <div className="mastery-row" key={entry.level}>
                <span>等级 {entry.level}</span>
                <div className="mastery-track"><span style={{ width: `${(entry.count / maximumMasteryCount) * 100}%` }} /></div>
                <strong>{entry.count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-panel error-ranking-panel">
          <div className="stats-panel-heading"><div><span className="section-label">Review</span><h2>错误次数最多</h2></div><span className="panel-caption">Top 20</span></div>
          {statistics.topErrors.length === 0 ? (
            <div className="stats-empty-message">暂时没有错误记录，继续保持。</div>
          ) : (
            <div className="error-list">
              {statistics.topErrors.map((entry, index) => (
                <div className="error-row" key={`${entry.dictionaryId}-${entry.wordId}`}>
                  <span className="error-rank">{index + 1}</span>
                  <div className="error-word"><strong>{entry.word}</strong><span>{entry.meaning}</span></div>
                  <div className="error-count"><strong>{entry.incorrectCount}</strong><span>次错误</span></div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
