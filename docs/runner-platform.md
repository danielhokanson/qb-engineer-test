# Runner Platform — Reference Documentation

This document specifies the test runner: a browser-based application that consumes the test scenario library, presents cases to testers, and records results. It covers the runner's purpose, architecture, data model, UX flows, build pipeline, and v1 scope.

For documentation on the test scenario content the runner consumes, see [`test-scenarios.md`](test-scenarios.md).

---

## 1. Purpose

Test cases written in plain Markdown and YAML can be read directly by anyone with a text editor, but executing them at scale across many testers — with resumability, branching, skip-ahead, progress tracking, and result export — is awkward without a dedicated tool. The runner is that tool.

The runner is **not** a test management product like TestRail, Xray, or Zephyr. It is purpose-built for this library, optimized for this library's authoring conventions and tester audience. It is also free, requires no install, runs in any modern browser, and does not require a backend.

### 1.1 Design priorities

In rough priority order:

1. **Tester experience over author experience.** Authors edit Markdown/YAML in their editor of choice; the runner is read-only for them. The runner's UX budget all goes to testers.
2. **Free, durable, no vendor lock-in.** Static SPA, plain JSON for content, IndexedDB for state. Hosting is free (GitHub Pages, Cloudflare Pages, any static host). Content is portable.
3. **Resumability and skip-ahead are first-class.** Real test sessions span multiple sittings and partial test runs are common. The runner treats interruption and partial runs as the default, not the exception.
4. **Useful in a single tester's hands without server infrastructure.** Multi-tester aggregation, server sync, and shared dashboards are deferred — they require infrastructure most users don't need.
5. **Plain language in the runner UI itself.** The runner is for non-technical testers. UI copy follows the same plain-language discipline as the cases.

### 1.2 Non-goals (for v1)

These are deliberately out of scope for the first usable version:

- Server-side state, multi-user collaboration, or shared dashboards.
- Authentication of any kind.
- Automated execution or test orchestration.
- Integration with the application under test (no direct API calls into the ERP).
- Severity classification of bugs.
- Workflow approval (sign-off, peer review, manager approval of results).
- Mobile-first UX. The runner should work on a tablet but is optimized for laptop/desktop.

These can be added later as opt-in features without rearchitecting.

---

## 2. Architecture overview

```
┌───────────────────────────────────────────────────────────────┐
│  Author's editor (VS Code, etc.)                              │
│  Edits Markdown/YAML source files in the repo                 │
└──────────────────────────┬────────────────────────────────────┘
                           │ git push
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  Build step (CI or local)                                     │
│  Compiles source → JSON (cases, manifests, fixtures, etc.)    │
└──────────────────────────┬────────────────────────────────────┘
                           │ deploy
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  Static host (GitHub Pages, etc.)                             │
│  Serves SPA bundle + compiled JSON                            │
└──────────────────────────┬────────────────────────────────────┘
                           │ HTTP
                           ▼
┌───────────────────────────────────────────────────────────────┐
│  Tester's browser                                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  SPA loads compiled JSON                                │  │
│  │  Renders case UI, Practice App, controls                │  │
│  │  Reads/writes session state in IndexedDB                │  │
│  │  Exports session summary on demand                      │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### 2.1 Source-to-runtime build

Authors write in human-friendly Markdown with YAML frontmatter. The runner consumes JSON. A build step converts one to the other. Why:

- YAML/Markdown is comfortable to write, diffable, comment-friendly, and renders nicely on GitHub.
- JSON is faster to parse in the browser, has no ambiguity, and lends itself to indexing and filtering.
- Splitting source from runtime lets each format serve its audience without compromise.

The build is intentionally simple — a script that walks the source files, parses YAML, validates against the schema, and emits one JSON file per phase plus an index. It runs in CI on every push and on-demand locally.

Build outputs are not committed to the repo (they're in `.gitignore`). They're built on the deployment host or downloaded as a release artifact.

### 2.2 Static hosting and no backend

The runner is a fully static SPA. No server-side rendering, no API routes, no auth provider. The compiled JSON files are served as static assets. The browser is the runtime.

This means:

- Hosting is free on any static host.
- The runner can be hosted directly on this repository's GitHub Pages.
- Testers can run the entire test suite while offline once the SPA and content have loaded once.
- No infrastructure to maintain, secure, or pay for.

The trade-off is that any cross-tester aggregation or shared state requires testers to manually export and share JSON. That's acceptable for v1.

### 2.3 IndexedDB for session state

All tester state lives in IndexedDB on the tester's device:

- Active session (which phase, which case, which branch choices).
- Pass/fail results per case.
- Failure notes and attached screenshots.
- Branch decisions and fixture choice.
- Tutorial completion state.

IndexedDB is chosen over localStorage because the data set is structured (per-case results, multiple sessions, attachments) and can grow large. Switching computers mid-session is not supported in v1 — the tester must export results, transfer the JSON, and import on the other device.

---

## 3. Data model

### 3.1 Compiled content (read-only at runtime)

```typescript
type Case = {
  id: string;
  title: string;
  goal: string;
  role_functions: string[];
  preconditions: string[];
  steps: Step[];
  expected_overall: string;
  pass_criteria: string;
  why_this_matters?: string;
  scale_tags?: ScaleTag[];
  modality?: Modality[];
  branches?: BranchDeclaration[];
  prerequisite_cases?: string[];
  seed_data?: SeedData;
  notes?: string;
  negative_variants?: NegativeVariant[];
  i18n_check?: boolean;
  accessibility_check?: boolean;
  est_minutes?: number;
  localized_strings?: Record<LanguageCode, Partial<Case>>;
};

