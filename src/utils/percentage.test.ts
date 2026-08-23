import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { calculateRoundedPercentage } from "./percentage";

const progressCardSource = readFileSync(
  fileURLToPath(new URL("../components/ProgressCard.tsx", import.meta.url)),
  "utf8",
);
const statsPageSource = readFileSync(
  fileURLToPath(new URL("../pages/StatsPage.tsx", import.meta.url)),
  "utf8",
);

describe("rounded percentage formatting", () => {
  it.each([
    [1, 35, 3],
    [2, 35, 6],
    [18, 35, 51],
    [35, 35, 100],
  ])("rounds %i / %i to %i%%", (completed, target, expected) => {
    expect(calculateRoundedPercentage(completed, target)).toBe(expected);
  });

  it("returns zero when the target cannot produce a finite percentage", () => {
    expect(calculateRoundedPercentage(1, 0)).toBe(0);
    expect(calculateRoundedPercentage(1, Number.NaN)).toBe(0);
  });

  it("is shared by Home and Statistics", () => {
    expect(progressCardSource).toContain(
      'import { calculateRoundedPercentage } from "../utils/percentage";',
    );
    expect(progressCardSource).toContain(
      "const percentage = calculateRoundedPercentage(todayCompleted, dailyTarget);",
    );
    expect(statsPageSource).toContain(
      'import { calculateRoundedPercentage } from "../utils/percentage";',
    );
    expect(statsPageSource).toContain(
      "calculateRoundedPercentage(statistics.todayCompleted, statistics.todayTarget)",
    );
  });
});
