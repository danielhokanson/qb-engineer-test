## BULK-WO-WORKCENTER-001 — Mass-reassign WOs to a different work center

```yaml
id: BULK-WO-WORKCENTER-001
title: Reassign a list of open WOs from one work center to another
goal: |
  Verify a production manager can mass-reassign open WOs from a
  work center going down (e.g., for maintenance) to an alternate
  work center, that capacity / scheduling is recomputed, and that
  WOs already in progress on the original work center are excluded.
roles:
  - Production Manager
  - Scheduler
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-MD-WORKCENTERS
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 5 open WOs are routed through Work Center A.
  - At least 1 of them has labor already reported on the current
    operation at Work Center A.
  - Work Center B is configured as a valid alternate.
steps:
  - n: 1
    action: |
      Filter WOs to "current operation work center = A AND status =
      Released." Select all. Choose mass-reassign work center.
      Set new work center = B.
    expected: |
      Stage preview shows affected WOs. The WO with labor in
      progress is flagged as ineligible (or surfaces a warning).
  - n: 2
    action: |
      Confirm.
    expected: |
      Eligible WOs reassigned to Work Center B. The in-progress WO
      is rejected with a reason. Capacity / schedule for B updates.
  - n: 3
    action: |
      Open one of the reassigned WOs and check its routing and
      audit log.
    expected: |
      Operation now references Work Center B. Audit captures the
      bulk reassignment with prior and new work center.
expected_overall: |
  WO reassignment respects in-progress work and updates scheduling.
pass_criteria: |
  Eligible WOs reassigned AND in-progress WO preserved AND capacity
  recomputed AND audit per WO.
est_minutes: 9
```
