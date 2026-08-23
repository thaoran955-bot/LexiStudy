import type { CSSProperties } from "react";
import type { DailyTarget } from "../types/study";
import { calculateRoundedPercentage } from "../utils/percentage";

interface ProgressCardProps {
  dailyTarget: DailyTarget;
  todayCompleted: number;
  totalWords: number;
}

export function ProgressCard({ dailyTarget, todayCompleted, totalWords }: ProgressCardProps) {
  const percentage = calculateRoundedPercentage(todayCompleted, dailyTarget);

  return (
    <section className="progress-card">
      <div>
        <span className="eyebrow">词库学习进度</span>
        <div className="large-number">{percentage}<small>%</small></div>
        <p>今日已学习 {Math.min(todayCompleted, dailyTarget)} 个词，目标 {dailyTarget} 个词</p>
      </div>
      <div className="progress-ring" style={{ "--progress": `${percentage * 3.6}deg` } as CSSProperties}>
        <span>{Math.min(todayCompleted, dailyTarget)}</span>
        <small>已学习</small>
      </div>
    </section>
  );
}
