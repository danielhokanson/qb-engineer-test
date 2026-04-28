## AUDIT-SO-CANCEL-001 — Sales order cancellation is logged with reason

```yaml
id: AUDIT-SO-CANCEL-001
title: Cancelling a confirmed SO records actor, status change, and reason
goal: |
  Verify that cancelling a confirmed SO before fulfillment records
  actor, timestamp, prior status, new "cancelled" status, and the
  reason if the system captures one.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-O2C-SO
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A confirmed SO exists with no shipments yet.
prerequisite_cases:
  - AUDIT-SO-CREATE-001
steps:
  - n: 1
    action: |
      Cancel the SO. Provide a reason if prompted.
    expected: |
      SO transitions to cancelled.
  - n: 2
    action: |
      Open the SO's audit log.
    expected: |
      Cancellation entry shows actor, timestamp, prior status, new
      status, and reason text if captured.
expected_overall: |
  SO cancellations are auditable, including any reason provided.
pass_criteria: |
  Cancellation entry present AND captures attribution AND records
  reason text when provided.
est_minutes: 3
```
