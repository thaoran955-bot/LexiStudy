# Windows Vocabulary App

Windows 本地英语背词应用，使用 Electron、React、TypeScript、Vite 和 SQLite。

## 运行

需要安装 Node.js 20 或更高版本，并确保网络可访问 npm registry。

```powershell
npm install
npm run dev
```

构建检查：

```powershell
npm test -- --run
npm run build
```

固定词库位于 `resources/vocabulary_final.json`。该文件只读，学习记录不会写回词库。

当前支持每日 35/50 词目标、继续学习、英译中/中译英切换，以及 `Space`、`Left Arrow`、`Right Arrow`、`Esc` 快捷键。

学习数据保存在 Electron 的本地用户数据目录中，数据库文件名为 `learning.sqlite`。数据库会保存每日目标、学习模式、当前进度、学习记录和每个单词的次数统计；应用关闭后重新打开可以继续学习。

Electron 菜单栏已使用简体中文，包含词库、学习、统计、设置和帮助入口。当前“导入词库”和“管理词库”仅保留入口并显示功能预留提示，不会读取或合并外部 JSON。

多词库扩展接口位于 `src/types/dictionary.ts` 和 `src/services/dictionaryService.ts`。内置 `vocabulary_final.json` 通过固定的 `dictionaryId` 适配为 `dictionary`、`word` 和未来的 `learning_record` 数据边界，学习记录不绑定 JSON 文件名或路径。