type Step = {
  n: number;
  action: string;
  expected: string;
  notes?: string;
  branch_id?: string;
};

type Manifest = {
  phase: string;
  title: string;
  description: string;
  estimated_total_minutes: number;
  default_fixture: string;
  sequence: SequenceEntry[];
  checkpoints: Checkpoint[];
  branches: BranchDeclaration[];
  dedicated_suites_referenced?: string[];
  completion_criteria: string[];
  out_of_scope?: string[];
};

type Fixture = {
  id: string;
  scale: ScaleTag;
  values: Record<string, string | number | boolean>;
};
```

(Exact TypeScript definitions live in the runner's source. Authors should treat them as derived from the schema in [`01-schema.md`](01-schema.md).)

### 3.2 Session state (read-write at runtime)

```typescript
type Session = {
  id: string;                       // UUID, generated at session start
  started_at: string;               // ISO 8601
  fixture_id: string;               // Which fixture is active
  language: LanguageCode;           // 'en-US' | 'es-US'
  scale: ScaleTag;                  // Derived from fixture
  branch_choices: Record<BranchId, OptionId>;
  tutorial_completed: boolean;
  current_phase: string | null;     // 'P0', 'P1', etc.
  current_case_id: string | null;
};

type CaseResult = {
  session_id: string;
  case_id: string;
  status: 'pass' | 'fail' | 'blocked';
  started_at: string;
  completed_at: string;
  step_results?: StepResult[];      // Optional per-step pass/fail
  failure_note?: string;            // Tester's description of the issue
  attachments?: Attachment[];       // Screenshots, etc.
};

type StepResult = {
  step_n: number;
  matched_expected: boolean;
  note?: string;
};

