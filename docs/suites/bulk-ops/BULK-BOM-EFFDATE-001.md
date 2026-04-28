## BULK-BOM-EFFDATE-001 — Mass-update BOM component effectivity dates

```yaml
id: BULK-BOM-EFFDATE-001
title: Bulk-shift effectivity start date on a set of BOM components
goal: |
  Verify an engineering planner can mass-update effectivity start
  dates on a filtered set of BOM component lines (e.g., delaying
  a sub-component rollout by two weeks), with per-line preview and
  audit, and that already-released WOs using the prior dates are
  not retroactively altered.
roles:
  - Engineering Planner
  - Production Manager
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 3 BOMs exist with components scheduled for a future
    effectivity date.
  - At least 1 WO is already released referencing the current
    effective component.
steps:
  - n: 1
    action: |
      Filter BOM component lines to "effectivity start = next
      Monday." Select all. Choose mass-shift effectivity. Set new
      start = next Monday + 14 days.
    expected: |
      Stage preview shows old date and new date per line.
  - n: 2
    action: |
      Confirm.
    expected: |
      All selected lines updated. Summary reports rows changed.
  - n: 3
    action: |
      Open the already-released WO that referenced the prior
      effective component.
    expected: |
      The WO retains its original component reference — the bulk
      shift applies only to BOM master, not to WOs already in
      flight.
expected_overall: |
  Effectivity bulk-shift moves master data without disturbing live
  WOs.
pass_criteria: |
  Effectivity dates shifted AND released WO unchanged AND audit per
  line.
est_minutes: 8
```
