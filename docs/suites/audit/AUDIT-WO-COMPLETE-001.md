## AUDIT-WO-COMPLETE-001 — Work order completion is logged with quantities

```yaml
id: AUDIT-WO-COMPLETE-001
title: Completing a WO records actor, good / scrap quantities, and close
goal: |
  Verify that completing a work order records actor, timestamp, good
  quantity, scrap quantity, and the resulting status transition to
  closed.
roles:
  - Production Operator
  - Production Planner
capabilities:
  - CAP-MFG-COMPLETE
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A WO is in-process with material issued.
prerequisite_cases:
  - AUDIT-WO-STATUS-001
steps:
  - n: 1
    action: |
      Report final completion with a good quantity and a non-zero
      scrap quantity. Close the WO.
    expected: |
      WO closes.
  - n: 2
    action: |
      Open the WO's audit log.
    expected: |
      Completion entry shows actor, timestamp, good quantity, scrap
      quantity. Close entry shows the status transition with prior and
      new status.
expected_overall: |
  WO completion captures both quantities and the status close together.
pass_criteria: |
  Completion entry records both quantities AND close entry records
  status transition AND attribution is captured on both.
est_minutes: 5
```
