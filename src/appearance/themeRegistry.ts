export type Theme = "dark" | "light" | "system";
export type SelectableTheme = Exclude<Theme, "system">;

interface ThemeDefinition {
  readonly rootAttribute: string | null;
}

export const themeRegistry: Readonly<Record<SelectableTheme, ThemeDefinition>> = {
  dark: { rootAttribute: null },
  light: { rootAttribute: "light" },
};

export function isSelectableTheme(value: string | null): value is SelectableTheme {
  return value === "dark" || value === "light";
}
