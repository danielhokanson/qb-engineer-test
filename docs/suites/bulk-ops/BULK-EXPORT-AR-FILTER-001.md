## BULK-EXPORT-AR-FILTER-001 — Export AR aging with applied filter

```yaml
id: BULK-EXPORT-AR-FILTER-001
title: Export AR aging filtered to 60+ days past due
goal: |
  Verify a credit manager can apply filters to the AR aging list
  (e.g., 60+ days past due, single customer segment) and export
  only the filtered rows, that the export file matches what is
  on screen exactly, and totals reconcile.
roles:
  - Credit Manager
  - Controller
capabilities:
  - CAP-O2C-INVOICE
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 30 invoices exist across various aging buckets and
    customers.
prerequisite_cases:
  - P5-AR-AGING-001
steps:
  - n: 1
    action: |
      Open AR aging. Filter to "days past due >= 60." Sort by
      amount descending.
    expected: |
      Filtered list matches the criteria. Total at the bottom is
      visible.
  - n: 2
    action: |
      Export to CSV (or Excel, whichever is offered).
    expected: |
      Export downloads. File contains exactly the rows shown and
      in the same sort order. Header row is present. Total in the
      file matches the on-screen total.
  - n: 3
    action: |
      Add a second filter (e.g., customer segment = Wholesale).
      Re-export.
    expected: |
      The second export reflects the additional filter. Row count
      drops accordingly.
expected_overall: |
  Export honors active filters and matches the on-screen view
  exactly.
pass_criteria: |
  Export matches filter AND row order preserved AND totals
  reconcile.
est_minutes: 6
```
