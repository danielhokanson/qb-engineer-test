# Phase 1 Scenario Manifest

This file is the index the runner uses to present Phase 1 to a tester. It declares the order, the role coverage, the checkpoints, and the expected duration. The runner reads this and the case file to render the test session.

```yaml
phase: P1
title: Foundational records — locations, work centers, calendars, accounts, employees, users, assets
description: |
  Build out the records that master data and transactions will
  reference. Multi-role: Administrator + IT Admin + Controller + HR
  + Production Manager + Maintenance Manager all touch this phase.
  Most small shops collapse these to one or two people.
estimated_total_minutes: 130

default_fixture: cascade-components-mid

# Sequence: cases run in this order by default. The runner allows
# skip-ahead but warns the tester about preconditions.
sequence:
  - id: P1-LOC-001
    required: true
    note: |
      Blocking. Locations are referenced by work centers, employees,
      and assets — without one, nothing else in P1 is creatable.
  - id: P1-LOC-002
    required: false
    scale_tags: [mid-market, enterprise]
    note: |
      Optional for small-shop runs. Single-location shops can skip.

  - id: P1-WC-001
    required: true
    note: |
      Blocking. At least one work center is required for the rest of
      Phase 1 (calendar override, asset linkage).
  - id: P1-WC-002
    required: false
    note: |
      Builds out the work center list. Skip if testing only the
      minimum viable configuration.
  - id: P1-WC-003
    required: false
    scale_tags: [mid-market, enterprise]
    note: |
      Depends on P1-CAL-002 (second-shift calendar). Run only after
      that case has passed.
    prerequisite_cases:
      - P1-CAL-002

  - id: P1-UOM-001
    required: true
    note: |
      Blocking. Without standard units, parts cannot be created in
      Phase 2.
  - id: P1-UOM-002
    required: false
  - id: P1-UOM-003
    required: false

  - id: P1-GL-001
    required: true
    note: |
      Blocking. Without a chart of accounts, no financial transaction
      will post correctly.
  - id: P1-GL-002
    required: false

  - id: P1-TAX-001
    required: true
    note: |
      Required everywhere. Even tax-exempt jurisdictions need a code
      to record exemption against.
  - id: P1-TAX-002
    required: false

  - id: P1-EMP-001
    required: true
    note: |
      Blocking. The first employee record (typically the founder)
      grounds the rest of the employee/user linkage.
  - id: P1-EMP-002
    required: false
    note: |
      Skip in shops where every system user is also an employee and
      no separation is needed. Run when both concepts apply.
  - id: P1-EMP-003
    required: false
    scale_tags: [mid-market, enterprise]

  - id: P1-USER-001
    required: true
    note: |
      Required everywhere. A second user is needed to verify role
      restrictions actually restrict.
  - id: P1-USER-002
    required: true
    note: |
      Required. Without this case, the role permissions configured
      in P0 are unverified.
  - id: P1-USER-003
    required: false

  - id: P1-CAL-001
    required: true
    note: |
      Blocking. Many capacity / scheduling features in later phases
      assume a default calendar exists.
  - id: P1-CAL-002
    required: false
    scale_tags: [mid-market, enterprise]
  - id: P1-CAL-003
    required: false

  - id: P1-ASSET-001
    required: true
    note: |
      Required. Asset records anchor PM scheduling (Phase 5) and
      depreciation (Phase 5).
  - id: P1-ASSET-002
    required: false
  - id: P1-ASSET-003
    required: false
    note: |
      May not be fully runnable until Phase 2 (vendors). Stop at
      the first step that needs a non-existent record; re-run after
      Phase 2 if needed.

# Skip-ahead checkpoints: places where a tester can jump in mid-phase
# if they're testing something specific.
checkpoints:
  - after: P1-LOC-001
    state_summary: |
      Primary location exists. No work centers, no UoMs, no GL
      configured.
  - after: P1-WC-002
    state_summary: |
      One or more locations and a basic set of work centers exist.
      No UoMs, no GL, no employees.
  - after: P1-UOM-003
    state_summary: |
      Locations, work centers, and units of measure (with at least
      one custom unit and one conversion) exist. No GL, no employees.
  - after: P1-TAX-002
    state_summary: |
      Locations, work centers, UoMs, chart of accounts, and tax codes
      all exist. No employees yet.
  - after: P1-EMP-003
    state_summary: |
      All foundational records exist except calendars and assets.
      Multiple employees with varied pay types are recorded. Only
      the first administrator is linked to a user.
  - after: P1-USER-003
    state_summary: |
      Employees and users both exist. Role-based access has been
      verified. Calendars and assets not yet configured.
  - after: P1-CAL-003
    state_summary: |
      Calendars (default + second shift + planned downtime) are
      configured. Assets not yet created.

# Branch declarations referenced by cases. Phase 1 has no
# manifest-level branches — case-level branches stay within their
# case (e.g., a case may ask "are you a single-location shop?" but
# the answer doesn't change which subsequent cases are served).
branches: []

# Roles that own work in this phase. The runner uses this to
# decide which sub-phase to surface to a given tester based on
# their selected roles.
roles_introduced:
  - Administrator      # owns most of Phase 1 in small shops
  - IT Admin           # P1-USER-001/002/003
  - Controller         # P1-GL-001/002, P1-TAX-001/002, P1-ASSET-003
  - HR                 # P1-EMP-001/002/003
  - Production Manager # P1-WC-001/002/003, P1-CAL-001/002/003
  - Maintenance Manager # P1-ASSET-001/002
  - Procurement        # P1-ASSET-003

# Dedicated suites referenced by Phase 1
dedicated_suites_referenced:
  - i18n-suite
  - accessibility-suite

# What "complete" means for this phase
completion_criteria:
  - All required cases in the sequence are marked passed.
  - At least one work center, one UoM, the chart of accounts, one
    tax code, one employee, and one calendar exist.
  - Role-based access has been verified by P1-USER-002.
  - At least one fixed asset record has been created.

# What's deliberately not in this phase
out_of_scope:
  - Vendors, customers, parts, BOMs, routings — all begin in Phase 2.
  - Inventory transactions of any kind — begin in Phase 3.
  - PM schedules and inspection gates — begin in Phase 5.
  - Real outbound documents (invoices, packing slips) — Phase 4.
```

## Notes for the runner implementer

**Sequence vs. role filtering:** Sequence order is the canonical "if you ran every case in order" path. The runner filters by selected roles, but should preserve sequence order within the filtered subset. Don't shuffle within a role.

**Required vs. optional:** A few cases are marked optional but are strongly recommended. The runner should distinguish them visually in the case list (e.g., a small "optional" badge) but should not hide them. Testers should make their own call about what to skip.

**Cross-phase dependencies:** P1-ASSET-003 reaches forward into Phase 2 territory (vendors). The case acknowledges this and stops at the first dependency it can't satisfy. The runner should treat this as an expected pattern and not flag the partial run as a failure.

**Role filtering in this phase:** Phase 1 introduces six new roles. Most testers running Phase 1 are still the first administrator, so selecting "Administrator" alone surfaces the Administrator-tagged cases. Selecting additional roles (Controller, HR, etc.) surfaces those specialist cases. A small-shop tester wearing all hats selects every role.
