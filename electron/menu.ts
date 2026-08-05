import type { MenuItemConstructorOptions } from "electron";

export type AppNavigationTarget = "/study" | "/stats" | "/settings" | "/dictionaries";

export interface ApplicationMenuActions {
  navigate: (target: AppNavigationTarget) => void;
  openDictionaryImport: () => void;
  showPlaceholder: (title: string) => void;
}

export function createApplicationMenuTemplate(
  actions: ApplicationMenuActions,
): MenuItemConstructorOptions[] {
  return [
    {
      label: "词库",
      submenu: [
        { label: "导入词库", click: () => actions.openDictionaryImport() },
        { label: "管理词库", click: () => actions.navigate("/dictionaries") },
      ],
    },
    {
      label: "学习",
      submenu: [
        { label: "继续学习", click: () => actions.navigate("/study") },
        { label: "开始今日学习", click: () => actions.navigate("/study") },
      ],
    },
    { label: "统计", click: () => actions.navigate("/stats") },
    { label: "设置", click: () => actions.navigate("/settings") },
    { label: "帮助", click: () => actions.showPlaceholder("帮助") },
  ];
}
