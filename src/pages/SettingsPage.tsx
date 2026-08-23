import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppearance } from "../appearance/AppearanceContext";
import type { SelectableTheme } from "../appearance/themeRegistry";
import type { DailyTarget, StudyMode } from "../types/study";

interface SettingsPageProps {
  readonly dailyTarget: DailyTarget;
  readonly studyMode: StudyMode;
  readonly onTargetChange: (target: DailyTarget) => Promise<void>;
  readonly onModeChange: (mode: StudyMode) => Promise<void>;
}

const targetOptions: readonly DailyTarget[] = [35, 50];
const modeOptions: readonly { value: StudyMode; label: string; description: string }[] = [
  { value: "en-to-zh", label: "英译中", description: "看到英文，回忆中文释义" },
  { value: "zh-to-en", label: "中译英", description: "看到中文，回忆英文单词" },
];
const themeOptions: readonly { value: SelectableTheme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function SettingsPage({
  dailyTarget,
  studyMode,
  onTargetChange,
  onModeChange,
}: SettingsPageProps) {
  const { theme, setTheme } = useAppearance();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function saveSetting(action: () => Promise<void>, message: string) {
    setSaving(true);
    setNotice(null);
    void action()
      .then(() => setNotice(message))
      .catch(() => setNotice("保存失败，请重试。"))
      .finally(() => setSaving(false));
  }

  return (
    <div className="page-stack">
      <header className="page-header compact-header">
        <div>
          <span className="eyebrow">Preferences</span>
          <h1>设置</h1>
          <p>学习偏好会保存在本机 SQLite 中，外观偏好保存到本地配置。</p>
        </div>
      </header>

      <section className="settings-section">
        <div className="settings-section-heading">
          <span className="section-label">Appearance</span>
          <h2>外观</h2>
        </div>
        <div className="settings-list">
          <div className="setting-row settings-control-row">
            <div>
              <strong>主题</strong>
              <span>选择应用使用的外观主题。</span>
            </div>
            <div className="settings-options" aria-label="主题" role="radiogroup">
              {themeOptions.map((option) => (
                <button
                  aria-checked={theme === option.value}
                  className={theme === option.value ? "settings-option selected" : "settings-option"}
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value);
                    setNotice(`主题已切换为 ${option.label}。`);
                  }}
                  role="radio"
                  type="button"
                >
                  {theme === option.value ? "●" : "○"} {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <span className="section-label">Learning</span>
          <h2>学习偏好</h2>
        </div>
        <div className="settings-list">
          <div className="setting-row settings-control-row">
            <div>
              <strong>每日目标</strong>
              <span>选择每天开始学习的新词数量。</span>
            </div>
            <div className="settings-options">
              {targetOptions.map((target) => (
                <button
                  className={dailyTarget === target ? "settings-option selected" : "settings-option"}
                  disabled={saving}
                  key={target}
                  onClick={() => saveSetting(() => onTargetChange(target), `每日目标已保存为 ${target} 个。`)}
                  type="button"
                >
                  {target}
                </button>
              ))}
            </div>
          </div>
          <div className="setting-row settings-control-row">
            <div>
              <strong>默认学习模式</strong>
              <span>进入学习页时使用的正面和答案方向。</span>
            </div>
            <div className="settings-mode-options">
              {modeOptions.map((mode) => (
                <button
                  className={studyMode === mode.value ? "settings-mode selected" : "settings-mode"}
                  disabled={saving}
                  key={mode.value}
                  onClick={() => saveSetting(() => onModeChange(mode.value), `${mode.label}模式已保存。`)}
                  type="button"
                >
                  <strong>{mode.label}</strong>
                  <span>{mode.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <span className="section-label">Help & Data</span>
          <h2>帮助与本地数据</h2>
        </div>
        <div className="settings-list">
          <div className="setting-row">
            <div><strong>快捷键说明</strong><span>学习时使用键盘可以更快完成操作。</span></div>
            <Link className="settings-action" to="/settings/shortcuts">查看说明</Link>
          </div>
          <div className="setting-row">
            <div><strong>本地数据管理</strong><span>未来可在这里查看或管理本机学习数据。</span></div>
            <button className="settings-action muted-action" onClick={() => setNotice("本地数据管理入口已预留，当前版本暂不执行操作。")} type="button">功能预留</button>
          </div>
          <div className="setting-row">
            <div><strong>固定词库</strong><span>vocabulary_final.json 只读，程序不会修改它。</span></div>
            <span className="status-pill">本地只读</span>
          </div>
        </div>
      </section>

      <div className="settings-feedback" aria-live="polite">
        {saving ? "正在保存…" : notice ?? "学习偏好自动保存到 SQLite，外观偏好保存到本地配置。"}
      </div>
    </div>
  );
}