type Attachment = {
  id: string;
  filename: string;
  mime_type: string;
  data: Blob;                       // Stored in IndexedDB directly
};
```

### 3.3 Export format

When a tester exports a session, they get a single JSON file:

```json
{
  "session": { ...Session },
  "results": [ ...CaseResult ],
  "exported_at": "2026-04-25T14:30:00Z",
  "library_version": "0.3.0"
}
```

Attachments are embedded as base64 in the export, or written alongside in a zip if attachments are large. The export is the canonical artifact a tester sends to the maintainer.

---

## 4. UX flows

### 4.1 First-time open

1. SPA loads. The tester sees a welcome screen.
2. The tester chooses a fixture (default: Cascade Components mid-market) and a language.
3. The runner asks if this is their first time using the runner. If yes, it routes them into the onboarding tutorial.
4. After the tutorial (or skipped, if returning), the tester chooses where to start: Phase 0 from the beginning, or jump to a checkpoint.

### 4.2 Case execution loop

For each case in the active sequence:

1. The runner displays the case's title, goal, and preconditions.
2. The tester confirms preconditions are met (a checkbox; if any fail, the runner offers to surface relevant prior cases).
3. The runner displays steps one at a time. The tester reads the action, performs it in the application under test, observes, and confirms whether the actual result matched the expected.
4. After all steps, the runner displays expected overall and pass criteria.
5. The tester records pass, fail, or blocked. If fail or blocked, the tester writes a note and optionally attaches screenshots.
6. If the case has negative variants, the runner offers to run them next. They follow the same loop with the parent's preconditions inherited.
7. The runner advances to the next case in the sequence.

### 4.3 Branch prompts

When the runner reaches a step or case that declares a branch, it pauses and prompts the tester with the branch's question. The tester picks an option. The runner records the choice in the session and uses it to filter future steps and cases. The choice is sticky for the rest of the session — to test the other branch, the tester starts a new session.

### 4.4 Skip-ahead

From the case list, the tester can pick any case as a starting point. Before allowing the jump, the runner:

1. Displays the seed data and preconditions for the chosen case.
2. Asks the tester to confirm the listed records exist in their application under test.
3. Optionally, displays which prior cases would have established that state.
4. Records the skip in the session metadata so the export can show it ("session started at P0-INTEG-001 via skip-ahead, prior state assumed").

The tester takes responsibility for the assumed state. If subsequent cases fail because the assumption was wrong, that's not a bug in the application — it's noise from the skip.

### 4.5 Resume

When the tester reopens the runner after closing the browser, the runner detects the in-progress session in IndexedDB and offers to resume from the last incomplete case. The tester can also start a new session, abandoning or archiving the prior one.

Multiple sessions can coexist in IndexedDB. They're listed on the home screen with their start date, fixture, and progress percentage.

### 4.6 Export

At any time, the tester can export the active session (or any archived session) as a JSON file. The export includes session metadata, all case results to date, and any attachments. It can be emailed, uploaded, or attached to a GitHub issue.

### 4.7 Optional: GitHub Issues integration

A planned enhancement (not v1): the tester signs in with a GitHub Personal Access Token. When marking a case as failed, the runner offers to file a GitHub issue against this repository with the failure note, case ID, step number, and (optionally) screenshots. The token is stored in IndexedDB and never sent anywhere except GitHub's API.

This is opt-in. The default flow is manual reporting.

---

## 5. The Practice App

The runner ships with a built-in Practice App that the onboarding tutorial uses. It is a small, self-contained UI within the runner that the tester interacts with as if it were the application under test. It exists so the tutorial can teach testing discipline against a known, controlled domain rather than relying on external software (which goes stale, varies between platforms, and risks accidental damage to the tester's accounts).

### 5.1 Required widgets

| Widget | Behavior |
|---|---|
| Counter display | Large number, starting at 0. |
| **Add 1** button | Increments counter. |
| **Subtract 1** button | Decrements counter. |
| **Reset** button | Sets counter to 0. |
| Name input | Single-line text field. |
| **Greet me** button | Displays "Hello, {name}" in a read-only output area below. Empty input shows "Hello, friend." |
| **Show double** toggle | When on, displays "(×2 = N)" next to the counter. |
| **Crash on purpose** button | Replaces counter with the literal text "BANANA". (Used by TUT-003 to teach failure recording.) |

### 5.2 Properties

- The Practice App is fully isolated. Nothing the tester does in it affects anything outside it.
- It does not change between runner releases. Tutorial cases tied to it remain valid forever.
- It is rendered in the active language. Spanish translation is provided.
- It is keyboard-accessible. Pressing Enter in the name field activates Greet me; the buttons are reachable in document order.

### 5.3 Why a built-in Practice App rather than calculator etc.

Earlier discussion considered using a real calculator app or system settings as the tutorial domain. Both were rejected:

- External apps go stale (UI changes between OS versions).
- Settings can genuinely break the tester's account (accidental 2FA toggle, sign-out, etc.).
- The runner can't introduce intentional bugs into external apps to teach failure recording.

A built-in Practice App solves all three.

---

## 6. Source-to-runtime build

### 6.1 Build inputs

```
docs/01-schema.md
docs/02-onboarding-tutorial.md
docs/03-phase-0-bootstrap.md
docs/04-phase-0-manifest.md
docs/05-phase-1-foundations.md
docs/06-phase-1-manifest.md
... (and so on)
docs/fixtures/*.yml
docs/glossary.md
docs/appendices/*.md
docs/suites/*.md
```

### 6.2 Build outputs

```
compiled/
  cases/
    p0.json            All Phase 0 cases as a single array
    p1.json
    ...
    tut.json           Tutorial cases
    suites/
      i18n.json
      accessibility.json
  manifests/
    p0.json
    p1.json
    ...
  fixtures/
    cascade-components-mid.json
    ...
  appendices/
    role-floor-operator.json
    ...
  glossary.json
  index.json           Top-level catalog: phases, languages, fixtures, library version
```

### 6.3 Build steps

1. Walk the source tree.
2. Parse each Markdown file. Extract YAML frontmatter blocks (each block is one case or one section of a manifest).
3. Validate each case against the schema. Fail loudly on any required field missing or wrong type.
4. Validate cross-references: `prerequisite_cases` IDs exist, `branches` referenced from steps are declared on the case, manifest sequence IDs all resolve.
5. Resolve placeholders only at runtime, not at build time. Build outputs preserve `{{placeholder}}` syntax verbatim.
6. Emit JSON files. Pretty-printed in development, minified in production builds.
7. Emit `index.json` listing what's available.

### 6.4 Validation rules to enforce in build

- Required fields present on every case.
- IDs are unique across the library (no two cases share an ID, including across phases).
- `prerequisite_cases` references resolve to real cases.
- Every `branch_id` on a step matches a declared branch on the same case.
- Manifest `sequence` IDs all resolve.
- Manifest `checkpoints.after` IDs all resolve and follow case order.
- Every placeholder used in any step has a value in the default fixture (warn if not; fail if `--strict`).
- Negative variants have unique IDs derived from their parent.

### 6.5 Local development

Authors should be able to:

- Run the build locally to validate their work before committing.
- Serve the runner locally pointing at the freshly built JSON.
- See validation errors with file paths and line numbers, not opaque stack traces.

A `npm run dev` (or equivalent) workflow that watches source files, rebuilds on save, and reloads the browser is the target developer experience.

---

## 7. Configuration

### 7.1 Runner configuration

The runner has very little configuration. What exists:

- **Default language**: which language the runner UI starts in. Tester can override.
- **Default fixture**: which fixture loads by default. Tester can override.
- **Library URL**: where the compiled JSON lives. Defaults to same-origin `/compiled/`.
- **GitHub repo for issue filing** (when integration is enabled): defaults to this repository.

These are baked into the runner build at compile time. There is no admin UI in v1.

### 7.2 Server-side raw config files

For now, any operational configuration of the test suite (adding a new fixture, defining a new role mapping, updating localized glossary terms) is done by editing files in this repository and pushing. The runner picks up the changes on its next deployment.

This is intentional — building an admin UI for configuration adds complexity that doesn't benefit testers. The people configuring the suite are technical enough to edit YAML.

### 7.3 Future: tester-supplied custom fixtures

A planned enhancement: a tester can upload a custom fixture file at session start, overriding the default values for their own scenario. Useful for testers who want to run the suite using their company's actual record names. Not v1.

---

## 8. Bug reporting integration

### 8.1 Default flow

The default reporting flow is intentionally informal. A tester:

1. Marks a case as failed and writes a note in the runner.
2. Optionally attaches a screenshot.
3. Exports the session JSON.
4. Sends the JSON (and any attachments) to the maintainer in whatever way they prefer — email, Slack, a shared drive.

The maintainer reads the JSON, identifies the failed cases, and acts on them. No issue tracker involved unless the maintainer chooses to file one.

This works because the testing audience is small and the bar for "blocking bug" is low — a tester who hits a real problem stops and reaches out, rather than continuing through a degraded experience.

### 8.2 Optional: GitHub Issues integration

Planned enhancement. The tester provides a GitHub Personal Access Token (stored in IndexedDB, never transmitted except to GitHub). When marking a case as failed, the runner offers a "File issue on GitHub" button that:

1. Pre-fills the issue title with the case ID and a short summary.
2. Pre-fills the issue body with case details, step where it failed, expected, actual, and any tester notes.
3. Adds appropriate labels (`bug`, `case-fail`, phase tag).
4. Optionally uploads attachments and embeds them in the issue.
5. Returns the issue URL to the runner, which records it on the case result.

This is opt-in and additive. The default flow continues to work without it.

### 8.3 What never goes in a bug report

The runner deliberately omits some things from auto-generated reports:

- The tester's identity (GitHub login is included if the integration is on, but the runner doesn't otherwise know who the tester is).
- The tester's machine identifiers.
- Any values from fixtures that might be sensitive in some deployments.

If a tester wants to add their identity or context, they do so manually in the issue.

---

## 9. Tech stack

This section is suggestive, not prescriptive. The runner has not been built yet; whoever builds it can choose differently if there's good reason.

### 9.1 SPA framework

**SvelteKit** or **Astro with a small client island** are both good fits. Both compile to small static bundles, both have first-class TypeScript support, both deploy easily to GitHub Pages.

**Avoid** heavy frameworks that require a Node runtime (next/nuxt in SSR mode), large bundles (Angular), or that don't compile to static (Rails, Django). The runner has no backend; all logic is client-side.

### 9.2 IndexedDB

**Dexie** is the recommended IndexedDB wrapper. It hides the legacy IndexedDB API behind something readable and adds reactive queries that integrate well with most frameworks.

### 9.3 YAML and Markdown parsing

The build step needs YAML and Markdown parsing. **js-yaml** for YAML, **remark/rehype** for Markdown. Both are well-maintained and have good tree-shaking.

The runtime does **not** parse YAML or Markdown — it consumes pre-compiled JSON. This keeps the runtime bundle small.

### 9.4 UI styling

Plain CSS or **Tailwind**. The runner UI is functional, not flashy — testers spend their time looking at the application under test, not at the runner. Aim for a clean, readable, high-contrast interface that gets out of the way.

The runner must meet WCAG AA itself. The application it tests separately needs to, but that's not an excuse for the runner to skip accessibility.

### 9.5 i18n

**A simple key-based string lookup** keyed by the active language is sufficient. The runner UI has limited copy; a heavyweight i18n framework is overkill.

### 9.6 Hosting

**GitHub Pages** is the simplest first deployment target — same repo, free, no extra infrastructure. Cloudflare Pages, Netlify, and Vercel (static mode) all work too.

CI builds on push to `main`, deploys the SPA bundle and compiled JSON.

---

## 10. v1 scope

The smallest version of the runner that's actually useful. Items below are necessary for v1 to work end-to-end.

### 10.1 Must have

- [ ] Build pipeline: source files → JSON, with validation.
- [ ] Runner SPA scaffolding: routing, layout, language switching.
- [ ] Welcome screen with fixture and language pickers.
- [ ] Onboarding tutorial path with the in-runner Practice App.
- [ ] Phase 0 case execution loop (steps, expected, pass/fail, notes).
- [ ] Result recording in IndexedDB.
- [ ] Resume from prior session.
- [ ] Skip-ahead with state confirmation.
- [ ] Step-level branch prompts (within a case).
- [ ] Manifest-level branch persistence (across cases).
- [ ] JSON export of session results.
- [ ] Static deployment to GitHub Pages with CI.

### 10.2 Should have

- [ ] Negative variants in the case execution loop.
- [ ] Screenshot attachment on failure notes.
- [ ] Multiple concurrent sessions (start a new one without losing the old).
- [ ] Spanish UI (the runner itself, not just the cases).

### 10.3 Could have (deferred)

- [ ] GitHub Issues integration with PAT.
- [ ] Tester-supplied custom fixtures.
- [ ] Cross-session reporting (most-failed cases, etc.).
- [ ] Dark mode.
- [ ] Print-friendly export of a session (PDF).
- [ ] In-runner glossary popups for hovered terms.

### 10.4 Won't have (until requirements force it)

- Server-side state, sync, or multi-tester aggregation.
- Authentication beyond optional GitHub PAT for issue filing.
- Direct integration with the application under test.
- An admin UI for managing cases or fixtures.

---

## 11. Build/deploy TODO list

This is a build-ready ordered list for whoever picks up the implementation.

1. **Decide on the SPA framework.** SvelteKit recommended; if anything else, justify in a brief decision record.
2. **Initialize the project.** Add `package.json`, framework scaffolding, TypeScript config, ESLint, Prettier.
3. **Build the parser/validator.** A Node script that reads source files, parses YAML, validates against the schema, and emits JSON. Include CI integration.
4. **Define the TypeScript types.** Generated from the schema, used by both the build step and the SPA.
5. **Set up Dexie.** Define the IndexedDB schema for sessions, results, attachments.
6. **Build the welcome screen.** Fixture picker, language picker, "first time?" branch.
7. **Implement the Practice App.** Self-contained component with all required widgets including the deliberate-bug button.
8. **Build the case execution UI.** Title/goal/preconditions, step-by-step view, pass/fail/blocked controls, notes, attachment upload.
9. **Implement branch prompts.** Step-level (within a case) first; manifest-level (across cases) after.
10. **Implement skip-ahead.** Case list view, jump confirmation, state-acknowledgment dialog.
11. **Implement resume.** On runner load, detect in-progress sessions, offer to resume.
12. **Implement export.** JSON download with embedded attachments.
13. **Spanish UI translation.** Translate runner copy. Test that no English fragments leak.
14. **Accessibility pass.** Keyboard nav, screen reader testing, contrast check.
15. **Set up GitHub Pages deployment.** CI workflow that builds on push and deploys to `gh-pages` branch.
16. **Beta with a real tester.** Have at least one non-developer run through the tutorial and Phase 0 end-to-end. Fix what they trip on.

Items 1–15 are the engineering work. Item 16 is the validation that the engineering was worth doing.

---

## 12. Open questions

These are real uncertainties about the runner that should be resolved before or during implementation:

1. **Attachment size limits.** IndexedDB can hold large blobs but exporting a session as JSON with embedded base64 attachments stops being practical past a few megabytes. Decision: cap individual attachment size, or switch the export to a zip with attachments as separate files?

2. **Versioning.** When the library changes (a case is updated, a phase is added), how do prior session results stay meaningful? Options: snapshot the library version into each session, accept that re-runs may diverge from prior results, or reject old sessions on schema change. Recommend snapshotting and showing the version difference to the tester.

3. **Session ownership.** If two testers share a browser profile, they see each other's sessions. Acceptable for v1 (rare scenario), but worth flagging as a known limitation.

4. **Offline behavior.** Service worker for true offline operation, or just rely on browser cache? Affects how failure-during-load is handled.

5. **Library updates while a session is in progress.** The tester loaded the runner an hour ago, the maintainer pushed a new library version five minutes ago — what should happen? Recommend: show a notification but don't force-reload; let the tester finish their case and restart at their leisure.

6. **Tester identity in exports.** Should the export include any identifying info? In v1 the runner doesn't know who the tester is, but if the GitHub integration lands, exports could include a GitHub login. Privacy implications worth discussing.

These should be revisited when implementation actually starts. Premature decisions on them are worse than open questions.
