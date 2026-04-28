## PERM-ADMIN-ClosePeriod-001 — Administrator cannot close a fiscal period

```yaml
id: PERM-ADMIN-ClosePeriod-001
title: Administrator is denied closing a fiscal period
goal: |
  Verify the Administrator role cannot close a fiscal period. Period
  close is a financial action that belongs to Controller; the
  Administrator owns tenant configuration, not finance.
roles:
  - Administrator
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - The Administrator user exists with no other roles attached.
  - At least one open fiscal period exists.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Search the navigation for a
      period-close action.
    expected: |
      No close-period action is reachable from the UI for this role.
  - n: 2
    action: |
      Type the period-close URL directly into the address bar.
    expected: |
      The page does not render the close action. Permission denial or
      redirect.
  - n: 3
    action: |
      If an API is exposed, attempt the close-period call.
    expected: |
      The request is rejected with an authorization error. The period
      is not closed.
expected_overall: |
  Administrator cannot close a fiscal period.
pass_criteria: |
  Period not closed AND UI denies access AND direct URL blocked AND
  API rejects the request.
est_minutes: 4
```
