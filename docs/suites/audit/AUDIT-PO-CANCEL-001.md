## AUDIT-PO-CANCEL-001 — PO cancellation is logged with reason

```yaml
id: AUDIT-PO-CANCEL-001
title: Cancelling an issued PO records actor, status change, and reason
goal: |
  Verify that cancelling an issued PO before any receipt records actor,
  timestamp, prior status, new "cancelled" status, and the cancellation
  reason if the system collects one.
roles:
  - Procurement
capabilities:
  - CAP-P2P-PO
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - An issued PO with no receipts exists.
prerequisite_cases:
  - AUDIT-PO-CREATE-001
steps:
  - n: 1
    action: |
      Cancel the PO. Provide a reason if prompted.
    expected: |
      PO transitions to cancelled.
  - n: 2
    action: |
      Open the PO's audit log.
    expected: |
      Cancellation entry shows actor, timestamp, prior status, new
      status, and reason text if a reason was captured.
expected_overall: |
  PO cancellations are auditable, including any reason provided.
pass_criteria: |
  Cancellation entry present AND captures attribution AND records
  reason text when provided.
est_minutes: 3
```
