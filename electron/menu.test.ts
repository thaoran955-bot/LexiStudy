import { describe, expect, it, vi } from "vitest";
import { createApplicationMenuTemplate } from "./menu";

describe("application menu", () => {
  it("defines the required simplified Chinese labels", () => {
    const template = createApplicationMenuTemplate({
      navigate: vi.fn(),
      openDictionaryImport: vi.fn(),
      showPlaceholder: vi.fn(),
    });

    expect(template.map((item) => item.label)).toEqual(["词库", "学习", "统计", "设置", "帮助"]);
    expect((template[0].submenu as { label?: string }[]).map((item) => item.label)).toEqual([
      "导入词库",
      "管理词库",
    ]);
    expect((template[1].submenu as { label?: string }[]).map((item) => item.label)).toEqual([
      "继续学习",
      "开始今日学习",
    ]);
  });

  it("routes dictionary actions to dictionary management", () => {
    const navigate = vi.fn();
    const openDictionaryImport = vi.fn();
    const showPlaceholder = vi.fn();
    const template = createApplicationMenuTemplate({ navigate, openDictionaryImport, showPlaceholder });
    const invoke = (item: { click?: (...args: never[]) => void }) => item.click?.();

    invoke(template[0].submenu![0] as { click?: (...args: never[]) => void });
    invoke(template[1].submenu![0] as { click?: (...args: never[]) => void });
    invoke(template[1].submenu![1] as { click?: (...args: never[]) => void });
    invoke(template[2]);
    invoke(template[3]);

    expect(showPlaceholder).not.toHaveBeenCalled();
    expect(openDictionaryImport).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenNthCalledWith(1, "/study");
    expect(navigate).toHaveBeenNthCalledWith(2, "/study");
    expect(navigate).toHaveBeenNthCalledWith(3, "/stats");
    expect(navigate).toHaveBeenNthCalledWith(4, "/settings");
  });
});
