# Test Scenarios — Reference Documentation

This document explains what the test scenario library is, how it's organized, the conventions cases follow, and how to author and run them. It is the primary reference for anyone writing, reviewing, or executing test cases in this repository.

For documentation on the runner website that consumes this library, see [`runner-platform.md`](runner-platform.md).

---

## 1. Purpose

This library is a structured collection of manual test cases that describe how a manufacturing-focused ERP application should behave end-to-end — from the moment someone first opens the application with no records, through bootstrap, master data, first transactions, first production cycle, and exception handling.

The cases are not unit tests, automation scripts, or behavior specifications written in code. They are human-readable scripts a person executes, observes, and records results against. Their primary outputs are pass/fail signals and bug reports.

### 1.1 The framing

The library is written to **industry-norm expectations**. If a case describes filtering a lot list by expiration date and the application can't do that, the application has a bug — the test does not get rewritten to fit the application's limitations. This framing inverts the more common "tests describe what the app does" pattern. Cases here describe what a reasonable person doing the work would expect to be possible. Anything less is an application defect.

The corollary: an author writing a case should not soften steps to match assumed app capability. Steps should describe the natural workflow in plain industry language. If a step assumes a capability that turns out to be missing, that's information worth capturing as a bug, not a reason to weaken the case.

### 1.2 The audience

Testers running these cases will range from inexperienced interns and non-technical engineers to retired product managers and senior IT staff. The library serves them through a layered structure:

- **Test case content** is written for the lowest-context reader. Concrete values, no jargon shortcuts, no implicit knowledge.
- **Persona / context blocks** at the head of each role document explain the role's world in plain language.
- **A glossary** (see Section 4.4) defines manufacturing and ERP terms once, centrally.
- **Optional `why_this_matters` notes** on individual cases explain business motivation. Experienced testers skip these; new testers read them.

This means a single document genuinely serves the whole audience without dumbing down for experts or overwhelming newcomers.

### 1.3 Plain-language discipline

The single most important authoring rule: **avoid jargon traps**. A QA tester should not need to know what "chart of accounts mapping" means to execute a step about accounting integration. The step should describe what the user is trying to accomplish and what they should see, in the words a non-specialist would use. The application — not the test — is responsible for explaining domain concepts to the user. If the application requires the tester to understand a term to complete a step, that's a usability bug worth flagging.

---

## 2. Library structure

### 2.1 Phases

Test cases are organized into six sequential phases that walk a brand-new business from empty database to operational. Each phase depends on prior phases having completed.

| Phase | Title | Covers |
|---|---|---|
| **P0** | Bootstrap | First admin registration, tenant configuration (locale, time zone, fiscal year, currency, costing model), integration setup (accounting, shipping, tax), role taxonomy, second user creation, persistence verification. |
| **P1** | Foundational records | Locations, work centers, units of measure, GL accounts, tax codes, employee records, additional users with roles, calendars, asset records. |
| **P2** | Master data | Vendors, customers, parts (raw, WIP, finished), bills of materials, routings, pricing, lead times, lot/serial tracking configuration. |
| **P3** | First transactions | First purchase requisition, first PO, first vendor receipt (creating first inventory), first asset commissioning, opening balances, initial cycle counts. |
| **P4** | First production cycle | First lead → quote → sales order → work order → material issue → labor → completion → ship → invoice → cash. End-to-end quote-to-cash, tested as a real flow rather than as isolated steps. |
| **P5** | First exception cycles | First damage report, first PM trigger, first quality fail, first new hire after the founder, first subcontract send-and-receive, first customer return, first month-end close. |

A phase is "complete" when its required cases have all been marked passed and any branch decisions it raises have been recorded. Required vs. optional status is declared in the phase's manifest file (see Section 2.3).

### 2.2 Onboarding tutorial

Before any phase, testers run a short tutorial that teaches three things:

1. The **language** of test cases — what preconditions, expected results, and pass criteria mean.
2. The **interaction model** with the runner — recording pass/fail, writing useful notes, resuming.
3. The **epistemic discipline** of testing — comparing expected to actual without rationalizing differences away.

