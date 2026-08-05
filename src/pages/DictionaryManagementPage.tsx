import { useEffect, useState } from "react";
import { importDictionaryFromFile } from "../services/dictionaryService";
import type { Dictionary } from "../types/dictionary";

interface DictionaryManagementPageProps {
  readonly dictionaries: readonly Dictionary[];
  readonly currentDictionaryId: string;
  readonly onSelectDictionary: (dictionaryId: string) => Promise<void>;
  readonly onDictionaryImported: (dictionary: Dictionary) => void;
}

export function DictionaryManagementPage({
  dictionaries: availableDictionaries,
  currentDictionaryId,
  onSelectDictionary,
  onDictionaryImported,
}: DictionaryManagementPageProps) {
  const [dictionaries, setDictionaries] = useState<readonly Dictionary[]>(availableDictionaries);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => setDictionaries(availableDictionaries), [availableDictionaries]);

  async function handleImport() {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const imported = await importDictionaryFromFile(name.trim() || undefined);
      if (!imported) return;
      setDictionaries((current) => [...current, imported]);
      onDictionaryImported(imported);
      setName("");
      setMessage(`“${imported.name}”已导入，包含 ${imported.wordCount} 个单词。`);
    } catch {
      setError("导入失败，请检查 JSON 格式、单词 id 和词库名称。");
    } finally {
      setBusy(false);
    }
  }

  async function handleSelect(dictionaryId: string) {
    if (dictionaryId === currentDictionaryId) return;
    setSelectingId(dictionaryId);
    setMessage(null);
    setError(null);
    try {
      await onSelectDictionary(dictionaryId);
      const selected = dictionaries.find((dictionary) => dictionary.id === dictionaryId);
      setMessage(`当前词库已切换为“${selected?.name ?? dictionaryId}”。`);
    } catch {
      setError("词库切换失败，请重试。");
    } finally {
      setSelectingId(null);
    }
  }

  return (
    <div className="page-stack dictionary-page">
      <header className="page-header compact-header">
        <div>
          <span className="eyebrow">Dictionary</span>
          <h1>词库管理</h1>
          <p>导入的词库会独立保存，不会修改固定词库或已有学习记录。</p>
        </div>
      </header>

      <section className="dictionary-import-panel">
        <div className="settings-section-heading">
          <span className="section-label">Import JSON</span>
          <h2>导入词库</h2>
        </div>
        <div className="dictionary-import-form">
          <label className="dictionary-field">
            <span>词库名称</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：雅思词汇" />
          </label>
          <div className="dictionary-file-field">
            <span>JSON 文件</span>
            <small>点击“导入词库”后选择包含 id、word、meaning 的 JSON 文件</small>
          </div>
          <button className="primary-button dictionary-import-button" disabled={busy} onClick={() => void handleImport()} type="button">
            {busy ? "导入中…" : "导入词库"}
          </button>
        </div>
        <div aria-live="polite" className="dictionary-feedback">
          {error ?? message ?? "格式：[{ id, word, meaning }]。不会自动合并或去重。"}
        </div>
      </section>

      <section className="dictionary-list-section">
        <div className="settings-section-heading">
          <span className="section-label">Library</span>
          <h2>我的词库</h2>
        </div>
        {dictionaries.length === 0 ? (
          <div className="empty-panel dictionary-state">暂无词库。</div>
        ) : (
          <div className="dictionary-list">
            {dictionaries.map((dictionary) => (
              <article className="dictionary-card" key={dictionary.id}>
                <div className="dictionary-card-icon">{dictionary.source === "bundled" ? "▣" : "＋"}</div>
                <div className="dictionary-card-content">
                  <strong>{dictionary.name}</strong>
                  <span>{dictionary.wordCount} 个单词</span>
                </div>
                <div className="dictionary-card-actions">
                  <span className={dictionary.source === "bundled" ? "status-pill" : "status-pill imported-pill"}>
                    {dictionary.source === "bundled" ? "内置" : "用户导入"}
                  </span>
                  {dictionary.id === currentDictionaryId ? (
                    <span className="current-dictionary-pill">当前使用</span>
                  ) : (
                    <button
                      className="dictionary-select-button"
                      disabled={selectingId !== null}
                      onClick={() => void handleSelect(dictionary.id)}
                      type="button"
                    >
                      {selectingId === dictionary.id ? "切换中…" : "使用此词库"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
