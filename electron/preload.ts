import { contextBridge, ipcRenderer } from "electron";
import type { AppNavigationTarget } from "./menu";

contextBridge.exposeInMainWorld("desktopApp", {
  platform: process.platform,
});

contextBridge.exposeInMainWorld("vocabulary", {
  load: () => ipcRenderer.invoke("vocabulary:load"),
});

contextBridge.exposeInMainWorld("learningData", {
  loadState: () => ipcRenderer.invoke("learning:load-state"),
  setDailyTarget: (target: 35 | 50) => ipcRenderer.invoke("learning:set-daily-target", target),
  setStudyMode: (mode: "en-to-zh" | "zh-to-en") => ipcRenderer.invoke("learning:set-study-mode", mode),
  recordAnswer: (answer: unknown) => ipcRenderer.invoke("learning:record-answer", answer),
});

contextBridge.exposeInMainWorld("statistics", {
  load: () => ipcRenderer.invoke("statistics:load"),
});

contextBridge.exposeInMainWorld("dictionaryData", {
  list: () => ipcRenderer.invoke("dictionary:list"),
  importJson: (name: string, jsonText: string) =>
    ipcRenderer.invoke("dictionary:import", { name, jsonText }),
  importFile: (name?: string) => ipcRenderer.invoke("dictionary:import-file", name),
  loadCurrent: () => ipcRenderer.invoke("dictionary:load-current"),
  select: (dictionaryId: string) => ipcRenderer.invoke("dictionary:select", dictionaryId),
});

contextBridge.exposeInMainWorld("appMenu", {
  onNavigate: (listener: (target: AppNavigationTarget) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, target: AppNavigationTarget) => {
      listener(target);
    };
    ipcRenderer.on("app:navigate", handler);
    return () => ipcRenderer.removeListener("app:navigate", handler);
  },
  onImportDictionary: (listener: () => void) => {
    const handler = () => listener();
    ipcRenderer.on("app:import-dictionary", handler);
    return () => ipcRenderer.removeListener("app:import-dictionary", handler);
  },
});
