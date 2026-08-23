# Theme System V2 P1 Home Progress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Light Mode Home Dashboard learning-progress percentage and completed ring use the Theme Accent while preserving Dark Mode and all Success-semantic progress surfaces.

**Architecture:** Keep the existing `--color-brand` variable as the implementation's Theme Accent/Brand mapping. Add Light Mode-only selectors scoped to the Home progress card; leave the existing Dark Mode Success declarations and shared Sidebar/Statistics progress declarations unchanged.

**Tech Stack:** React, Vite, TypeScript, CSS custom properties, Vitest.

**Spec:** `docs/theme-system-v2-freeze.md`, plus the P1 Hotfix request for the Home Dashboard learning-progress module.

## Global Constraints

- Modify color mapping only.
- Do not change layout, component structure, typography, spacing, interaction, or data behavior.
- Keep Known, Completion, Success Feedback, StudyPage, Statistics, and Sidebar Progress unchanged.
- Do not commit, push, tag, or create a branch.

---

### Task 1: Add a regression test for Home Light progress Accent mapping

**Files:**
- Create: `src/styles/global.test.ts`

- [x] **Step 1: Write the failing test**

Assert that the Light Mode Home progress card overrides the percentage and completed ring to `var(--color-brand)`, while the generic/Dark declarations still use `var(--color-success)`.

- [x] **Step 2: Run the focused test and verify it fails**

Run: `npm.cmd test -- --run src/styles/global.test.ts`

Expected: FAIL because the Light Mode Home progress override does not exist yet.

### Task 2: Implement the minimal Light Home color mapping

**Files:**
- Modify: `src/styles/global.css:192-195`

- [x] **Step 1: Add only Light Mode Home progress overrides**

Add selectors scoped to `:root[data-theme="light"] .home-page` and `body[data-theme="light"] .home-page` so that:

- `.large-number` uses `var(--color-brand)`.
- `.large-number small` uses `var(--color-brand-strong)`.
- `.progress-ring` uses `var(--color-brand)` for the completed conic-gradient segment.

Do not alter the shared `.progress-row`, `.progress-track`, `.stats-progress-track`, StudyPage, or feedback rules.

- [x] **Step 2: Run the focused test and verify it passes**

Run: `npm.cmd test -- --run src/styles/global.test.ts`

Expected: PASS.

### Task 3: Run project verification

**Files:**
- No additional source files.

- [x] **Step 1: Run all tests**

Run: `npm.cmd test -- --run`

Expected: all tests pass.

- [x] **Step 2: Build renderer and Electron output**

Run: `npm.cmd run build`

Expected: Vite renderer build and TypeScript Electron build exit successfully.

- [x] **Step 3: Check diff formatting**

Run: `git diff --check`

Expected: exit code 0.

- [x] **Step 4: Verify scope**

Run: `git diff --stat` and `git status --short`.

Expected: only the planned CSS/test/plan changes are attributable to this hotfix; no commit or push is performed.
