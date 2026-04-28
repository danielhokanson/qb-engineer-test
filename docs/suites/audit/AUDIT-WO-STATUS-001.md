## AUDIT-WO-STATUS-001 — Work order status transitions are logged

```yaml
id: AUDIT-WO-STATUS-001
title: WO status transitions (released, in-process, on-hold) are logged
goal: |
  Verify that each status transition on a work order records actor,
  timestamp, prior status, and new status.
roles:
  - Production Planner
  - Production Operator
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-MFG-MULTIOP
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A released WO exists.
prerequisite_cases:
  - AUDIT-WO-CREATE-001
steps:
  - n: 1
    action: |
      Move the WO to in-process (start work).
    expected: |
      WO is in-process.
  - n: 2
    action: |
      Place the WO on hold with a reason. Then resume it.
    expected: |
      WO transitions to on-hold and back to in-process.
  - n: 3
    action: |
      Open the WO's audit log.
    expected: |
      Three transition entries are present (released to in-process,
      in-process to on-hold, on-hold to in-process). Each captures
      actor, timestamp, prior status, new status, and the on-hold reason.
expected_overall: |
  WO status changes are uniformly audited including reasons on hold.
pass_criteria: |
  All three transitions present with full attribution AND on-hold
  reason captured.
est_minutes: 5
```
