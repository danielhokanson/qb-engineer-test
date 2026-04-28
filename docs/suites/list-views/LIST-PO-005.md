## LIST-PO-005 — PO list: export visible rows

```yaml
id: LIST-PO-005
title: PO list exports the currently visible rows and columns
goal: |
  Verify the PO list export honors active filter, sort, and column
  visibility, and that money / date / status fields export with
  correct types.
roles:
  - Procurement
  - Controller
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-LIST-UX
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least 100 POs exist across statuses, vendors, and dates.
steps:
  - n: 1
    action: |
      Filter to status = Issued + last 90 days. Sort by total amount
      descending. Hide one column.
    expected: |
      On-screen view reflects filter / sort / hidden column.
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
      Match. Hidden column absent. Total-amount column exports as a
      number, not a string with currency symbol.
  - n: 4
    action: |
      Verify date columns export as dates (sortable as dates in the
      spreadsheet, not as text).
    expected: |
      Dates are typed as dates.
  - n: 5
    action: |
      Repeat with full unfiltered list.
    expected: |
      If a row cap exists, system warns before silently truncating.
expected_overall: |
  PO export is suitable for downstream procurement / finance work.
pass_criteria: |
  Filter / sort / columns honored. Money / date types preserved.
est_minutes: 6
```
