import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const globalCss = readFileSync(fileURLToPath(new URL("./global.css", import.meta.url)), "utf8");

describe("Home Light Mode progress color mapping", () => {
  it("uses the Light Theme Accent for the percentage and completed ring", () => {
    expect(globalCss).toContain(
      ':root[data-theme="light"] .home-page .large-number { color: var(--color-brand); }',
    );
    expect(globalCss).toContain(
      ':root[data-theme="light"] .home-page .large-number small { color: var(--color-brand-strong); }',
    );
    expect(globalCss).toContain(
      ':root[data-theme="light"] .home-page .progress-ring { background: conic-gradient(var(--color-brand) var(--progress), var(--color-track) 0); }',
    );
  });
});

describe("Sidebar current-progress theme mapping", () => {
  it("uses the Theme Accent instead of Success for the current-state number and track", () => {
    expect(globalCss).toContain(
      '.sidebar-progress .progress-row strong { color: var(--color-brand); font-size: calc(20px * var(--font-scale)); }',
    );
    expect(globalCss).toContain(
      '.sidebar-progress .progress-track span { display: block; height: 100%; border-radius: inherit; background: var(--color-brand); }',
    );
  });
});

describe("Statistics primary metric theme mapping", () => {
  it("uses Theme Accent for every dashboard primary visualization", () => {
    expect(globalCss).toContain(
      ".stats-target-panel .stats-panel-heading > strong { color: var(--color-brand); font-size: calc(24px * var(--font-scale)); }",
    );
    expect(globalCss).toContain(
      ".stats-target-panel .stats-progress-track span { display: block; height: 100%; border-radius: inherit; background: var(--color-brand); transition: width var(--duration-slow) var(--ease-standard); }",
    );
    expect(globalCss).toContain(
      ".stats-inline-card.total-study-count strong { color: var(--color-brand); }",
    );
    expect(globalCss).toContain(
      ".stats-inline-card.correct-rate strong { color: var(--color-brand); }",
    );
    expect(globalCss).toContain(
      ".mastery-track span { display: block; height: 100%; min-width: 2px; border-radius: inherit; background: var(--color-brand); }",
    );
  });

  it("maps Brand by theme while retaining Danger for error statistics", () => {
    expect(globalCss).toContain("--color-brand: #a8d94a;");
    expect(globalCss).toContain(':root[data-theme="light"], body[data-theme="light"] {');
    expect(globalCss).toContain("--color-brand: #0877d1;");
    expect(globalCss).toContain(
      ".error-count strong { color: var(--color-danger); font-size: var(--font-size-body); }",
    );
  });
});
