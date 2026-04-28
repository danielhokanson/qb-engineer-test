## BULK-PART-DEACT-001 — Mass-deactivate parts with no recent activity

```yaml
id: BULK-PART-DEACT-001
title: Bulk-deactivate parts unused for N years and not on any open BOM
goal: |
  Verify a planner can mass-deactivate a set of stale parts, that
  parts referenced by an active BOM, open WO, or open PO are
  excluded with a stated reason, and the operation never silently
  skips a row.
roles:
  - Planner
  - Engineering
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 8 parts exist; at least 3 have no transaction in the
    last 2 years; at least 1 of those is still referenced on an
    active BOM.
steps:
  - n: 1
    action: |
      Find or build a filter "no transactions in 2 years." Select
      the resulting set, deliberately including the part still on
      an active BOM.
    expected: |
      Filter returns the relevant set.
  - n: 2
    action: |
      Choose bulk-deactivate. Confirm.
    expected: |
      Per-row result: parts not referenced anywhere are deactivated.
      The part on an active BOM is rejected with reason "Referenced
      by active BOM."
  - n: 3
    action: |
      Try to add a deactivated part to a new BOM or PO line.
    expected: |
      Selection blocked or hidden from active-only pickers.
expected_overall: |
  Bulk deactivate respects referential guardrails.
pass_criteria: |
  Eligible parts deactivated AND ineligible flagged AND no silent
  skips.
est_minutes: 7
```
