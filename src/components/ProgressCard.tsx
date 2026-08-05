import type { CSSProperties } from "react";
import type { DailyTarget } from "../types/study";

interface ProgressCardProps {
  dailyTarget: DailyTarget;
  sessionIndex: number;
  totalWords: number;
}

export function ProgressCard({ dailyTarget, sessionIndex, totalWords }: ProgressCardProps) {
  const percentage = dailyTarget
    ? Math.round((Math.min(sessionIndex, dailyTarget) / dailyTarget) * 100)
    : 0;

  return (
    <section className="progress-card">
      <div>
        <span className="eyebrow">词库学习进度</span>
        <div className="large-number">{percentage}<small>%</small></div>
        <p>今日已学习 {Math.min(sessionIndex, dailyTarget)} 个词，目标 {dailyTarget} 个词</p>
      </div>
      <div className="progress-ring" style={{ "--progress": `${percentage * 3.6}deg` } as CSSProperties}>
        <span>{Math.min(sessionIndex, dailyTarget)}</span>
        <small>已学习</small>
      </div>
    </section>
  );
}
