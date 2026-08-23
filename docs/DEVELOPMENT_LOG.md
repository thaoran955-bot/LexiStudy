# LexiStudy Development Log

## 2026-08-24 — v0.2.0 Final Release Freeze

### Date

2026-08-24

### Version

v0.2.0

### Stage

Final Release Freeze · Final Acceptance Passed

### Goal

Freeze the accepted v0.2.0 workspace and release artifact after final automated verification, installed-app validation, Theme review, metric consistency review, and AAA manual acceptance.

### Changes

- Completed and froze the StudyPage UI and Word Card Visual Design V2.2 implementation.
- Implemented Theme System V2 with a Single Accent per theme: Dark = Black + Green; Light = White + Blue.
- Added `AppearanceManager`, Theme Registry, `AppearanceProvider`, Settings Theme Switch, and persisted Light/Dark selection.
- Corrected Home, Sidebar, and Statistics primary visualizations to use Theme Brand/Accent rather than Success semantics.
- Unified Home and Statistics daily-learning data through `statistics:load` and `todayCompleted`.
- Added `calculateRoundedPercentage()` so Home and Statistics display the same integer-rounded daily percentage.
- Generated and inspected the final `LexiStudy-Setup-0.2.0.exe` release artifact.

### Problems

1. The original Theme mapping allowed Blue and Green to compete as primary accents.
2. Light Mode Home learning progress incorrectly used Success Green.
3. Light Mode Sidebar current progress incorrectly used Success Green.
4. Statistics treated dashboard metrics as Success semantics, leaving Green primary visualizations in Light Mode.
5. Theme switching initially lacked a single lifecycle owner and an approved persistence path.
6. Source and renderer output advanced while an older Installer still contained a stale Renderer Bundle.
7. Home used `sessionIndex` for “今日已学”, while Statistics used date-filtered learning records.
8. Home rounded daily progress to an integer while Statistics displayed one decimal place.

### Root Causes

1. Brand and Success responsibilities were not separated at the Theme-system level.
2. Home primary progress was classified as completion feedback instead of dashboard Accent.
3. `.sidebar-progress .progress-row strong` and `.sidebar-progress .progress-track span` referenced `--color-success`.
4. Total accuracy and mastery distribution were classified as positive results rather than Dashboard Primary Visualization.
5. Theme writes and persistence were not yet centralized under an application-level Appearance owner.
6. `npm.cmd run build` refreshed `dist`, but did not regenerate the Windows Installer.
7. `sessionIndex` is a cross-date study-queue resume position, not a date-scoped completed-learning metric.
8. Home calculated `Math.round(...)` locally, while Statistics rendered the one-decimal `todayProgress` value directly.

### Resolutions

1. Adopted Theme System V2 Single Accent rules and separated Accent, Success, Danger, Warning, and Neutral responsibilities.
2. Mapped Home primary progress to Theme Brand: Dark Green, Light Blue.
3. Mapped both Sidebar current-progress selectors to `--color-brand`.
4. Mapped Today Target, Total Study Count, Total Accuracy, and Mastery Distribution to `--color-brand`.
5. Established `AppearanceManager`, Theme Registry, and `AppearanceProvider`; persisted selection in `localStorage["lexistudy.appearance.theme"]`.
6. Required fresh Windows Packaging and `app.asar`/Renderer Bundle inspection before installed-artifact acceptance.
7. Made Home reuse `statistics:load` / `todayCompleted`, matching Statistics.
8. Added shared `calculateRoundedPercentage()` using `Math.round(todayCompleted / dailyTarget * 100)` with zero-target and non-finite-input protection.

### Decisions

- Dark Theme uses Black + Green as its single Accent system.
- Light Theme uses White + Blue as its single Accent system.
- Success Green is reserved for explicit Known, Completion, Success Feedback, and completed-state semantics.
- Statistics dashboard metrics follow Theme Accent even when their values are positive.
- `AppearanceManager` is the only Theme lifecycle owner.
- Public Theme options are `dark` and `light`; `system` remains reserved and unavailable.
- Runtime and installed-artifact evidence take precedence over source inspection and reports.
- No Git tag, commit, or push is part of this Release Freeze task.

### Verification

- Automated tests: 13 test files, 46 tests passed.
- Renderer Build: PASS.
- Electron TypeScript Build: PASS.
- `git diff --check`: PASS; only existing LF-to-CRLF notices were reported.
- Final Installer: `LexiStudy-Setup-0.2.0.exe`.
- Installer SHA-256: `5B9A72B9F6ED03D4075C480E7C2F7E3D7E42666CFCDDCF8818355240B8265DB2`.

### Manual Acceptance

AAA completed final installed-app acceptance. Theme switching and persistence, Home/Sidebar/Statistics Theme mappings, StudyPage, daily metric consistency, dynamic updates, and integer percentage consistency passed.

### Known Risks

- P0: 0.
- P1: 0.
- The Git worktree remains intentionally unfinalized and requires a separate AAA-authorized Git Finalization step.

### Lessons Learned

- A positive dashboard value is not automatically a Success semantic.
- Shared metrics require shared data sources and shared presentation formatters.
- A successful Build does not prove an existing Installer contains current code.
- Release acceptance must inspect the packaged Renderer and test the installed application.
- Release documentation and archive integrity are part of the release artifact, not optional follow-up work.

### Release Status

**FINAL ACCEPTANCE PASSED — FINAL RELEASE FREEZE**

## 2026-08-22 — v0.2.0

### Stage

Theme System V2 · Sidebar Progress Hotfix · Release Packaging · Manual Verification Preparation

### Goal

