import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createAppearanceManager, type AppearanceManager } from "./AppearanceManager";
import type { SelectableTheme } from "./themeRegistry";

interface AppearanceContextValue {
  readonly theme: SelectableTheme;
  readonly setTheme: (theme: SelectableTheme) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

interface AppearanceProviderProps {
  readonly children: React.ReactNode;
}

export function AppearanceProvider({ children }: AppearanceProviderProps) {
  const managerRef = useRef<AppearanceManager | null>(null);
  if (!managerRef.current) managerRef.current = createAppearanceManager();
  const manager = managerRef.current;
  const [theme, setStoredTheme] = useState<SelectableTheme>(() => manager.loadTheme());
  const previewTheme = manager.getPreviewTheme(window.location.search, import.meta.env.DEV);
  const appliedTheme = previewTheme ?? theme;

  useEffect(() => {
    manager.applyTheme(appliedTheme);
  }, [appliedTheme, manager]);

  const setTheme = useCallback((nextTheme: SelectableTheme) => {
    manager.setTheme(nextTheme);
    setStoredTheme(nextTheme);
  }, [manager]);

  const value = useMemo(() => ({ theme, setTheme }), [setTheme, theme]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const appearance = useContext(AppearanceContext);
  if (!appearance) throw new Error("useAppearance must be used within AppearanceProvider");
  return appearance;
}
