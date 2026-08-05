import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

export async function chooseDictionaryJsonFile(
  showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>,
): Promise<string | null> {
  const result = await showOpenDialog({
    title: "导入词库",
    properties: ["openFile"],
    filters: [{ name: "JSON 文件", extensions: ["json"] }],
  });

  return result.canceled ? null : result.filePaths[0] ?? null;
}
