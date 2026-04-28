## PERM-FLOOR-ClosePeriod-001 — Floor Operator cannot close a fiscal period

```yaml
id: PERM-FLOOR-ClosePeriod-001
title: Floor Operator is denied closing a fiscal period
goal: |
  Verify the Floor Operator role cannot close a fiscal period via UI
  or direct URL.
roles:
  - Floor Operator
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists.
  - At least one open fiscal period exists.
steps:
  - n: 1
    action: |
      Sign in as the Floor Operator. Navigate the application looking
      for any period close action.
    expected: |
      No close-period action is reachable from the UI for this role.
  - n: 2
    action: |
      Type the period-close URL directly into the address bar.
    expected: |
      The page does not render the close action. The user is shown a
      permission denial or redirected to their home.
expected_overall: |
  Floor Operator cannot close a period.
pass_criteria: |
  Period is not closed AND no route to the close action is accessible.
est_minutes: 4
```
