# Dictionary Menu Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Chinese Electron application menu and reserve a multi-dictionary data boundary without changing the current learning flow or implementing JSON import.

**Architecture:** Keep `resources/vocabulary_final.json` as the read-only bundled source. Normalize it at the service boundary into a future `dictionary`/`word` model identified by `dictionaryId + wordId`; leave current learning persistence compatible. Expose a renderer navigation bridge for menu actions and keep import as a user-visible placeholder.

**Tech Stack:** Electron, React, TypeScript, Vite, Vitest, Electron built-in `node:sqlite`.

## Global Constraints

- Keep the existing `vocabulary_final.json` format compatible.
- Do not implement real JSON import or merge imported data.
- Do not bind learning records to a JSON filename or path.
- Do not change the existing learning flow or current SQLite progress behavior.
- Use simplified Chinese for every Electron application menu label.

### Task 1: Add dictionary model and reserved importer interface

**Files:**
- Create: `src/types/dictionary.ts`
- Create: `src/services/dictionaryService.ts`
- Test: `src/services/dictionaryService.test.ts`

**Interfaces:**
- `Dictionary` contains `id`, `name`, `source`, `createdAt`, and `wordCount`.
- `Word` contains `id`, `dictionaryId`, `word`, `meaning`, and `position`.
- `DictionaryImporter.importJson(filePath: string): Promise<Dictionary>` is reserved and rejects with a not-implemented error.
- `createBundledDictionary(entries)` and `normalizeBundledWords(entries)` adapt the current JSON shape without changing it.

- [ ] Write tests for bundled normalization and the reserved importer error.
- [ ] Run `npm.cmd test -- --run src/services/dictionaryService.test.ts` and verify the new tests fail before implementation.
- [ ] Implement the types, bundled adapter, and placeholder importer.
- [ ] Run the focused test again and verify it passes.

### Task 2: Add Chinese Electron menu and renderer navigation bridge

**Files:**
- Create: `electron/menu.ts`
- Create: `electron/menu.test.ts`
- Modify: `electron/main.ts`
- Modify: `electron/preload.ts`
- Modify: `src/env.d.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- `createApplicationMenuTemplate(actions)` returns the Chinese menu tree.
- `window.appMenu.onNavigate(listener)` subscribes to menu navigation and returns an unsubscribe function.
- Import, dictionary management, and help actions show a placeholder message; learning, statistics, and settings actions navigate to existing routes.

- [ ] Write tests asserting all required Chinese labels and route callbacks.
- [ ] Run the focused menu test and verify it fails before implementation.
- [ ] Implement the menu template, IPC event bridge, and React Router bridge.
- [ ] Run the focused menu test and the existing test suite.

### Task 3: Verify compatibility and stable startup

**Files:**
- Modify: `README.md`

- [ ] Document the reserved multi-dictionary boundary and the non-functional import menu.
- [ ] Run `npm.cmd test -- --run`.
- [ ] Run `npm.cmd run build`.
- [ ] Run `npm.cmd run dev` and verify the window opens without changing existing learning behavior.
