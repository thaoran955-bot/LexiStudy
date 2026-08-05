import { describe, expect, it, vi } from "vitest";
import { chooseDictionaryJsonFile } from "./dictionaryFileDialog";

describe("chooseDictionaryJsonFile", () => {
  it("returns the file selected from the Windows dialog", async () => {
    const showOpenDialog = vi.fn().mockResolvedValue({
      canceled: false,
      filePaths: ["C:\\test-data\\sample-vocabulary.json"],
    });

    await expect(chooseDictionaryJsonFile(showOpenDialog)).resolves.toBe(
      "C:\\test-data\\sample-vocabulary.json",
    );
  });

  it("returns null when the user cancels the Windows dialog", async () => {
    const showOpenDialog = vi.fn().mockResolvedValue({ canceled: true, filePaths: [] });

    await expect(chooseDictionaryJsonFile(showOpenDialog)).resolves.toBeNull();
  });
});
