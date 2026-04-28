## AUDIT-EMP-TERM-001 — Employee termination is logged with effective date

```yaml
id: AUDIT-EMP-TERM-001
title: Terminating an employee records actor, prior status, and termination date
goal: |
  Verify that terminating an employee records actor, timestamp, prior
  active status, new terminated status, effective termination date,
  and reason if captured.
roles:
  - HR Admin
capabilities:
  - CAP-HR-TERMINATION
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - At least one active employee exists.
prerequisite_cases:
  - AUDIT-EMP-CREATE-001
steps:
  - n: 1
    action: |
      Open the employee. Terminate the record with an effective date
      and reason.
    expected: |
      Employee transitions to terminated.
  - n: 2
    action: |
      Open the employee's audit log.
    expected: |
      Termination entry shows actor, timestamp, prior status, new
      status, effective date, and reason text.
expected_overall: |
  Employee terminations are fully audited including effective date
  and reason.
pass_criteria: |
  Termination entry present AND captures attribution, status diff,
  effective date, and reason.
est_minutes: 4
```
