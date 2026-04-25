# qb-engineer-test — Claude Code Project Rules

> Loaded into every Claude Code session in this repo. Override defaults; follow exactly.

## SELF-MAINTENANCE RULE

**After every session that introduces a new pattern, convention, architectural decision, or workflow change — update this file.** Favor adding curated rules (and their why) here over re-reading external docs.

## What this repo is

A library of manual test scenarios for the qb-engineer ERP, plus a browser-based test runner that consumes the library.

- **Test scenarios** live in `docs/`. Markdown source with embedded YAML frontmatter for case structure. Authors edit; humans read.
- **Test runner** lives in `test-bed/`. Angular SPA, IndexedDB-backed state, no server. The runner reads compiled JSON of the scenarios and walks testers through cases.
- **Reference documentation** lives in `docs/test-scenarios.md` (library) and `docs/runner-platform.md` (runner spec).

There is no database and no API. The runner is fully client-side. Bug reports flow informally back to the maintainer (later: optional GitHub Issues integration via PAT).

## Angular app layout

The Angular app is at `test-bed/`. Structure (as scaffolded; will grow):

- `src/styles.css` — Tailwind v4 import + design tokens via `@theme`. Single source of truth for colors, fonts, surface classes (`.surface-card`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.input-field`, `.label-mono`).
- `src/app/app.config.ts` — root provider config. Zoneless change detection, router, anything global.
- `src/app/app.ts` / `app.html` — top-level shell. Renders `<router-outlet />`.
- `src/app/pages/` — one folder per route (landing, run/new, run/:id, etc.). Each is `OnPush`, standalone, signal-driven, lazy-loaded via `loadComponent`.
- `src/app/shared/` — cross-cutting components (form controls, layout primitives, the practice app for the tutorial).
- `src/app/data/` — Dexie schema, services that wrap IndexedDB (sessions, results, branch choices, attachments).
- `src/assets/data/` — sample/mock JSON for cases, roles, fixtures, tutorial. Replaced by compiled-from-source JSON later.

## Angular conventions (enforce in every PR)

- **Standalone components**, no NgModules. `changeDetection: ChangeDetectionStrategy.OnPush` on every component.
- **Signals + `input()` / `signal()` / `computed()` / `effect()`** for component state. Avoid RxJS subjects for component-local state.
- **Zoneless change detection** is on (`provideZonelessChangeDetection()`). Don't pull in Zone.js APIs.
- **ReactiveForms only**. No `ngModel`. Validate with built-in `Validators`.
- **Bridge ReactiveForms to signals via `toSignal`**. Reading `form.valid`, `control.value`, etc. directly inside a `computed()` is non-reactive — the computed memoizes once and never updates when the form changes. Use `toSignal(form.statusChanges, { initialValue: form.status })` or `toSignal(control.valueChanges, { initialValue: control.value })` and have the computed read the resulting signal. This bug bit `new-run.page.ts` and `case.page.ts` early on.
- **URL as source of truth for navigation state.** Session id, current case, branch choices that affect the URL — keep them in the route, not just signals. Signals own ephemeral UI state; the URL owns shareable/refreshable state.
- **No hardcoded option lists in components.** Roles, fixtures, languages, cases — all derived from data files (and eventually IndexedDB / compiled JSON), never hardcoded into TypeScript.
- **Minimal custom CSS.** Check `styles.css` first — `surface-card`, `btn-*`, `input-field`, `label-mono` cover most needs. Component-level CSS only for layout particulars.
- **No Angular Material unless we have a specific reason.** The runner UI is intentionally lean; pull in dependencies only when justified.

## Build + run commands

UI:
- Dev: `cd test-bed && npx ng serve`
- Prod build: `cd test-bed && npx ng build --configuration=production`
- Tests: `cd test-bed && npx ng test`

There is no server, no Docker, no database. The runner is a static SPA deployable to GitHub Pages or any static host.

## Critical constraints (always apply)

- **No dependency on the application under test.** The runner does not call qb-engineer's API. It only walks the tester through cases; the tester does the actual interaction with the application.
- **Client-side only.** All state lives in the tester's browser via IndexedDB. No server, no auth, no sync (until and unless requirements demand it).
- **Plain language in the UI itself.** The runner's audience ranges from inexperienced testers to senior IT staff. UI copy follows the same plain-language discipline as the cases — no jargon traps. See `docs/test-scenarios.md` §1.3.
- **Industry-norm test framing.** Cases describe what *should* work. If the application can't do it, that's an application bug. The runner doesn't soften cases to fit the app. See `docs/test-scenarios.md` §1.1.
- **Generic visual identity.** No branding for any specific firm. Dark navy / teal accent palette is the baseline aesthetic.
- **License is GPL v3.** Test scenario content and the runner are both GPL.

## Working style preferences (Dan)

- **Direct communication** — no hand-holding, no patronizing framing. Push back when the technical answer warrants it.
- **Technical precision** — call out risks concretely, not vaguely.
- **Autonomous execution** — if there's time in an unsupervised window and more phases exist, continue without asking. Surface decisions when they're consequential, not when they're routine.
- **Classify before fixing** — when something fails, read both sides before editing either.

## Deeper reference

- `docs/test-scenarios.md` — full reference for the test scenario library (philosophy, schema, conventions, authoring guide).
- `docs/runner-platform.md` — full reference for the runner (architecture, data model, UX flows, build pipeline, v1 scope).
- `README.md` — orientation for new readers.