Prepare the v0.2.0 Windows installer from the current workspace, including Theme System V2, Appearance System v1.0, the StudyPage UI freeze, and the verified Sidebar Progress color correction.

### Changes

- Promoted the application and NSIS installer version from `0.1.1` to `0.2.0` through the package version source.
- Retained Theme System V2 and Appearance System v1.0 in the v0.2.0 release candidate.
- Corrected the Sidebar current-progress number and fill to use the Theme Accent token.
- Prepared automated verification, Windows packaging, and manual verification handoff for v0.2.0.

### Problems

Light Mode Sidebar lower-left “当前进度” displayed Success Green, creating a White + Blue + Green primary-accent mix.

### Root Cause

The Sidebar Progress current-state number and progress-fill styles used `--color-success`, even though the region presents current primary status rather than a success outcome.

### Resolution

Updated `.sidebar-progress .progress-row strong` and `.sidebar-progress .progress-track span` from `--color-success` to `--color-brand`.

- Dark: `--color-brand` resolves to Green Accent.
- Light: `--color-brand` resolves to Blue Accent.

Known, completion, feedback, and other Success semantics remain unchanged.

### Decision

- Keep Theme System V2 as the release color authority.
- Treat Sidebar current progress as Accent/primary status, not Success semantics.
- Mark v0.2.0 as **Manual Verification Pending** until AAA completes installation and runtime visual acceptance.
- Do not create a v0.2.0 Git tag before AAA release approval.

### Lessons Learned

- Token semantics must be reviewed per component state; green visual output alone does not establish a Success role.
- Packaging and installed-artifact inspection are required after release-facing source or version changes.

### Related Documents

- `docs/theme-system-v2-freeze.md`
- `docs/theme-switch-system-v1-migration-report.md`
- `docs/v0.2.0-learning-page-final-verification-record.md`
- Theme System V2 P1 Sidebar Progress Hotfix Report


## 2026-08-19 — v0.1.1

### Stage

Theme System V2 · Appearance System v1.0 · StudyPage UI Freeze · Release Packaging

### Goal

Complete the Theme System V2 migration, freeze the StudyPage visual implementation, add user-controlled Light/Dark appearance switching, and produce a Windows release installer for manual acceptance.

### Changes

- Completed Theme System V2 review and visual verification.
- Applied the Single Accent Theme decision: Dark uses Black + Green; Light uses White + Blue.
- Added `AppearanceManager`, `AppearanceProvider`, and Theme Switch controls in Settings.
- Consolidated Theme lifecycle ownership so `AppearanceManager` is the sole owner of `data-theme` writes.
- Retained StudyPage and Word Card visual specifications through Review 4 and final visual verification.
- Regenerated the Windows Installer after confirming the previous installer was stale.

### Problems

1. Dark Mode displayed both Blue and Green as competing primary accents.
2. The initial Theme Switch design had no allowed persistence path because existing settings storage was SQLite while Theme infrastructure was not allowed to modify SQLite or IPC.
3. The manual acceptance installer did not show Appearance controls even though source and `dist` included them.
4. StudyPage had DEV-only Theme preview logic that could independently write `document.documentElement[data-theme]`.
5. StudyPage feedback timing required verification to avoid changing answer-state behavior prematurely.

### Root Cause

1. Brand Blue and Success Green had previously been used as overlapping accent roles.
2. The application had no dedicated Appearance storage; only learning preferences used SQLite.
3. `npm.cmd run build` refreshed `dist`, but the Windows Installer had not been regenerated. The installed package was built on 2026-08-05.
4. Theme preview lived inside StudyPage rather than in a global Theme lifecycle owner.
5. Feedback behavior depended on a timer and answer-state sequence, so visual changes required review against the running application.

### Resolution

1. Adopted Theme System V2: Accent, Success, Danger, Warning, and Neutral have separate responsibilities.
2. Authorized `localStorage` as the single Appearance persistence location; it stores only the selected Light or Dark theme.
3. Implemented `AppearanceManager` and `AppearanceProvider`; Settings now exposes Appearance > Theme with Light and Dark options.
4. Moved DEV Theme preview resolution into the Appearance lifecycle; StudyPage no longer writes `data-theme`.
5. Completed Review 4, final visual verification, automated tests, build verification, and a fresh NSIS package.

### Decision

- Adopt Single Accent Theme: Dark = Black + Green; Light = White + Blue.
- Keep Success Green for progress, completion, known feedback, and success status only.
- Keep Danger Red for unknown, deletion, errors, and danger feedback only.
- Assign Theme lifecycle ownership exclusively to `AppearanceManager`.
- Treat runtime acceptance as stronger evidence than source code or implementation reports.
- Require Windows packaging after a release-facing code change; `build` alone is not sufficient for installer acceptance.

### Lessons Learned

- Theme semantics must be defined before component color mapping, otherwise accents drift across pages.
- A global setting needs one owner for persistence, runtime state, and root Theme application.
- A successful renderer build does not prove that an existing installer contains the build.
- Manual UI acceptance must verify the installed release artifact, not only the development workspace or `dist` output.
- Freeze decisions require scope, visual evidence, known risks, and release-artifact verification.

### Related Documents

- `CHATGPT_CONSTITUTION.md`
- `docs/theme-system-v2-freeze.md`
- `docs/theme-switch-system-v1-migration-report.md`
- `docs/v0.2.0-learning-page-final-verification-record.md`
- `docs/chat-handoff/learning-page-ui-handoff.md`
- `docs/chat-handoff/word-card-visual-handoff.md`
- Release Packaging Report
- Theme Switch Root Cause Report
