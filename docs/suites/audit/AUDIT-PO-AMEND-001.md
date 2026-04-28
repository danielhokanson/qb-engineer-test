## AUDIT-PO-AMEND-001 — PO amendments preserve the original

```yaml
id: AUDIT-PO-AMEND-001
title: PO amendments are versioned with the original preserved
goal: |
  Verify that amending an issued PO produces a new version while the
  original remains visible in the audit history, with a clear
  before/after diff.
roles:
  - Procurement
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one issued PO exists.
prerequisite_cases:
  - P3-PO-003
steps:
  - n: 1
    action: |
      Open an issued PO. Amend a line quantity. Save.
    expected: |
      Amendment is recorded as a new version.
  - n: 2
    action: |
      Open the PO history.
    expected: |
      Original version and amended version both visible. Diff shows
      the changed line with prior and new quantity. Actor and timestamp
      attached to the amendment.
expected_overall: |
  PO history is complete and immutable for prior versions.
pass_criteria: |
  Both versions visible AND diff is clear AND actor / timestamp recorded.
est_minutes: 4
```
