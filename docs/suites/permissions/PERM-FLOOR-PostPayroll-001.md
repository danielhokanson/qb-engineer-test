## PERM-FLOOR-PostPayroll-001 — Floor Operator cannot post payroll

```yaml
id: PERM-FLOOR-PostPayroll-001
title: Floor Operator is denied posting a payroll run
goal: |
  Verify a Floor Operator cannot post payroll, and ideally cannot
  see other employees' compensation data.
roles:
  - Floor Operator
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - At least one prepared payroll run exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any payroll surface.
    expected: |
      The payroll surface is not reachable.
  - n: 2
    action: |
      Attempt the post-payroll endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Floor Operator cannot post payroll.
pass_criteria: |
  Run not posted AND attempt rejected AND no payroll data leaked
  to this user.
est_minutes: 3
```
