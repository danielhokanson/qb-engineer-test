## BULK-IMPORT-CUST-ERR-001 — Customer import with mixed valid and invalid rows

```yaml
id: BULK-IMPORT-CUST-ERR-001
title: Import a customer CSV containing valid and invalid rows
goal: |
  Verify a CSV customer import where some rows are valid and others
  fail validation produces a per-row error report, commits valid
  rows (or rolls everything back, per documented system behavior),
  and provides a downloadable error file the user can correct and
  re-upload.
roles:
  - Administrator
  - Data Steward
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-BULK-OPS
preconditions:
  - A CSV with 10 customer rows is prepared. 7 valid; 3 invalid
    with distinct errors (missing required field, malformed email,
    invalid country code).
steps:
  - n: 1
    action: |
      Open customer import. Upload the CSV. Run import.
    expected: |
      Pre-validation surfaces row-level errors before commit, OR
      commit runs and reports per-row outcome. Either way, failed
      rows are not silently dropped.
  - n: 2
    action: |
      Review the error report. Confirm each invalid row is named
      (line number) with a specific reason.
    expected: |
      Each of the 3 invalid rows has a clear, distinct error
      message. Valid rows are listed as imported (or staged).
  - n: 3
    action: |
      Download the error file. Correct the 3 errors. Re-upload only
      the corrected rows.
    expected: |
      All 3 corrected rows now import successfully. No duplicates
      from the prior partial run.
expected_overall: |
  Import surfaces row-level errors and supports correct-and-retry.
pass_criteria: |
  Valid rows imported AND errors named per row AND no duplicates on
  retry.
est_minutes: 9
```
