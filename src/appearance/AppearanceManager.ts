import { isSelectableTheme, themeRegistry, type SelectableTheme } from "./themeRegistry";

export const appearanceThemeStorageKey = "lexistudy.appearance.theme";

interface AppearanceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface ThemeRoot {
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

export class AppearanceManager {
  constructor(
    private readonly storage: AppearanceStorage,
    private readonly root: ThemeRoot,
  ) {}

  loadTheme(): SelectableTheme {
    const storedTheme = this.storage.getItem(appearanceThemeStorageKey);
    return isSelectableTheme(storedTheme) ? storedTheme : "dark";
  }

  setTheme(theme: SelectableTheme): void {
    this.storage.setItem(appearanceThemeStorageKey, theme);
    this.applyTheme(theme);
  }

  applyTheme(theme: SelectableTheme): void {
    const rootAttribute = themeRegistry[theme].rootAttribute;
    if (rootAttribute) {
      this.root.setAttribute("data-theme", rootAttribute);
      return;
    }
    this.root.removeAttribute("data-theme");
  }

  getPreviewTheme(search: string, isDevelopment: boolean): SelectableTheme | null {
    if (!isDevelopment) return null;
    const previewTheme = new URLSearchParams(search).get("theme");
    return isSelectableTheme(previewTheme) ? previewTheme : null;
  }
}

export function createAppearanceManager(): AppearanceManager {
  return new AppearanceManager(window.localStorage, document.documentElement);
}
