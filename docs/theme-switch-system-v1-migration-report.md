# Theme Switch System v1.0 Migration Report

## Purpose

Migrate the existing Theme System V2 runtime contract into the Appearance System without changing Theme Tokens, CSS Variables, component color APIs, layouts, or learning behavior.

## Baseline Before Migration

| Capability | Existing implementation | Migration outcome |
| --- | --- | --- |
| Theme Tokens | `src/styles/global.css` defines Dark defaults and Light overrides through `:root[data-theme="light"]` | Retained without token or color changes |
| Theme apply contract | Light was applied by setting `data-theme="light"`; Dark by removing it | Retained through `AppearanceManager` |
| Theme preview | StudyPage DEV preview directly changed `document.documentElement[data-theme]` | Moved to the global Appearance lifecycle |
| Theme storage | No dedicated theme storage existed | `localStorage` is now the single Appearance storage location |
| Theme state / Hook | No global Theme state or Hook existed | `AppearanceProvider` and `useAppearance` own the shared state |

## Migration Architecture

`AppearanceManager` is the sole writer of `document.documentElement[data-theme]`.

1. `themeRegistry.ts` defines `Theme = dark | light | system`; `system` is type-only reserved for v0.3 and is not saved, exposed in Settings, or listened to.
2. `AppearanceManager` loads and saves only `dark` or `light` using `localStorage` key `lexistudy.appearance.theme`, applies the existing root attribute contract, and resolves DEV `?theme=` preview values.
3. `AppearanceProvider` initializes once above the full React application, exposes the current user-selected theme via `useAppearance`, and applies the active theme through the manager.
4. Settings is the only current UI writer. It displays Appearance > Theme with Light and Dark controls.

## Compatibility Guarantees

- Theme Token names and values in `src/styles/global.css` are unchanged.
- Existing CSS consumers in Home, StudyPage, Sidebar, Dictionary, Statistics, and Settings continue to read the same CSS variables.
- No component receives a new Theme prop or performs page-local Theme branching.
- Existing DEV URL preview remains available as `?theme=light` or `?theme=dark`, but is now resolved and applied globally by `AppearanceManager`.
- StudyPage keeps its independent DEV font-scale preview; it no longer writes Theme attributes.

## Lifecycle Ownership

| Responsibility | Owner |
| --- | --- |
| Read / persist user theme | `AppearanceManager` |
| Modify root `data-theme` | `AppearanceManager` only |
| Share active user selection | `AppearanceProvider` / `useAppearance` |
| User selection UI | Settings > Appearance > Theme |
| Token consumption | Existing CSS and components |

## Persistence and First Install

- First install: no persisted value resolves to `dark`.
- User changes are applied immediately and stored in browser `localStorage`.
- Restart: the provider loads the stored `dark` or `light` value before applying the global Theme.
- Invalid values, including reserved `system`, resolve safely to `dark`.

## Verification

- `npm.cmd test -- --run`: 11 test files and 36 tests passed.
- `npm.cmd run build`: renderer and Electron TypeScript builds passed.

## Out of Scope

- Theme System V2 Tokens and colors
- Follow System / automatic theme selection
- Font scale, contrast, animation, or language controls
- SQLite, IPC, Electron business logic, learning logic, and data model changes
