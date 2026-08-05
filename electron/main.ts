import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import {
  createLearningDatabase,
  type AnswerInput,
  type BundledVocabularyEntry,
  type LearningDatabase,
} from "./database";
import { chooseDictionaryJsonFile } from "./dictionaryFileDialog";
import { parseImportedVocabularyJson } from "./dictionaryImport";
import {
  createApplicationMenuTemplate,
  type AppNavigationTarget,
} from "./menu";

const isDevelopment = Boolean(process.env.VITE_DEV_SERVER_URL);
const vocabularyPath = path.join(__dirname, "..", "resources", "vocabulary_final.json");
const iconPath = path.join(__dirname, "..", "assets", "icon.ico");
let learningDatabase: LearningDatabase | null = null;
let mainWindow: BrowserWindow | null = null;

async function loadBundledVocabulary(): Promise<readonly BundledVocabularyEntry[]> {
  const raw = await fs.readFile(vocabularyPath, "utf-8");
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) throw new Error("固定词库格式无效");
  const entries = parsed.map((entry) => {
    if (!entry || typeof entry !== "object") {
      throw new Error("固定词库格式无效");
    }
    const candidate = entry as Record<string, unknown>;
    if (
      !Number.isInteger(candidate.id) ||
      typeof candidate.word !== "string" ||
      typeof candidate.meaning !== "string"
    ) throw new Error("固定词库格式无效");
    return {
      id: candidate.id,
      word: candidate.word,
      meaning: candidate.meaning,
    } as BundledVocabularyEntry;
  });
  requireLearningDatabase().registerBundledVocabulary(entries);
  return entries;
}

ipcMain.handle("vocabulary:load", () => loadBundledVocabulary());

function requireLearningDatabase(): LearningDatabase {
  if (!learningDatabase) throw new Error("学习数据库尚未初始化");
  return learningDatabase;
}

ipcMain.handle("learning:load-state", async () => {
  await loadBundledVocabulary();
  return requireLearningDatabase().loadState();
});
ipcMain.handle("learning:set-daily-target", (_event, target: 35 | 50) => {
  requireLearningDatabase().setDailyTarget(target);
  return requireLearningDatabase().loadState();
});
ipcMain.handle("learning:set-study-mode", (_event, mode: "en-to-zh" | "zh-to-en") => {
  requireLearningDatabase().setStudyMode(mode);
  return requireLearningDatabase().loadState();
});
ipcMain.handle("learning:record-answer", (_event, answer: AnswerInput) => {
  requireLearningDatabase().recordAnswer(answer);
  return requireLearningDatabase().loadState();
});
ipcMain.handle("statistics:load", async () => {
  await loadBundledVocabulary();
  return requireLearningDatabase().loadStatistics();
});
ipcMain.handle("dictionary:list", async () => {
  await loadBundledVocabulary();
  return requireLearningDatabase().listDictionaries();
});
function loadCurrentDictionaryContext() {
  const database = requireLearningDatabase();
  return {
    dictionary: database.getCurrentDictionary(),
    entries: database.loadDictionaryWords(),
    learningState: database.loadState(),
  };
}

ipcMain.handle("dictionary:load-current", async () => {
  await loadBundledVocabulary();
  return loadCurrentDictionaryContext();
});
ipcMain.handle("dictionary:select", async (_event, dictionaryId: string) => {
  await loadBundledVocabulary();
  if (typeof dictionaryId !== "string" || !dictionaryId) {
    throw new Error("词库选择参数无效");
  }
  requireLearningDatabase().setCurrentDictionary(dictionaryId);
  return loadCurrentDictionaryContext();
});
ipcMain.handle(
  "dictionary:import",
  async (_event, input: { name: string; jsonText: string }) => {
    await loadBundledVocabulary();
    if (!input || typeof input.name !== "string" || typeof input.jsonText !== "string") {
      throw new Error("词库导入参数无效");
    }
    const entries = parseImportedVocabularyJson(input.jsonText);
    return requireLearningDatabase().importDictionary(input.name, entries);
  },
);
ipcMain.handle("dictionary:import-file", async (event, requestedName: unknown) => {
  await loadBundledVocabulary();
  if (requestedName !== undefined && typeof requestedName !== "string") {
    throw new Error("词库名称参数无效");
  }

  const parentWindow = BrowserWindow.fromWebContents(event.sender) ?? mainWindow;
  const selectedFilePath = await chooseDictionaryJsonFile((options) =>
    parentWindow ? dialog.showOpenDialog(parentWindow, options) : dialog.showOpenDialog(options),
  );
  if (!selectedFilePath) return null;

  const jsonText = await fs.readFile(selectedFilePath, "utf-8");
  const entries = parseImportedVocabularyJson(jsonText);
  const preferredName = typeof requestedName === "string" ? requestedName.trim() : "";
  const importedName = preferredName || path.basename(selectedFilePath, path.extname(selectedFilePath));
  return requireLearningDatabase().importDictionary(importedName, entries);
});

function createWindow() {
  const window = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 920,
    minHeight: 620,
    backgroundColor: "#101114",
    icon: iconPath,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow = window;
  window.on("closed", () => {
    if (mainWindow === window) mainWindow = null;
  });

  Menu.setApplicationMenu(
    Menu.buildFromTemplate(
      createApplicationMenuTemplate({
        navigate: (target: AppNavigationTarget) => {
          mainWindow?.webContents.send("app:navigate", target);
        },
        openDictionaryImport: () => {
          mainWindow?.webContents.send("app:import-dictionary");
        },
        showPlaceholder: (title: string) => {
          if (!mainWindow) return;
          void dialog.showMessageBox(mainWindow, {
            type: "info",
            title,
            message: `${title}功能将在后续阶段实现。`,
          });
        },
      }),
    ),
  );

  if (isDevelopment) {
    void window.loadURL(process.env.VITE_DEV_SERVER_URL!);
  } else {
    void window.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  learningDatabase = createLearningDatabase(path.join(app.getPath("userData"), "learning.sqlite"));
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  learningDatabase?.close();
  learningDatabase = null;
});
