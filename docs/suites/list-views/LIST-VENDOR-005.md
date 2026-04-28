## LIST-VENDOR-005 — Vendor list: export visible rows

```yaml
id: LIST-VENDOR-005
title: Vendor list exports the currently visible rows and columns
goal: |
  Verify the vendor list export honors the active filter, sort, and
  column visibility, and that 1099 / tax fields export correctly.
roles:
  - Procurement
  - Controller
capabilities:
  - CAP-MD-VENDORS
  - CAP-CROSS-LIST-UX
  - CAP-CROSS-INTEG-FILE
preconditions:
  - At least 50 vendors exist with mixed 1099 status and currencies.
steps:
  - n: 1
    action: |
      Filter to 1099-eligible. Sort by YTD spend descending. Hide
      one column.
    expected: |
      On-screen view reflects all three settings.
  - n: 2
    action: |
      Trigger CSV export.
    expected: |
      File downloads with a sensible filename.
  - n: 3
    action: |
      Open in a spreadsheet tool. Verify row count, column set,
      column order, and sort match the on-screen view.
    expected: |
      Match. Hidden column absent. Numeric YTD spend exports as a
      number, not a string.
  - n: 4
    action: |
      Verify TIN / tax-ID column (if visible and exportable) is
      formatted correctly and not silently masked.
    expected: |
      TIN format preserved. If masked on screen, masking decision in
      the export is consistent with permissions.
expected_overall: |
  Export is reliable for procurement / 1099 reporting prep.
pass_criteria: |
  Filter / sort / columns honored. Numeric and tax-ID fields
  exported with correct types.
est_minutes: 6
```
