## AUDIT-WO-CREATE-001 — Work order creation is logged

```yaml
id: AUDIT-WO-CREATE-001
title: Creating and releasing a work order records actor and parameters
goal: |
  Verify that creating and releasing a work order records actor,
  timestamp, target WO number, parent part, quantity, due date, and
  the BOM / routing snapshot used at release.
roles:
  - Production Planner
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A finished part with a released BOM and routing exists.
prerequisite_cases:
  - AUDIT-BOM-CREATE-001
steps:
  - n: 1
    action: |
      Create a WO for the part with a quantity and due date. Release the
      WO.
    expected: |
      WO is released.
  - n: 2
    action: |
      Open the WO's audit log.
    expected: |
      Creation and release entries are present. Each shows actor and
      timestamp. The release entry references the BOM and routing
      revisions snapshotted at release.
expected_overall: |
  WO creation and release are fully attributed and tied to the source
  BOM / routing revisions.
pass_criteria: |
  Both entries present with attribution AND BOM / routing snapshot
  references are captured at release.
est_minutes: 5
```
