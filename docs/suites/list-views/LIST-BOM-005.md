## LIST-BOM-005 — BOM list: export visible rows

```yaml
id: LIST-BOM-005
title: BOM list exports the currently visible rows and columns
goal: |
  Verify the BOM list export honors active filter, sort, and column
  visibility, and that revision and effectivity dates export with
  correct types.
roles:
  - Engineer / R&D
  - Production Planner
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-LIST-UX
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least 50 BOMs exist across statuses and revisions.
steps:
  - n: 1
    action: |
      Filter to status = Active, latest revision only. Sort by
      parent part ascending. Hide one column.
    expected: |
      On-screen view reflects all settings.
  - n: 2
    action: |
      Trigger CSV export.
    expected: |
      File downloads with sensible filename.
  - n: 3
    action: |
      Open in spreadsheet tool. Verify row count and column set
      match the on-screen view.
    expected: |
      Match. Hidden column absent. Effectivity dates exported as
      dates, not text.
  - n: 4
    action: |
      Verify revision column exports with the same revision label
      shown on screen.
    expected: |
      Revision label preserved exactly.
expected_overall: |
  BOM export is suitable for engineering review and external sharing.
pass_criteria: |
  Filter / sort / columns honored. Date and revision types preserved.
est_minutes: 5
```
