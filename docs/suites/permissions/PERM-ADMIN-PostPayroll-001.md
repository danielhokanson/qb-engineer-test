## PERM-ADMIN-PostPayroll-001 — Administrator cannot post payroll

```yaml
id: PERM-ADMIN-PostPayroll-001
title: Administrator is denied posting a payroll run
goal: |
  Verify the Administrator cannot post payroll. Payroll is HR-bound;
  tenant administration is a separate authority.
roles:
  - Administrator
capabilities:
  - CAP-HR-PAYROLL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - The Administrator user exists with no other roles attached.
  - At least one prepared payroll run exists.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Look for any payroll surface.
    expected: |
      The payroll surface is read-only or not reachable.
  - n: 2
    action: |
      Attempt the post-payroll endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Administrator cannot post payroll.
pass_criteria: |
  Run not posted AND attempt rejected.
est_minutes: 4
```
