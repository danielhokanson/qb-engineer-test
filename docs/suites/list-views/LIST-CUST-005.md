## LIST-CUST-005 — Customer list: export visible rows

```yaml
id: LIST-CUST-005
title: Customer list exports the currently visible rows and columns
goal: |
  Verify the customer list export honors the active filter, sort,
  and column visibility choices, and produces a usable file (CSV
  and / or XLSX) that opens cleanly in standard spreadsheet tools.
roles:
  - Sales / Account Manager
  - Controller
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-LIST-UX
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least 100 customers exist. User has permission to export.
steps:
  - n: 1
    action: |
      Apply a filter (e.g., status = Active, region = West) and a
      sort (name ascending). Hide a column.
    expected: |
      List shows the filtered, sorted, reduced-column view.
  - n: 2
    action: |
      Trigger export (CSV).
    expected: |
      File downloads. Filename suggests entity and timestamp.
  - n: 3
    action: |
      Open the file in a spreadsheet tool. Verify row count, column
      set, and order match the on-screen view.
    expected: |
      Exported rows match the filtered set. Hidden column is absent.
      Column order matches on-screen order. Sort order is preserved.
  - n: 4
    action: |
      Repeat with XLSX export if offered.
    expected: |
      XLSX file opens cleanly. Numeric / date types preserved (not
      stringified).
  - n: 5
    action: |
      Export with no filter applied (full set).
    expected: |
      Full export completes. If row cap exists, system warns the
      user before silently truncating.
expected_overall: |
  Export reflects what the user sees on screen and is suitable for
  downstream analysis.
pass_criteria: |
  Filter / sort / column visibility all honored in the export. No
  silent truncation.
est_minutes: 7
```
