## BULK-IMPORT-VENDOR-VAL-001 — Vendor import enforces master-data validation

```yaml
id: BULK-IMPORT-VENDOR-VAL-001
title: Vendor CSV import rejects rows referencing invalid master data
goal: |
  Verify the vendor import rejects rows whose payment-terms code,
  currency code, or country reference does not exist as configured
  master data, with a precise per-row error message — not a
  generic "import failed."
roles:
  - Administrator
  - Procurement
capabilities:
  - CAP-MD-VENDORS
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-BULK-OPS
preconditions:
  - Payment-terms list, currency list, and country list are
    configured.
  - A CSV is prepared with 6 rows. 4 reference valid codes. 2
    reference codes that do not exist (e.g., "Net 99," currency
    "ZZZ").
steps:
  - n: 1
    action: |
      Run the vendor import. Upload CSV.
    expected: |
      Validation runs before commit (or rejects per row) with the
      2 invalid rows surfaced.
  - n: 2
    action: |
      Read the error per invalid row.
    expected: |
      Each error names the field, the bad value, and what the
      acceptable values are (or how to find them). Not a generic
      message.
  - n: 3
    action: |
      Correct the 2 rows in the source CSV. Re-upload.
    expected: |
      All 6 rows import. No master data was created automatically
      from the bad codes during the prior run.
expected_overall: |
  Master-data validation is strict, precise, and never auto-creates
  reference data from import.
pass_criteria: |
  Bad codes named precisely AND no auto-create AND retry succeeds.
est_minutes: 8
```
