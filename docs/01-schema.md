# Test Case Schema

This document defines the fields that make up a single test case. Cases are authored in YAML (one case per file or many cases per file, both supported). At runtime the cases are compiled to JSON for the runner to consume.

## Why YAML for source

The author writes prose. Plain English steps. Multi-line notes. JSON makes that miserable — every newline becomes `\n`, no comments, quote-escaping everywhere. YAML keeps the source human-readable so the people writing cases (and the people reviewing them in pull requests) can actually read them. The runner never sees YAML.

## Required fields on every case

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable identifier. Format `PHASE-AREA-NNN` (e.g. `P0-TENANT-001`) or `TUT-NNN` for tutorial. Never reused, never renumbered, never reordered. |
| `title` | string | Short human-readable name. Shows in the case list. Should make sense out of context. |
| `goal` | string | One sentence in plain English: what is the tester trying to accomplish? Written so a brand-new tester gets it without reading the steps. |
| `roles` | list | Roles that own or execute this case in a typical organization (e.g. `Administrator`, `Floor Operator`, `Procurement`). One or more. The runner derives the available role list by taking the union across all cases — there is no separate roles file. |
| `flows` | list | Cross-phase business journeys this case is part of (e.g. `quote-to-cash`, `vendor-to-asset`). Optional but encouraged — lets testers run a slice of work toward a specific outcome instead of every case for their role. See [`flows.md`](flows.md) for the standard flow vocabulary. |
| `preconditions` | list | Plain-English statements describing the state the system must be in before the case can run. One statement per item. |
| `steps` | list | Ordered list of step objects. See "Step structure" below. |
| `expected_overall` | string | What should be true after the last step succeeds. The tester reads this before starting to know what "done" looks like. |
| `pass_criteria` | string | The single, specific thing that must be true to pass. Written so the tester can answer pass-or-fail without judgment calls. |

## Optional fields

| Field | Type | Notes |
|---|---|---|
| `why_this_matters` | string | Plain-English business reason. Skipped by experienced testers, read by interns. Use sparingly — only on cases where the reason isn't obvious from the goal. |
| `scale_tags` | list | Which business sizes this case applies to. Values: `small-shop`, `mid-market`, `enterprise`. If absent, the case applies to all. |
| `modality` | list | Which input paths this case exercises. Values: `keyboard`, `touch`, `scanner`, `manual-entry`. Defaults to `keyboard`. Cases that only apply to a specific modality (scanner-specific behaviors) tag accordingly. |
| `branches` | list | Branch declarations. See "Branching" below. |
| `prerequisite_cases` | list | Other case IDs that must pass before this one can be attempted. Used by the runner for dependency tracking and the skip-ahead feature. |
| `seed_data` | object | Records that must exist before the case runs. The runner uses this to verify state if the tester chose to skip ahead. See "Seed data" below. |
| `notes` | string | Free-form notes for the tester. Use for context that doesn't fit the goal or steps. |
| `negative_variants` | list | Negative test variants of this happy-path case. See "Negative variants" below. |
| `i18n_check` | boolean | Mark `true` only if this case is part of the dedicated i18n suite. Most cases leave this off — i18n is covered by a representative suite, not exhaustively. |
| `accessibility_check` | boolean | Same pattern. Most cases leave this off; the dedicated 508 suite covers it. |
| `est_minutes` | integer | Rough estimate of how long the case takes to run. Helps testers plan a session. |
| `localized_strings` | object | Per-language overrides for any string field. Keys are language codes (`en-US`, `es-US`). If absent, the default English content is used. |

## Step structure

Each item in `steps` is an object:

| Field | Type | Notes |
|---|---|---|
| `n` | integer | Step number, starting at 1. |
| `action` | string | What the tester does. Plain English. Concrete values, not placeholders. |
| `expected` | string | What the tester should see immediately after the action. The tester checks this before moving on. |
| `notes` | string | Optional. Aside to the tester — context, gotchas, "if you see X, you've gone too far." |
| `branch_id` | string | Optional. If this step is part of a branch, the branch identifier (matching one declared in `branches`). |

## Branching

Branches let one case fork based on a tester decision or a configured workflow choice (e.g. integrated accounting vs. manual). Declared at case level, referenced at step level.

```yaml
branches:
  - id: accounting-mode
    prompt: "Is this run testing the QuickBooks integration, or manual accounting entry?"
    options:
      - id: quickbooks
        label: "QuickBooks integration"
      - id: manual
        label: "Manual entry"
```

When the runner hits the branch declaration, it asks the prompt, records the choice in IndexedDB, and from then on only renders steps tagged with that branch's chosen option (or unbranched steps).

For larger divergences — a whole separate sequence of cases, not just steps within one case — declare the branch in the scenario manifest instead and split into separate cases.

## Seed data

For skip-ahead, a case can declare what records must exist:

```yaml
seed_data:
  customers:
    - id: ACME-001
      status: active
      credit_limit: 50000
  sales_orders:
    - id: SO-2026-0001
      customer: ACME-001
      status: confirmed
```

The runner shows this to the tester before starting and asks them to confirm the records exist. Eventually the application may grow a "seed test data" admin function the runner can trigger — that's a future enhancement, not a launch requirement.

## Negative variants

Negative variants live with their happy-path parent so testers don't skip them.

