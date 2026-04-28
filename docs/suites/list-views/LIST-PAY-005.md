## LIST-PAY-005 — Payment list: export visible rows

```yaml
id: LIST-PAY-005
title: Payment list exports the currently visible rows and columns
goal: |
  Verify the payment list export honors active filter, sort, and
  column visibility, and that money / date / method fields export
  with correct types.
roles:
  - AR / Collections
  - AP / Accounts Payable
  - Controller
capabilities:
  - CAP-O2C-CASH
  - CAP-CROSS-LIST-UX
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least 100 payments exist across methods, statuses, and dates.
steps:
  - n: 1
    action: |
      Filter to status = Cleared, last 30 days. Sort by posted
      date descending. Hide one column.
    expected: |
      On-screen view reflects all settings.
  - n: 2
    action: |
      Trigger CSV export.
    expected: |
      File downloads with sensible filename.
  - n: 3
    action: |
      Open in spreadsheet tool. Verify row count, column set, and
      sort order match the on-screen view.
    expected: |
      Match. Hidden column absent. Amount column exports as a
      number, not a string with currency symbol.
  - n: 4
    action: |
      Verify date columns export as dates and method column exports
      as plain text matching on-screen labels.
    expected: |
      Types preserved.
  - n: 5
    action: |
      Repeat with full unfiltered list.
    expected: |
      If a row cap exists, system warns before silently truncating.
expected_overall: |
  Payment export is suitable for bank reconciliation and audit work.
pass_criteria: |
  Filter / sort / columns honored. Money / date / method types
  preserved.
est_minutes: 6
```
