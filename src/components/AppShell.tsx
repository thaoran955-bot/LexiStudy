import { NavLink, Outlet } from "react-router-dom";
import type { LearningProgress } from "../types/learning";
import type { DailyTarget } from "../types/study";

interface AppShellProps {
  progress: LearningProgress;
  dailyTarget: DailyTarget;
  sessionIndex: number;
}

const navigation = [
  { to: "/dictionaries", label: "词库", icon: "▣" },
  { to: "/", label: "首页", icon: "⌂" },
  { to: "/study", label: "学习", icon: "▣" },
  { to: "/stats", label: "统计", icon: "◒" },
  { to: "/settings", label: "设置", icon: "⚙" },
];

export function AppShell({ progress, dailyTarget, sessionIndex }: AppShellProps) {
  const completion = dailyTarget
    ? Math.round((Math.min(sessionIndex, dailyTarget) / dailyTarget) * 100)
    : 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">字</span>
          <div>
            <strong>词汇学习</strong>
            <span>English vocabulary</span>
          </div>
        </div>
        <nav className="navigation" aria-label="主导航">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              key={item.to}
              to={item.to}
              end={item.to === "/"}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-progress">
          <div className="section-label">当前进度</div>
          <div className="progress-row">
            <strong>{completion}%</strong>
            <span>{Math.min(sessionIndex, dailyTarget)} / {dailyTarget}</span>
          </div>
          <div className="progress-track"><span style={{ width: `${completion}%` }} /></div>
        </div>
        <div className="sidebar-footer">本地模式 · 词库只读</div>
      </aside>
      <main className="content-area"><Outlet /></main>
    </div>
  );
}
