# Windows Vocabulary App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable Windows-local Electron + React + TypeScript + Vite skeleton that loads the fixed vocabulary JSON and exposes four basic pages.

**Architecture:** Electron main process owns the window and read-only vocabulary file access. Preload exposes a narrow IPC API to the React renderer. React owns page layout and presentation; learning persistence is represented by an interface only and does not write to the vocabulary file.

**Tech Stack:** Electron, React, TypeScript, Vite, React Router, Vitest.

## Global Constraints

- `vocabulary_final.json` is a fixed read-only resource and must never be modified at runtime.
- Learning data is separate from the vocabulary file.
- No accounts, cloud sync, network requests, or online services.
- Preserve vocabulary `id`, `word`, `meaning`, and source order.
- First phase does not implement SQLite or the full review algorithm.

### Task 1: Scaffold the Electron/Vite project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/env.d.ts`
- Create: `src/main.tsx`
- Create: `electron/main.ts`
- Create: `electron/preload.ts`
- Copy: `resources/vocabulary_final.json`

- [ ] Add scripts for `dev`, `build`, `preview`, and `test`.
- [ ] Configure Vite to serve React and build the renderer.
- [ ] Configure Electron entry points and preload output.
- [ ] Copy the fixed vocabulary file into `resources/` without changing its contents.
- [ ] Run `npm install` and confirm the dependency graph resolves.

### Task 2: Add typed read-only vocabulary loading

**Files:**
- Create: `src/types/vocabulary.ts`
- Create: `src/services/vocabularyService.ts`
- Create: `src/services/vocabularyService.test.ts`
- Modify: `electron/main.ts`
- Modify: `electron/preload.ts`
- Modify: `src/env.d.ts`

- [ ] Write tests for valid vocabulary validation and rejection of malformed entries.
- [ ] Run the focused tests and confirm they fail before implementation.
- [ ] Implement `VocabularyEntry`, `validateVocabulary`, and the read-only `loadVocabulary` interface.
- [ ] Expose `window.vocabulary.load()` through preload IPC.
- [ ] Run focused tests and confirm they pass.

### Task 3: Add future learning-data boundary

**Files:**
- Create: `src/types/learning.ts`
- Create: `src/services/learningDataService.ts`
- Create: `src/services/learningDataService.test.ts`

- [ ] Define `LearningRecord`, `LearningProgress`, and `LearningDataStore` interfaces.
- [ ] Write a test proving the in-memory implementation records a result without changing vocabulary data.
- [ ] Run the focused test and confirm it fails before implementation.
- [ ] Implement the minimal in-memory store for this phase.
- [ ] Run the focused test and confirm it passes.

### Task 4: Build the four-page dark application shell

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/AppShell.tsx`
- Create: `src/components/ProgressCard.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/StudyPage.tsx`
- Create: `src/pages/StatsPage.tsx`
- Create: `src/pages/SettingsPage.tsx`
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`

- [ ] Add routes for `/`, `/study`, `/stats`, and `/settings`.
- [ ] Load the fixed vocabulary once at app startup and pass the read-only collection to pages.
- [ ] Show total vocabulary count and zero progress on the home page.
- [ ] Show the first word, answer reveal, and placeholder recognition buttons on the study page.
- [ ] Add placeholder cards for statistics and settings.
- [ ] Style the shell with a dark, compact, Anki-like layout.

### Task 5: Verify the runnable first phase

**Files:**
- Modify: `README.md`

- [ ] Document prerequisites and `npm run dev`.
- [ ] Run `npm test -- --run` and confirm all tests pass.
- [ ] Run `npm run build` and confirm renderer and Electron TypeScript compilation succeeds.
- [ ] Confirm the fixed JSON file remains byte-identical after running the app/build commands.
- [ ] Report the file structure, commands, and current feature boundary, then stop for confirmation.
