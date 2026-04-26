## PERM-CONTROLLER-PostPayroll-001 — Controller cannot post payroll

```yaml
id: PERM-CONTROLLER-PostPayroll-001
title: Controller is denied posting a payroll run
goal: |
  Verify a Controller cannot post a payroll run. Although Controllers
  post general journal entries, payroll posting is HR-bound — the
  segregation prevents finance from unilaterally adjusting employee
  compensation.
roles:
  - Controller
preconditions:
  - A Controller user exists with no other roles attached.
  - At least one prepared payroll run exists.
steps:
  - n: 1
    action: |
      Sign in as Controller. Open the prepared payroll run if visible.
    expected: |
      The run is read-only for this user. The Post action is hidden
      or disabled.
  - n: 2
    action: |
      Attempt the post-payroll endpoint via direct URL or API.
    expected: |
      The action is rejected with an authorization error.
expected_overall: |
  Controller cannot post payroll.
pass_criteria: |
  Run not posted AND no payroll GL entries created by this user AND
  attempt rejected.
notes: |
  Some shops grant Controllers a backup post-payroll authority. This
  case asserts strict segregation; if your tenant policy differs,
  flip the intent and update the manifest.
est_minutes: 4
```
