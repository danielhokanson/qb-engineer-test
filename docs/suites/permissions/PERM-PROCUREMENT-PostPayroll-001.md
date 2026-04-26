## PERM-PROCUREMENT-PostPayroll-001 — Procurement cannot post payroll

```yaml
id: PERM-PROCUREMENT-PostPayroll-001
title: Procurement is denied posting a payroll run
goal: |
  Verify a Procurement user cannot post payroll.
roles:
  - Procurement
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one prepared payroll run exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Look for any payroll surface.
    expected: |
      The payroll surface is not reachable.
  - n: 2
    action: |
      Attempt the post-payroll endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Procurement cannot post payroll.
pass_criteria: |
  Run not posted AND attempt rejected.
est_minutes: 3
```
