## NOTIF-WO-BEHIND-001 — Work order operation past its planned end date

```yaml
id: NOTIF-WO-BEHIND-001
title: Work order operation past its planned end alerts production supervisor
goal: |
  Verify that when an in-progress operation on a work order passes
  its planned end date / time without completion, a notification fires
  to the production supervisor and the responsible work center owner.
roles:
  - Production Supervisor
  - Work Center Owner
capabilities:
  - CAP-CROSS-NOTIFICATIONS
  - CAP-MFG-MULTIOP
preconditions:
  - A work order is in progress with a routed operation that has a
    planned end date in the past (or can be backdated).
prerequisite_cases:
  - P5-WO-001
steps:
  - n: 1
    action: |
      Backdate (or wait so) an in-progress operation's planned end is
      now in the past with the operation not yet complete.
    expected: |
      An alert fires to the production supervisor and the work center
      owner naming the WO, operation, planned end, and elapsed slip.
  - n: 2
    action: |
      Complete the operation.
    expected: |
      Alert clears.
  - n: 3
    action: |
      Inspect the WO history.
    expected: |
      Slip event and resolution are recorded.
expected_overall: |
  Slip alerts give shop-floor leadership timely visibility into late ops.
pass_criteria: |
  Alert fires past planned end AND clears on completion AND history
  reflects the slip.
est_minutes: 7
```
