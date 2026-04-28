## AUDIT-PART-DEACT-001 — Part deactivation is logged with prior state

```yaml
id: AUDIT-PART-DEACT-001
title: Deactivating a part records actor, target, and prior status
goal: |
  Verify that deactivating a part records actor, timestamp, target part
  number, prior active status, and new inactive status.
roles:
  - Engineer / R&D
  - Administrator
capabilities:
  - CAP-MD-PARTS
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one active part with no open demand or supply exists.
prerequisite_cases:
  - AUDIT-PART-CREATE-001
steps:
  - n: 1
    action: |
      Deactivate the part.
    expected: |
      Part becomes inactive.
  - n: 2
    action: |
      Open the part's audit log.
    expected: |
      Deactivation entry shows actor, timestamp, prior status, new
      status, and target part number.
expected_overall: |
  Part status transitions are uniformly audited.
pass_criteria: |
  Deactivation entry present with full before/after status and attribution.
est_minutes: 3
```