The tutorial uses an in-runner Practice App (see [`runner-platform.md`](runner-platform.md#5-the-practice-app)) so it never goes stale, never depends on external software, and cannot affect anything outside itself. Tutorial cases use IDs `TUT-NNN`.

### 2.3 Files in the library

```
docs/
  test-scenarios.md            This document
  runner-platform.md           Runner reference
  glossary.md                  Plain-English term definitions
  01-schema.md                 Schema definition (the source of truth for case structure)
  02-onboarding-tutorial.md    TUT-NNN cases
  03-phase-0-bootstrap.md      P0 cases — bootstrap from empty database
  04-phase-0-manifest.md       P0 sequence, branches, checkpoints
  05-phase-1-foundations.md    P1 cases — foundational records
  06-phase-1-manifest.md       P1 sequence, role coverage, checkpoints
  07-phase-2-master-data.md    P2 cases (planned)
  08-phase-2-manifest.md       P2 sequence (planned)
  ... (etc. through P5)

  appendices/                  (planned)
    role-floor-operator.md     Role reference: cases relevant to this role, in role-specific order
    role-procurement.md
    ... (one per role)

  suites/                      (planned)
    i18n-suite.md              Dedicated i18n cases against representative screens
    accessibility-suite.md     Dedicated 508 cases

  fixtures/                    (planned)
    cascade-components-mid.yml   Default mid-market fictional company
    ... (other scale variants)
```

Each phase has two files: a content file with the cases, and a manifest file that declares sequence, branches, and checkpoints. The split lets the cases themselves stay portable (readable as documentation by humans) while the manifest carries the orchestration the runner needs.

### 2.4 Dedicated suites vs. exhaustive coverage

Two categories — internationalization (i18n) and accessibility (508) — are not checked exhaustively on every case. Doing so would produce noise without coverage gain. Instead, dedicated suites exercise representative screens that are likely to expose translation gaps or accessibility regressions, and the rest of the library trusts those suites.

A handful of cases in the regular phases also tag i18n or accessibility checks where the workflow itself is specifically about translation or accessibility (e.g., P0-TENANT-002, which sets the company language). These tagged cases supplement the dedicated suites; they don't replace them.

---

## 3. Test case schema

The full schema is defined in [`01-schema.md`](01-schema.md). This section summarizes the fields and explains the design choices behind them.

### 3.1 Required fields

| Field | Purpose |
|---|---|
| `id` | Stable identifier, `PHASE-AREA-NNN` or `TUT-NNN`. Never renumbered, reused, or reordered, even if a case is deleted. |
| `title` | Short human-readable name. Must make sense out of context. |
| `goal` | One plain-English sentence: what is the tester trying to accomplish? |
| `roles` | Roles that own or execute this case in a typical organization. One or more. The runner derives the available role list by taking the union across all cases. |
| `preconditions` | State the system must be in before the case can run, one item per line. |
| `steps` | Ordered list of action-and-expected pairs (see Section 3.3). |
| `expected_overall` | What is true after the last step succeeds. The tester reads this before starting to know what "done" looks like. |
| `pass_criteria` | The single specific thing that decides pass or fail. Written so the tester can answer without judgment. |

### 3.2 Optional fields

| Field | Purpose |
|---|---|
| `why_this_matters` | Plain-English business reason. Used sparingly, only when motivation isn't obvious from the goal. |
| `scale_tags` | Which business sizes this case applies to: `small-shop`, `mid-market`, `enterprise`. Absent means all. |
| `modality` | Input paths exercised: `keyboard`, `touch`, `scanner`, `manual-entry`. Defaults to `keyboard`. |
| `branches` | Decision points within the case. See Section 3.4. |
| `prerequisite_cases` | Other case IDs that must pass first. The runner uses this for dependency tracking and skip-ahead. |
| `seed_data` | Records that must exist before the case runs. Used by the skip-ahead feature. |
| `notes` | Free-form notes for the tester. |
| `negative_variants` | Negative test variants of this happy-path case. See Section 3.5. |
| `i18n_check`, `accessibility_check` | Boolean flags marking a case as part of the dedicated suites. |
| `est_minutes` | Rough time estimate. Helps testers plan a session. |
| `localized_strings` | Per-language overrides for any string field. Keys are language codes (`en-US`, `es-US`). |

### 3.3 Step structure

Each item in `steps` has:

- `n` — step number, 1-indexed.
- `action` — what the tester does, in plain English with concrete values (no placeholders in the runtime view).
- `expected` — what the tester should see *immediately* after the action. Checked before moving on.
- `notes` — optional aside (gotchas, "if you see X, you've gone too far").
- `branch_id` — optional, ties the step to a specific branch option.

The action/expected pair is the smallest unit of testing discipline. Both are required even when the expected result feels obvious — the habit of looking is more important than the obviousness of any individual check.

### 3.4 Branching

Two kinds of branches exist in the library:

**Step-level branches** (declared inside a case): A case asks the tester a question, records the choice, and serves only the steps tied to that choice. Useful when a single workflow forks briefly.

```yaml
branches:
  - id: accounting-mode
    prompt: "Is this run testing the integrated accounting connector, or manual entry?"
    options:
      - id: connected
        label: "Integrated accounting connector"
      - id: manual
        label: "Manual entry"
```

**Manifest-level branches** (declared in a phase's manifest): A choice made in one case affects which cases or variants are served in later phases. The runner persists the choice and applies it across the whole session.

For divergences larger than a few steps, prefer manifest-level branches and split into separate cases. For small forks within one workflow, prefer step-level.

### 3.5 Negative variants

Negative variants live as a child list on their happy-path parent rather than in a separate negative-only document. The reasoning: separate negative-only documents get skipped. Inline variants get run because the tester is already in the case.

A variant inherits its parent's preconditions and prior steps unless it overrides them. It declares its own action, expected result, and pass criteria, and gets its own ID derived from the parent (e.g., `P0-TENANT-001-N1`).

Variants cover four common failure modes:

1. **Validation gates** — empty required fields, invalid formats, out-of-range values.
2. **Permission boundaries** — operations the user shouldn't be able to perform.
3. **State conflicts** — operations that should be blocked by current state (closing a period with open transactions).
4. **Data integrity** — operations that should not corrupt referenced records.

### 3.6 Seed data

A case can declare records that must exist before it runs:

```yaml
seed_data:
  customers:
    - id: ACME-001
      status: active
      credit_limit: 50000
```

The runner uses this for skip-ahead: if a tester wants to start partway through a phase, the runner reads the `seed_data` from the case at that entry point and asks the tester to confirm those records exist. Eventually, the application under test may grow a "seed test data" admin function the runner can call directly — that's an enhancement, not a launch requirement.

### 3.7 Localized strings

Any string field can be overridden per language:

```yaml
localized_strings:
  es-US:
    title: "Configurar el idioma principal de la empresa"
    goal: "..."
```

If no override is present for a language, the default English content is used. This avoids forking the case content into per-language files and makes it obvious when a translation is missing.

---

## 4. Conventions

### 4.1 Case IDs

`PHASE-AREA-NNN` for regular cases (e.g., `P0-TENANT-001`). `TUT-NNN` for tutorial cases. `<parent>-N<n>` for negative variants (e.g., `P0-TENANT-001-N1`).

Areas within a phase are short, lowercase-only-when-conventional codes. Common ones: `INSTALL`, `ADMIN`, `TENANT`, `INTEG` (integrations), `USER`, `INFRA`, `PARTS`, `BOM`, `WO`, `SHIP`. New areas can be coined as needed; once coined, they stay.

IDs are stable. A case that is deleted does not have its ID recycled. A case that is reordered keeps its number. The runner relies on stable IDs to track progress across releases of the library; renumbering would silently invalidate prior test results.

### 4.2 Naming entities in steps

Steps reference specific records by ID — `Customer ACME-001`, `Work Order WO-2026-0451`, `Lot RM-STEEL-7842`. The IDs are invented consistently within the library; the application is expected to accept whatever ID format it natively uses. If the application's convention differs, the tester should adapt and report any place where the difference creates friction.

Where a step needs a value that varies by fixture (company name, primary location, default currency), the source uses a placeholder: `{{company_name}}`, `{{primary_location}}`. The runner substitutes from the active fixture file at render time. This keeps the same case content valid for small-shop, mid-market, and enterprise fixtures.

### 4.3 "Find and open"

Many steps say "find and open the company settings area" rather than "click Settings → Company → General." This is deliberate. Locking steps to specific menu paths makes them brittle — a UI reorganization breaks every case. The "find and open" phrasing also acts as a usability check: if the tester can't find what the step describes, that itself is a bug. The application should not require tribal knowledge to navigate.

### 4.4 The glossary

Manufacturing and ERP terms (BOM, routing, work center, lot, WIP, MRP, ATP, etc.) are defined once in `glossary.md` and referenced from cases. The glossary is localized like every other content file. Definitions are written for someone who has never worked in manufacturing — that's the bar.

### 4.5 Modality

Cases that exercise scanner workflows tag `modality: [scanner]` and may also tag `manual-entry` if the case applies to both. The library treats scanner as the gold-standard input but never as the only path. Every scannable operation has a UI equivalent that must also work, and cases tagged `scanner, manual-entry` are run on both paths in turn.

### 4.6 Scale tags

`small-shop` (3–4 people), `mid-market` (~15 people, 1–2 locations), `enterprise` (larger, multi-location, multi-currency). A case with no scale tags applies to all sizes. A case with one or more scale tags applies only to those sizes. Filtering happens at runtime based on the chosen fixture.

The same case content can read naturally for all three sizes through fixture-driven placeholders and scale-tagged steps. The library deliberately avoids forking into parallel small-shop / enterprise document sets — that approach explodes maintenance cost and drifts.

---

## 5. Authoring guide

### 5.1 Voice

Cases are written in plain industry English. Concrete, terse, no fluff. The tutorial is allowed to be a little chatty (it's teaching) but real cases are not. Read a few existing cases (P0-INSTALL-001 is a good baseline) before writing a new one.

Avoid:

- Jargon that requires domain expertise to parse. If a term is unavoidable, define it in the glossary.
- Vague expected results ("the system updates accordingly"). Expected results must be specific enough that the tester can confidently say match-or-mismatch.
- Implicit setup ("create a customer somehow"). State preconditions explicitly.
- Future tense narration ("the system will then..."). Use present-tense observation ("the system shows...").
- Optional steps within the action list ("you may want to..."). Either it's a step or it isn't.

### 5.2 When to add `why_this_matters`

Use it when the business reason for the case isn't obvious from the goal. Skip it when the goal already explains itself. As a rough rule, fewer than half of cases should have a `why_this_matters` note; if it's on every case, the goal field is being underused.

### 5.3 When to add negative variants

Always add at least one when the case involves user input that has any validation rule. Always add one when the case represents a state transition that has any precondition. Skip them when the case is purely observational (e.g., "verify the company name is displayed").

A good rule of thumb: if a developer working on this feature would have written a unit test for an error case, the test scenario should have a corresponding negative variant.

### 5.4 Preconditions

Preconditions describe **state**, not actions. "The user is signed in as an admin" is a precondition. "Sign in as an admin" is a step. If a precondition needs setup that the tester doesn't already know how to do, link to a setup case rather than describing it inline.

Preconditions should be specific enough that the runner can mechanically check them via `seed_data` if the tester is skipping ahead. "A customer exists" is too vague; "Customer ACME-001 exists in active status with a credit limit of $50,000" is right.

### 5.5 Authoring workflow

1. Start with the case ID and title. Decide where it slots in the phase sequence.
2. Write the goal — one sentence, plain English.
3. List preconditions and tag `roles`.
4. Draft the steps. Use concrete values. Verify each `expected` is checkable.
5. Write `expected_overall` and `pass_criteria`.
6. Add negative variants for any input or state-transition cases.
7. Add scale tags and modality tags if the case isn't universal.
8. Decide whether `why_this_matters` is genuinely needed.
9. Estimate `est_minutes`.
10. Have someone else read it cold and ask whether they could execute it without further questions.

Step 10 is the most important. If the reviewer has to ask for clarification, the case isn't done.

---

## 6. Reading and running cases

### 6.1 How a tester reads a case

The runner displays the case in a fixed reading order:

1. Title and goal (so the tester knows what they're about to do).
2. Preconditions (so the tester verifies the system is in the right state).
3. Steps, one at a time. The tester does the action, looks at the screen, compares to the expected result, and only then moves on.
4. After the last step, expected overall and pass criteria.
5. Negative variants (if any) follow the parent.

Testers should resist the temptation to skim. The whole point of having an explicit `expected` for every step is that comparing it to actual is the work. Skimming defeats the purpose.

### 6.2 Recording results

The runner records pass, fail, or blocked for each case. Pass means actual matched expected at every step. Fail means it didn't, somewhere. Blocked means the case couldn't be executed because of a prior failure or environment issue.

When marking a fail, the tester writes a note that another person could read and understand without follow-up questions. "Login is broken" is not useful. "After clicking Sign In with valid credentials, the page showed a blank white screen for 30 seconds, then returned to the login form with no error message" is useful.

### 6.3 Skip-ahead and checkpoints

A tester can jump into a phase mid-sequence at one of the manifest's defined checkpoints. The runner displays the checkpoint's `state_summary` and asks the tester to confirm the listed records exist. Confirmation has three legitimate forms:

1. The tester ran the prior cases and the state is real.
2. The tester has access to a pre-seeded test environment.
3. The tester acknowledges they're starting fresh and accepts that any failures from missing state are theirs to interpret.

Eventually the application may expose a "seed test data to checkpoint X" admin function the runner can call directly. Until then, options 1–3 stand.

### 6.4 Following branches

When the runner reaches a step or case with a branch, it prompts the tester to choose. The choice is recorded for the rest of the session. From that point on, only steps and cases tied to the chosen branch (or unbranched) are served.

A tester wanting to test the other branch starts a parallel session with a different choice. The runner does not currently support running both branches in one session.

### 6.5 Reporting bugs

Bug reports are informal at this stage. The expectation is that a tester stops at the first non-cosmetic bug and reaches out to the maintainer. The bar for "blocking" is intentionally low — cosmetic issues can be batched, but anything that prevents completing a workflow stops the session.

A bug report includes: the case ID, the step where the failure happened, what was expected, what actually happened, and any reproduction notes. The runner can also export a session summary (JSON) that includes the same information for any failed cases in the session.

Future enhancement: optional GitHub Issues integration — sign in with a personal access token, file issues directly against this repo. Not built yet.

---

## 7. Roles

### 7.1 How roles are declared

Each case declares one or more `roles` directly — concrete role names like `Administrator`, `Floor Operator`, `Procurement`, `Production Manager`. The runner derives the available role list by taking the union across all cases. There is no separate roles file and no role-composition layer.

When a tester picks roles at the start of a run, the runner shows them only the cases whose `roles` list intersects their selection.

### 7.2 Multi-role cases

A case that two roles realistically share (e.g., a Floor Operator scanning a work order start, but a Production Manager doing the same thing during coverage) lists both. The case still appears once in the library; it just shows up for whichever role is selected.

### 7.3 Role granularity

Pick the role that owns the work in a typical mid-market organization. Smaller shops collapse roles (one owner-operator does everything); larger shops split them further (Lead Operator vs. Floor Operator). The library doesn't try to cover all variations — it picks one defensible role-per-case mapping and trusts that small-shop testers select multiple roles when they wear multiple hats.

If a case genuinely spans roles in every organization (e.g., "review a draft before it ships" is done by whoever's available), list two or three. Don't list every plausible role — that defeats the point of role filtering.

### 7.4 Standard roles in this library

The library uses a deliberately small set of role names so that selecting roles at run time is meaningful rather than overwhelming. Current standard roles:

- `Administrator` — first-time setup, tenant configuration, integrations
- `IT Admin` — user management, role permissions, system-wide settings
- `Controller` — chart of accounts, tax configuration, financial periods
- `HR` — employee records, onboarding, time-off, compliance documents
- `Production Manager` — work centers, routings, scheduling, sprint/kanban setup
- `Production Planner` — release work orders, allocate to operators
- `Floor Operator` — scanner-driven production-floor work
- `Procurement` — vendors, purchase orders, receiving
- `Warehouse / Logistics` — bin transfers, picks, ships
- `Maintenance Manager` — assets, PM schedules, work orders for repair
- `Maintenance Tech` — executes maintenance work orders
- `QC Inspector` — inspection gates, fail/rework loops
- `Sales / Account Manager` — leads, quotes, customers, sales orders

New roles can be added when a case genuinely doesn't fit any existing one — but additions should be discussed before introduction. Drift in the role vocabulary is the main risk.

---

## 8. i18n and accessibility strategy

### 8.1 i18n suite

The library ships with two languages: American English (`en-US`) and US Spanish (`es-US`). The dedicated i18n suite tests:

- That every screen renders entirely in the chosen language with no untranslated fragments.
- That language switching is instantaneous and does not corrupt entered data.
- That date, number, currency, and address formats follow the chosen locale.
- That input fields accept locale-appropriate characters (accented characters in Spanish, etc.).
- That outbound documents (invoices, POs, packing slips) render in the appropriate language for their recipient — which may differ from the user's UI language.

The suite covers a representative subset of screens (a screen per major area), not every screen. Coverage gaps are accepted in exchange for maintainability.

### 8.2 Accessibility (508) suite

The dedicated 508 suite tests representative screens for:

- Keyboard-only navigation (every interactive element reachable, no traps).
- Screen reader compatibility (semantic labels, ARIA roles where needed).
- Color contrast at minimum WCAG AA on text and interactive elements.
- Focus visibility (a sighted keyboard user can always see what's focused).
- Form error associations (errors are programmatically connected to their fields).

Like i18n, the suite is representative, not exhaustive.

---

## 9. Fictional company and fixtures

### 9.1 Why a fictional company

Steps reference specific record values — company names, customer IDs, part numbers, prices. The library invents these via fixtures so that:

- The same case content works for any real customer running the test suite.
- Testers don't accidentally confuse the test scenario with their actual production data.
- Reviewers can read a case in isolation and have a concrete picture of what's happening.

### 9.2 Default fixture: Cascade Components

The default fixture is **Cascade Components, LLC**, a precision sheet metal fabricator in Eugene, Oregon. ~15 employees, 1 primary location plus a small second site, a handful of customers (one international), two vendors (one a heat-treatment subcontractor), about 20 parts across 3 product families, and one CNC machine that breaks during the scenario so MRO gets exercised.

Cascade is mid-market. Small-shop and enterprise variants of the fixture (with different scale parameters) cover the other sizes.

### 9.3 How fixtures fit in

A fixture file is YAML providing values for all placeholders the cases use:

```yaml
company_name: "Cascade Components, LLC"
primary_location: "Eugene, OR"
primary_currency: "USD"
fiscal_year_start: "January"
default_customer: "ACME Industrial"
# ... etc.
```

The runner loads the active fixture at session start. When rendering a case step that contains `{{company_name}}`, it substitutes the value. A different fixture serving the same cases produces a session about a different fictional company.

### 9.4 Authoring with fixtures in mind

When writing a new case, an author should:

- Use placeholders for any value that varies by company size or industry vertical.
- Hard-code values that are universal (specific date formats, specific UI labels).
- When in doubt about whether to placeholder, prefer placeholdering — it's easier to remove a placeholder than to add one across many cases later.

The library's placeholder vocabulary is limited and stable. New placeholders should be discussed before introduction; ad-hoc ones cause silent drift.

---

## 10. Summary: phase-by-phase scope

### P0 — Bootstrap

From "first time opening the application" to "tenant configured and ready for foundational records." Covers admin registration, identity/locale/fiscal/currency settings, costing model choice, integration choices (accounting, shipping, tax), role taxonomy, and second user creation. Most of this phase is run by a single first-admin user. Branches in this phase (accounting mode, shipping mode) propagate to later phases.

### P1 — Foundational records

The records that master data and transactions reference: locations, work centers, units of measure, GL accounts, tax codes, employee records, additional users, calendars (shift schedules, holidays), asset records (equipment that will be referenced by work orders and PM schedules). Multi-role: HR creates employees, controller configures GL accounts, IT admin configures users, production manager configures work centers.

### P2 — Master data

Vendors, customers, parts (raw, WIP, finished), bills of materials, routings, pricing, lead times, lot/serial tracking. This is the phase where the BOM and routing settings that govern later production behavior get configured — including the per-assembly settings discussed in the original design (whether subcontracting is required, whether scanner-only or scanner-or-manual, lot vs. serial vs. neither).

### P3 — First transactions

The first records that move things rather than describe them: first purchase requisition, first PO, first vendor receipt (creating first inventory), first asset commissioning (an item promoted from inventory to fixed asset on a PO), opening balances, initial cycle counts.

### P4 — First production cycle

The end-to-end happy path. First lead → quote → sales order → work order → material issue → labor recording → completion → ship → invoice → cash. This phase tests the integration of everything prior. Branches from P0 (accounting mode, shipping mode) take effect here in the form of which financial and shipping cases are served.

### P5 — First exception cycles

The grey paths. First damage report and the work order to repair it. First PM trigger that schedules maintenance before damage occurs. First quality fail and the rework loop. First subcontracted operation (assembly leaves, comes back). First customer return (RMA). First new hire after the founder. First fiscal close.

---

## 11. What's not in scope

The following are deliberately not included in the library and should not be added without discussion:

- **Code-level test scripts.** This library is for human execution against a deployed application. Unit tests, integration tests, and automated UI tests live elsewhere.
- **Performance and load testing.** Different toolchain, different audience.
- **Security testing.** Should be a separate effort with security expertise.
- **Specific UI locators or selectors.** Test cases describe what the tester looks for, not how the app builds it.
- **Severity classifications on cases.** Severity is a property of bugs found during testing, not of cases themselves.

---

## 12. Maintenance

The library is maintained alongside the application it tests. When the application changes behavior, the cases describing that behavior are updated. When the application gains a capability, cases for it are added. When the application loses a capability that the library expected to exist, the case stays — it represents what should be true — and the missing capability gets a bug filed against the application.

Changes to the schema (Section 3) are non-breaking by default: adding optional fields doesn't invalidate existing cases. Breaking changes to the schema are versioned and migrate the existing library forward in a single change.
