## BULK-EXPORT-WO-DATE-001 — Export WOs filtered by completion date range

```yaml
id: BULK-EXPORT-WO-DATE-001
title: Export work orders completed within a specified date range
goal: |
  Verify a production manager can filter work orders by completion
  date range and export the filtered set, that the export captures
  the columns relevant to WO performance (qty good, qty scrap,
  variance), and the file is consistent with the on-screen view.
roles:
  - Production Manager
capabilities:
  - CAP-MFG-COMPLETE
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 20 closed work orders exist with completion dates
    spread across the last 90 days.
steps:
  - n: 1
    action: |
      Open the WO list. Filter to "status = Closed AND completion
      date between (today - 30) and today."
    expected: |
      Filtered list shows only WOs closed in the last 30 days.
  - n: 2
    action: |
      Export.
    expected: |
      Export contains exactly those WOs. Columns include WO number,
      part, qty good, qty scrap, variance (or equivalent
      performance columns).
  - n: 3
    action: |
      Change the filter to a 90-day window. Re-export.
    expected: |
      Row count grows accordingly. Totals reconcile to the on-
      screen totals for the new window.
expected_overall: |
  WO export honors a date-range filter and includes performance
  columns.
pass_criteria: |
  Date filter respected AND performance columns present AND totals
  reconcile.
est_minutes: 6
```
