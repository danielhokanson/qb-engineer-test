## LIST-WO-005 — WO list: export visible rows

```yaml
id: LIST-WO-005
title: WO list exports the currently visible rows and columns
goal: |
  Verify the WO list export honors filter, sort, and column
  visibility, and that computed columns (% complete, variance)
  export as numbers.
roles:
  - Production Manager
  - Production Planner
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-CROSS-LIST-UX
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least 100 WOs exist across statuses with varied % complete.
steps:
  - n: 1
    action: |
      Filter to status = In-progress. Sort by due date ascending.
      Hide one default column and show % complete.
    expected: |
      On-screen view reflects all settings.
  - n: 2
    action: |
      Trigger CSV export.
    expected: |
      File downloads with sensible name.
  - n: 3
    action: |
      Open in spreadsheet tool. Verify row count, column set, sort
      order match the on-screen view.
    expected: |
      Match. % complete exports as a number (e.g., 0.45 or 45), not
      a string with a percent sign.
  - n: 4
    action: |
      Verify date columns export as dates and are sortable as dates.
    expected: |
      Dates typed correctly.
expected_overall: |
  WO export is suitable for production reporting downstream.
pass_criteria: |
  Filter / sort / columns honored. Computed and date types preserved.
est_minutes: 5
```
