## NOTIF-WO-BEHIND-002 — Work order projected to miss its due date escalates to planner

```yaml
id: NOTIF-WO-BEHIND-002
title: Cumulative slip projecting WO to miss its due date escalates to planner and customer-facing role
goal: |
  Verify that when cumulative operation slip pushes a work order's
  projected completion past its scheduled due date, an escalation alert
  fires to the production planner. If the WO is tied to a sales order
  with a customer commitment, the account manager is also notified.
roles:
  - Production Planner
  - Production Supervisor
  - Sales / Account Manager
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-MFG-MULTIOP
  - CAP-O2C-SO
preconditions:
  - A work order has multiple routed operations and a due date.
  - At least one earlier operation has slipped enough that the
    projected completion now exceeds the WO due date.
  - Optionally, the WO is linked to a sales order with a promised ship
    date.
prerequisite_cases:
  - P5-WO-001
  - NOTIF-WO-BEHIND-001
steps:
  - n: 1
    action: |
      Backdate or extend prior operations so the WO is now projected
      to finish past its due date.
    expected: |
      Escalation alert fires to the production planner. If linked to a
      sales order, the account manager also receives a notification.
  - n: 2
    action: |
      Catch up later operations so the WO can finish on time.
    expected: |
      Escalation clears (or transitions to "back on track").
  - n: 3
    action: |
      Re-slip and recover again.
    expected: |
      Each cycle produces a fresh, non-stuck escalation.
expected_overall: |
  Forward-looking slip detection reaches both production and customer-
  facing roles when commitments are at risk.
pass_criteria: |
  Escalation fires when projected end exceeds due date AND clears on
  recovery AND reaches the account manager only when a customer
  commitment exists.
est_minutes: 9
```
