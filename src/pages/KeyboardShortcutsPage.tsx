import { Link } from "react-router-dom";

const shortcuts = [
  { key: "Space", action: "显示答案" },
  { key: "←", action: "标记为不认识" },
  { key: "→", action: "标记为认识" },
  { key: "Esc", action: "返回首页" },
];

export function KeyboardShortcutsPage() {
  return (
    <div className="page-stack">
      <header className="page-header compact-header">
        <div>
          <span className="eyebrow">Keyboard</span>
          <h1>快捷键说明</h1>
          <p>学习过程中无需离开键盘即可完成操作。</p>
        </div>
        <Link className="secondary-button settings-back" to="/settings">返回设置</Link>
      </header>
      <section className="shortcut-panel">
        <div className="shortcut-list">
          {shortcuts.map((shortcut) => (
            <div className="shortcut-row" key={shortcut.key}>
              <kbd>{shortcut.key}</kbd>
              <span>{shortcut.action}</span>
            </div>
          ))}
        </div>
        <p className="shortcut-note">方向键需要在显示答案后使用；Space 用于先显示答案。</p>
      </section>
    </div>
  );
}
