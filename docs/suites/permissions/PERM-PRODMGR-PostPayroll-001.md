## PERM-PRODMGR-PostPayroll-001 — Production Manager cannot post payroll

```yaml
id: PERM-PRODMGR-PostPayroll-001
title: Production Manager is denied posting a payroll run
goal: |
  Verify a Production Manager — who approves labor time entries —
  cannot post payroll. Time-approval and payroll-post must be
  segregated to prevent fraud.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one prepared payroll run exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for any payroll surface.
    expected: |
      The payroll surface is not reachable.
  - n: 2
    action: |
      Attempt the post-payroll endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Production Manager cannot post payroll.
pass_criteria: |
  Run not posted AND attempt rejected.
why_this_matters: |
  Production Managers approve hours; if they could also post
  payroll, they could approve fraudulent time and pay it out
  without independent review. The segregation is the control.
est_minutes: 4
```
