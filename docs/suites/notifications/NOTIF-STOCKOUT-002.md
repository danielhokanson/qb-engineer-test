## NOTIF-STOCKOUT-002 — Stockout on a component blocking an in-progress work order

```yaml
id: NOTIF-STOCKOUT-002
title: Component stockout that blocks an in-progress WO alerts production with WO context
goal: |
  Verify that a component reaching zero on-hand while a work order
  needs it for an upcoming operation (or is currently waiting on it)
  alerts production with the affected WO id, operation, and required
  quantity.
roles:
  - Production Planner
  - Production Supervisor
  - Procurement
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-INV-CORE
  - CAP-MFG-MATL-ISSUE
preconditions:
  - An in-progress work order requires a specific component for an
    upcoming or current operation.
prerequisite_cases:
  - P5-WO-001
  - NOTIF-STOCKOUT-001
steps:
  - n: 1
    action: |
      Drive the component's on-hand to zero (issue to another WO or
      adjust).
    expected: |
      A stockout alert fires to production with WO id, operation, and
      required quantity. Procurement also receives the alert.
  - n: 2
    action: |
      Receive enough component to satisfy the WO's need.
    expected: |
      Alert clears.
  - n: 3
    action: |
      Inspect the WO record.
    expected: |
      The WO shows a history entry for the stockout incident.
expected_overall: |
  Stockouts impacting active manufacturing are surfaced with enough
  detail to act on the right WO.
pass_criteria: |
  Alert names the affected WO and operation AND clears on receipt AND
  WO history records the incident.
est_minutes: 8
```
