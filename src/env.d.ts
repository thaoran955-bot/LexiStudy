/// <reference types="vite/client" />

interface Window {
  desktopApp: {
    platform: string;
  };
  vocabulary: {
    load: () => Promise<unknown>;
  };
  learningData: {
    loadState: () => Promise<unknown>;
    setDailyTarget: (target: 35 | 50) => Promise<unknown>;
    setStudyMode: (mode: "en-to-zh" | "zh-to-en") => Promise<unknown>;
    recordAnswer: (answer: unknown) => Promise<unknown>;
  };
  statistics: {
    load: () => Promise<unknown>;
  };
  dictionaryData: {
    list: () => Promise<unknown>;
    importJson: (name: string, jsonText: string) => Promise<unknown>;
    importFile: (name?: string) => Promise<unknown>;
    loadCurrent: () => Promise<unknown>;
    select: (dictionaryId: string) => Promise<unknown>;
  };
  appMenu: {
    onNavigate: (listener: (target: "/study" | "/stats" | "/settings" | "/dictionaries") => void) => () => void;
    onImportDictionary: (listener: () => void) => () => void;
  };
}
