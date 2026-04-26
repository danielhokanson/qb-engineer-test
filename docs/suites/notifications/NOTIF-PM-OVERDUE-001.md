## NOTIF-PM-OVERDUE-001 — Overdue PM alert when a scheduled PM is not started

```yaml
id: NOTIF-PM-OVERDUE-001
title: PM that's past its scheduled date triggers an overdue alert
goal: |
  Verify a scheduled PM that has not been started by its scheduled
  date fires an alert to the maintenance manager and asset owner.
roles:
  - Maintenance Manager
  - Maintenance Tech
preconditions:
  - A PM is scheduled with a date in the past (or backdate to make it
    past due).
prerequisite_cases:
  - P5-PM-001
steps:
  - n: 1
    action: |
      Configure or backdate a PM to be past its scheduled start.
    expected: |
      An overdue alert fires for the maintenance manager.
  - n: 2
    action: |
      Start the PM.
    expected: |
      Alert clears.
expected_overall: |
  Overdue PM alert fires and clears.
pass_criteria: |
  Alert fires when overdue AND clears on PM start.
est_minutes: 5
```