```yaml
negative_variants:
  - id: P0-TENANT-001-N1
    title: "Reject empty admin email"
    action: "Leave the email field empty and submit."
    expected: "Form blocks submission and explains the email is required, in plain language."
    pass_criteria: "Submission was blocked AND a clear, non-jargon error explained why."
```

A negative variant inherits the parent's preconditions and prior steps unless it overrides them.

## Example: a fully fleshed case

```yaml
id: P0-TENANT-002
title: Set the company's primary language and locale
goal: |
  Configure the tenant so the application displays in the company's
  preferred language and uses local date and number formats.
roles:
  - Administrator
preconditions:
  - The first admin account is registered and signed in.
  - No company-level settings have been saved yet — this is a fresh tenant.
steps:
  - n: 1
    action: |
      From the home screen after sign-in, find and open the company
      settings area. (Common labels: "Company Setup," "Organization,"
      "Settings.")
    expected: |
      A page or section appears for company-level settings. Language,
      time zone, date format, and currency are visible as configurable
      options.
  - n: 2
    action: |
      Set the language to "Español (Estados Unidos)" or the equivalent
      Spanish (US) option.
    expected: |
      The selection is accepted. The page may or may not switch to
      Spanish immediately — both are acceptable.
  - n: 3
    action: |
      Save the settings.
    expected: |
      A confirmation appears. The application now displays in Spanish
      throughout — menus, buttons, labels, and any visible text.
expected_overall: |
  After save, the entire application is in Spanish. Switching back to
  English in the same settings restores English everywhere.
pass_criteria: |
  After setting language to Spanish and saving, all visible UI text
  is in Spanish (no untranslated English fragments in menus, buttons,
  or page headings).
why_this_matters: |
  A bilingual workforce relies on this setting working consistently.
  Untranslated fragments are a common bug class and undermine trust
  in the rest of the system.
modality:
  - keyboard
  - touch
est_minutes: 5
negative_variants:
  - id: P0-TENANT-002-N1
    title: Verify language change does not affect data
    action: |
      After switching to Spanish and back to English, open any
      previously entered data (e.g. the admin's profile).
    expected: |
      The data is unchanged. Names, addresses, and other entered
      content are exactly as the admin typed them.
    pass_criteria: |
      No entered data was translated, modified, or corrupted by the
      language switch.
```

## Stories

A **story** is a third entry point to the runner alongside roles+flows and the tutorial. It's a named, ordered sequence of cases — a guided narrative walk-through that takes a tester from an empty system through the complete lifecycle, with explicit role handoffs between scenes.

Stories live in `docs/stories.md` (or `docs/stories/{story-id}.md` when there are multiple). Each story is a single YAML block:

```yaml
id: lead-to-cash
name: Lead to cash from an empty system
description: |
  The canonical end-to-end test of qb-engineer. Start with a brand-new
  empty tenant and walk through every role's contribution to taking a
  customer from initial inquiry to cash applied.
chapters:
  - title: Bootstrap
    intro: |
      You are the company's first administrator. Get the tenant
      configured before anyone else can do useful work.
    scenes:
      - case: P0-INSTALL-001
        role: Administrator
      - case: P0-ADMIN-001
        role: Administrator
  - title: Sales
    intro: |
      Hand off from Administrator to Sales. Sign out and sign back in
      as a Sales / Account Manager (or stay signed in as the admin if
      your shop wears multiple hats).
    scenes:
      - case: P2-LEAD-001
        role: Sales / Account Manager
      - case: P2-LEAD-002
        role: Sales / Account Manager
```

### Scene fields

| Field | Notes |
|---|---|
| `case` | The case ID this scene runs. Must reference a real case in the library. |
| `role` | Who the tester should be signed in as for this scene. The runner detects role transitions and surfaces a logout/login prompt between scenes. |
| `note` | Optional. Scene-specific context shown above the case. |

### Chapter fields

A chapter groups consecutive scenes that share a context. The first scene of a chapter typically marks a role handoff.

| Field | Notes |
|---|---|
| `title` | Short chapter name (e.g., "Sales", "Procurement"). |
| `intro` | Plain-English context. Often includes the role-handoff instruction. |
| `scenes` | Ordered list of scene objects. |

### Skip-ahead in stories

A tester can jump into any scene of a story. The story-overview page lists every scene with its current pass/fail status and the chapter it lives in. Picking a scene mid-story skips the runner forward; the precondition text on the underlying case applies (the tester is responsible for being in the right state, same rule as skip-ahead in a regular run).

### Stories vs. flows

Flows (`docs/flows.md`) are *tags* on cases — a case can be part of several flows. Flows enable filtering ("show me only the cases for the vendor-to-asset flow"). Stories are *ordered sequences* of cases with explicit role handoffs and a chaptered narrative — they're a presentation layer, not a tag.

A story typically chains several flows together as one continuous experience: tenant-onboarding → foundational-records → vendor-to-asset → part-to-inventory → quote-to-cash.

## What's deliberately not in the schema

- **Automation hooks.** No selectors, XPath, or DOM references. These are manual cases. Adding automation hooks later is a non-breaking schema extension.
- **Severity.** Bug severity is recorded against the bug, not the case.
- **Owner / assignee.** The runner records who ran a case. The case itself doesn't pre-assign anyone.
- **Environment metadata.** Browser, OS, device — recorded by the runner per execution, not authored into the case.
