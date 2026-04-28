## NOTIF-PM-OVERDUE-002 — Overdue PM escalates when not started past second threshold

```yaml
id: NOTIF-PM-OVERDUE-002
title: PM still not started past escalation threshold escalates to plant manager
goal: |
  Verify that an overdue PM that has not been started past a documented
  secondary threshold (e.g., 5 days past due) escalates to the plant
  manager in addition to maintenance manager.
roles:
  - Maintenance Manager
  - Plant Manager
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-MAINT-PM
preconditions:
  - A scheduled PM exists with escalation policy defined.
prerequisite_cases:
  - P5-PM-001
  - NOTIF-PM-OVERDUE-001
steps:
  - n: 1
    action: |
      Backdate the PM so it has been overdue beyond the secondary
      escalation threshold without start.
    expected: |
      The plant manager receives an escalation. Maintenance manager's
      original alert continues to show in their queue.
  - n: 2
    action: |
      Start and complete the PM.
    expected: |
      Both the original alert and the escalation clear.
expected_overall: |
  Escalation enforces accountability for chronically overdue PMs.
pass_criteria: |
  Escalation fires only past the secondary threshold AND clears with
  PM completion AND audit trail records both alerts.
est_minutes: 6
```
