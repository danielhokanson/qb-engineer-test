## AUDIT-PERIOD-LOCK-001 — Period close and reopen are logged

```yaml
id: AUDIT-PERIOD-LOCK-001
title: Closing and reopening a fiscal period are both logged
goal: |
  Verify the close-period action and any subsequent reopen action
  both appear in the audit log with actor, period, timestamp, and
  reason (if provided).
roles:
  - Controller
preconditions:
  - A Controller user exists.
  - At least one period is in a state ready to close.
prerequisite_cases:
  - P5-CLOSE-004
steps:
  - n: 1
    action: |
      Close the period (per P5-CLOSE-004).
    expected: |
      Period closes.
  - n: 2
    action: |
      Reopen the period (per P5-CLOSE-004-N1) with a reason.
    expected: |
      Period reopens.
  - n: 3
    action: |
      Open the audit log.
    expected: |
      Both events present: close (actor, period, timestamp) and reopen
      (actor, period, timestamp, reason).
expected_overall: |
  Period state changes are fully audited including reasons on reopen.
pass_criteria: |
  Both events present AND reopen records the reason text.
est_minutes: 5
```
