## BULK-IMPORT-PART-DUP-001 — Part import that contains duplicates of existing parts

```yaml
id: BULK-IMPORT-PART-DUP-001
title: Import parts CSV containing duplicates against existing part numbers
goal: |
  Verify the part import detects rows whose part number already
  exists, offers explicit options (Skip, Update, Reject), and never
  silently overwrites an existing part without the user's choice.
roles:
  - Administrator
  - Data Steward
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 5 parts exist in the system.
  - A CSV is prepared with 8 rows; 3 rows duplicate existing part
    numbers, 5 rows are net-new.
steps:
  - n: 1
    action: |
      Run the part import. Upload the CSV.
    expected: |
      Pre-validation flags the 3 duplicate rows and offers explicit
      options (Skip, Update, Reject) per row or for the batch.
  - n: 2
    action: |
      Choose Update for the 3 duplicates. Run.
    expected: |
      The 3 existing parts are updated with new values. The 5 net-
      new parts are created. Per-row outcome reported.
  - n: 3
    action: |
      Re-run the same import without changing the choice. Pick
      Skip this time.
    expected: |
      The 3 duplicates are skipped. No silent overwrite. The 5
      net-new parts are flagged as already existing (created on
      the previous run) and skipped.
expected_overall: |
  Duplicate handling is explicit and never silent.
pass_criteria: |
  Duplicates flagged AND user choice respected AND no silent
  overwrite AND idempotent re-runs.
est_minutes: 9
```
