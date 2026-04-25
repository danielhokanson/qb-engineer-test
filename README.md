# qb-engineer-test

User test scenarios for an ERP application, organized as a structured library that can be read directly or compiled to JSON for a runner.

## What this is

A library of manual test cases describing how a manufacturing-focused ERP *should* behave across the full lifecycle of a business — from a freshly installed application with no records, through bootstrap, master data, first transactions, first production cycle, and exception handling. The library is designed so that if the application can't accomplish what a case describes, that's a bug in the application, not the case.

## Status

Early but advancing. Phases 0 and 1 are written, plus the schema, onboarding tutorial, glossary, and a working Angular test runner in `test-bed/`. Phases 2 through 5, role reference appendices, and the dedicated i18n and accessibility suites are not yet written.

## Documentation

Two reference documents in [`docs/`](docs/) cover the project in depth:

- [`docs/test-scenarios.md`](docs/test-scenarios.md) — what the test library is, how it's organized, the schema, conventions, the authoring guide, and how to read and run cases.
- [`docs/runner-platform.md`](docs/runner-platform.md) — specification for the browser-based test runner: architecture, data model, UX flows, build pipeline, and v1 scope.

Read those before contributing. The rest of this README is a quick orientation.

## Layout

```
docs/
  test-scenarios.md            Reference: the test library
  runner-platform.md           Reference: the test runner
  glossary.md                  Plain-English term definitions
  01-schema.md                 Test case field structure and conventions
  02-onboarding-tutorial.md    Tutorial cases (TUT-NNN) for new testers
  03-phase-0-bootstrap.md      Phase 0 cases (P0-AREA-NNN)
  04-phase-0-manifest.md       Phase 0 sequence, branches, checkpoints
  05-phase-1-foundations.md    Phase 1 cases (P1-AREA-NNN)
  06-phase-1-manifest.md       Phase 1 sequence, role coverage, checkpoints

test-bed/                      Angular SPA test runner
```

Future phases follow the same naming pattern (`docs/07-phase-2-master-data.md`, etc.).

## Conventions

- **Authoring format**: Markdown with embedded YAML for case structure. The runner consumes a JSON compilation; humans read the source.
- **Case IDs**: `PHASE-AREA-NNN` (e.g. `P0-TENANT-001`). Tutorial cases use `TUT-NNN`. IDs are stable — never renumbered or reused.
- **Language**: Plain industry-standard English. Jargon is treated as a bug in the test case, not a sign of rigor.
- **Negative variants**: Live with their happy-path parent. Not in a separate document.
- **i18n and 508**: Covered by dedicated suites against representative screens, not exhaustively per case.
- **Fictional company**: A default fixture (Cascade Components, LLC, a precision sheet metal fabricator) supplies example values via placeholders. Other fixtures swap in to scale the same cases up or down.

See [`docs/01-schema.md`](docs/01-schema.md) for the full schema.

## Running the tests

A web-based runner is now in place at `test-bed/` (Angular SPA, IndexedDB-backed, no server required). To work on it:

```
cd test-bed
npx ng serve
```

Then open the URL the dev server prints. Sample data drives the runner today; a build pipeline that compiles real cases from `docs/` to runner-consumable JSON is a future enhancement. Testers record results in IndexedDB; bug reports go directly to the maintainer (eventually via GitHub Issues on this repo).

## Reporting bugs in the application under test

Stop at the first non-cosmetic bug and reach out. Don't try to work around problems — the point of the test is that the workflow described should just work.
