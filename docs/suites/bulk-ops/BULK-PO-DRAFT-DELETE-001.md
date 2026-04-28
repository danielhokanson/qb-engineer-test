## BULK-PO-DRAFT-DELETE-001 — Mass-delete stale draft POs

```yaml
id: BULK-PO-DRAFT-DELETE-001
title: Bulk-delete draft POs older than 90 days that were never approved
goal: |
  Verify a buyer can mass-delete a set of stale draft POs, that no
  PO that has ever been submitted, approved, sent, or received is
  eligible, and the operation reports per-row outcome.
roles:
  - Buyer
  - Procurement
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 6 POs exist in Draft status with creation date over
    90 days ago.
  - At least 1 PO has been submitted (not draft) and should be
    invisible to this operation.
steps:
  - n: 1
    action: |
      Filter POs to "status = Draft AND created < 90 days ago."
    expected: |
      Filter returns only draft POs older than 90 days. Submitted
      POs are not in the result set.
  - n: 2
    action: |
      Select all. Choose bulk-delete. Confirm.
    expected: |
      All selected drafts deleted. Summary reports row count.
  - n: 3
    action: |
      Try to retrieve one of the deleted POs by its prior PO number.
    expected: |
      Not found in active or archived PO lists. The PO number itself
      is not reused for a future PO.
expected_overall: |
  Mass delete is scoped tightly and never reuses identifiers.
pass_criteria: |
  Stale drafts deleted AND non-draft POs untouched AND PO numbers
  not reused.
est_minutes: 6
```
