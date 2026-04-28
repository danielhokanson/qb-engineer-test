## AUDIT-PO-CLOSE-001 — PO close is logged as a status transition

```yaml
id: AUDIT-PO-CLOSE-001
title: Closing a fully-received PO is logged with prior and new status
goal: |
  Verify that closing a PO (after full receipt and matching) records
  actor, timestamp, prior status, and new "closed" status.
roles:
  - Procurement
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A PO that has been fully received and invoice-matched exists.
prerequisite_cases:
  - AUDIT-PO-CREATE-001
steps:
  - n: 1
    action: |
      Close the PO.
    expected: |
      PO transitions to closed.
  - n: 2
    action: |
      Open the PO's audit log.
    expected: |
      Close entry shows actor, timestamp, prior status, new status, and
      target PO number.
expected_overall: |
  PO status transitions are uniformly audited.
pass_criteria: |
  Close entry present with full before/after status and attribution.
est_minutes: 3
```
