import { describe, expect, it } from "vitest";
import { AppearanceManager } from "./AppearanceManager";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

class AttributeRoot {
  private readonly attributes = new Map<string, string>();

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
}

describe("AppearanceManager", () => {
  it("uses Dark as the first-install default and removes the Light attribute", () => {
    const root = new AttributeRoot();
    root.setAttribute("data-theme", "light");
    const manager = new AppearanceManager(new MemoryStorage(), root);

    const theme = manager.loadTheme();
    manager.applyTheme(theme);

    expect(theme).toBe("dark");
    expect(root.getAttribute("data-theme")).toBeNull();
  });

  it("persists a Light selection and restores it through a new manager", () => {
    const storage = new MemoryStorage();
    const root = new AttributeRoot();
    const manager = new AppearanceManager(storage, root);

    manager.setTheme("light");

    expect(root.getAttribute("data-theme")).toBe("light");
    expect(new AppearanceManager(storage, new AttributeRoot()).loadTheme()).toBe("light");
  });

  it("keeps system reserved and falls back to Dark for unsupported stored values", () => {
    const storage = new MemoryStorage();
    storage.setItem("lexistudy.appearance.theme", "system");
    const manager = new AppearanceManager(storage, new AttributeRoot());

    expect(manager.loadTheme()).toBe("dark");
  });

  it("uses the DEV query preview without replacing the saved user theme", () => {
    const storage = new MemoryStorage();
    storage.setItem("lexistudy.appearance.theme", "dark");
    const manager = new AppearanceManager(storage, new AttributeRoot());

    expect(manager.getPreviewTheme("?theme=light", true)).toBe("light");
    expect(manager.getPreviewTheme("?theme=light", false)).toBeNull();
    expect(manager.loadTheme()).toBe("dark");
  });
});
