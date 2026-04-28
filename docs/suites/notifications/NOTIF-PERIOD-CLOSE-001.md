## NOTIF-PERIOD-CLOSE-001 — Period close pending: subledger items still open

```yaml
id: NOTIF-PERIOD-CLOSE-001
title: Period close pending alert lists subledgers with open items blocking close
goal: |
  Verify that when a fiscal period is being closed and subledgers
  (AP, AR, inventory, payroll) still have unposted or in-flight items,
  a notification fires to the controller listing each subledger and
  the count or types of blocking items.
roles:
  - Controller
  - AP Clerk
  - AR Clerk
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-ACCT-PERIOD
preconditions:
  - A fiscal period is approaching its close date.
  - At least two subledgers contain open items (e.g., unposted AP
    invoices, uninvoiced shipments).
prerequisite_cases:
  - P4-CLOSE-001
steps:
  - n: 1
    action: |
      Initiate the close-readiness check (or wait for the scheduled
      pre-close notification window).
    expected: |
      A notification fires to the controller listing each blocking
      subledger and the open item types. Subledger owners (AP / AR
      clerks) receive their specific portions.
  - n: 2
    action: |
      Resolve all open AP items but leave AR open.
    expected: |
      The next notification reflects only AR as blocking.
  - n: 3
    action: |
      Resolve remaining items.
    expected: |
      Notification clears or transitions to a "ready to close" state.
expected_overall: |
  Pre-close notifications give finance a clear, accurate punchlist.
pass_criteria: |
  Notification lists exactly the open items AND updates as items are
  resolved AND clears when none remain.
est_minutes: 9
```
