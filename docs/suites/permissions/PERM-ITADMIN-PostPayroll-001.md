## PERM-ITADMIN-PostPayroll-001 — IT Admin cannot post payroll

```yaml
id: PERM-ITADMIN-PostPayroll-001
title: IT Admin is denied posting a payroll run
goal: |
  Verify an IT Admin cannot post payroll.
roles:
  - IT Admin
capabilities:
  - CAP-HR-PAYROLL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An IT Admin user exists with no other roles attached.
  - At least one prepared payroll run exists.
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Look for any payroll surface.
    expected: |
      The payroll surface is not reachable, or is read-only.
  - n: 2
    action: |
      Attempt the post-payroll endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  IT Admin cannot post payroll.
pass_criteria: |
  Run not posted AND attempt rejected.
est_minutes: 3
```
