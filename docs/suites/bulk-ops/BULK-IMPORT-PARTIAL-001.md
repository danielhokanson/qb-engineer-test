## BULK-IMPORT-PARTIAL-001 — Bulk import is all-or-nothing OR clearly partial

```yaml
id: BULK-IMPORT-PARTIAL-001
title: Bulk import behavior on mid-batch failure is documented and consistent
goal: |
  Verify that when an import fails mid-batch (e.g., row 50 of 100
  fails after 49 commit), the system either rolls back the entire
  batch (transactional) or commits the first 49 with explicit
  reporting of what went in. Silent partial commits are a defect.
roles:
  - Administrator
  - Data Steward
capabilities:
  - CAP-CROSS-INTEG-FILE
  - CAP-CROSS-BULK-OPS
preconditions:
  - A 100-row CSV is prepared. Row 50 contains a value guaranteed
    to fail validation late (e.g., references master data deleted
    between upload and commit, or causes a constraint violation).
steps:
  - n: 1
    action: |
      Run the import.
    expected: |
      Either: import is transactional and zero rows are committed
      with the error reported clearly, OR import commits row-by-
      row with the failed row and reason called out and the
      committed rows enumerated. The behavior matches what is
      documented for the operation.
  - n: 2
    action: |
      Inspect the system for the rows that surrounded row 50.
    expected: |
      State matches the import outcome reported. No "ghost" rows
      committed without acknowledgment. No rows committed beyond
      what the report claimed.
  - n: 3
    action: |
      Re-run the import after correcting row 50.
    expected: |
      No duplicate rows are created. Rows already committed (if
      any) are skipped or updated explicitly, not duplicated.
expected_overall: |
  Mid-batch failure produces a known outcome, never a silent
  partial commit.
pass_criteria: |
  Outcome matches documented behavior AND no silent partial commit
  AND retry idempotent.
est_minutes: 9
```
