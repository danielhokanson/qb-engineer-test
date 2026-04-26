## PERM-ITADMIN-ClosePeriod-001 — IT Admin cannot close a fiscal period

```yaml
id: PERM-ITADMIN-ClosePeriod-001
title: IT Admin is denied closing a fiscal period
goal: |
  Verify an IT Admin user cannot close a fiscal period — period close
  is a financial action and IT has no financial authority.
roles:
  - IT Admin
preconditions:
  - An IT Admin user exists with no other roles attached.
  - At least one open fiscal period exists.
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Look for any period-close action.
    expected: |
      No close-period action is reachable.
  - n: 2
    action: |
      Type the period-close URL directly.
    expected: |
      The close action does not render. Permission denial or redirect.
  - n: 3
    action: |
      If an API is exposed, attempt the close-period call.
    expected: |
      The request is rejected with an authorization error.
expected_overall: |
  IT Admin cannot close a period.
pass_criteria: |
  Period not closed AND UI denies access AND direct URL blocked AND
  API rejects the request.
est_minutes: 4
```
