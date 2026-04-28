## PERM-SALES-PostPayroll-001 — Sales cannot post payroll

```yaml
id: PERM-SALES-PostPayroll-001
title: Sales / Account Manager is denied posting a payroll run
goal: |
  Verify a Sales user cannot post payroll.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-HR-PAYROLL
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - At least one prepared payroll run exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Look for any payroll surface.
    expected: |
      The payroll surface is not reachable.
  - n: 2
    action: |
      Attempt the post-payroll endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Sales cannot post payroll.
pass_criteria: |
  Run not posted AND attempt rejected.
est_minutes: 3
```
