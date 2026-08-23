import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const homePageSource = readFileSync(fileURLToPath(new URL("./HomePage.tsx", import.meta.url)), "utf8");

describe("Home daily-learning progress", () => {
  it("uses the Statistics daily-completed value instead of the persisted session index", () => {
    expect(homePageSource).toContain('import { loadStatistics } from "../services/statisticsService";');
    expect(homePageSource).toContain("const [todayCompleted, setTodayCompleted] = useState(0);");
    expect(homePageSource).toContain("todayCompleted={todayCompleted}");
  });
});
