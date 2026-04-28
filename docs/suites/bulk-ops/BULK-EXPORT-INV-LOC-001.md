## BULK-EXPORT-INV-LOC-001 — Export inventory on-hand for a single location

```yaml
id: BULK-EXPORT-INV-LOC-001
title: Export on-hand inventory filtered to a single location
goal: |
  Verify a warehouse supervisor can filter inventory by location,
  category, and on-hand greater than zero, and export the result.
  The export must include all visible columns and match the on-
  screen total exactly.
roles:
  - Warehouse Supervisor
  - Inventory Controller
capabilities:
  - CAP-INV-CORE
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 50 inventory rows exist across multiple locations.
  - At least one location has between 10 and 30 rows with on-hand
    > 0.
steps:
  - n: 1
    action: |
      Open the on-hand inventory list. Filter to "location =
      Warehouse 2 AND on-hand > 0 AND category = Raw."
    expected: |
      List shows only rows matching the filter. On-hand sum is
      displayed.
  - n: 2
    action: |
      Export the filtered set.
    expected: |
      Export contains the same rows and columns as the on-screen
      view. Sum of the on-hand column in the export equals the
      on-screen total.
  - n: 3
    action: |
      Open the export and check formatting (numeric columns
      numeric, dates as dates, no truncation of long part numbers).
    expected: |
      Numeric and date columns are correctly typed in the file. No
      values are truncated.
expected_overall: |
  Inventory export is faithful to the filtered view and is well-
  typed.
pass_criteria: |
  Filter honored AND totals reconcile AND data types correct.
est_minutes: 6
```
