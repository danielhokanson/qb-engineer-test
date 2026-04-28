## PERM-SALES-ClosePeriod-001 — Sales cannot close a fiscal period

```yaml
id: PERM-SALES-ClosePeriod-001
title: Sales / Account Manager is denied closing a fiscal period
goal: |
  Verify a Sales user cannot close fiscal periods.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - At least one open fiscal period exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Look for any period-close action.
    expected: |
      No close-period action is reachable.
  - n: 2
    action: |
      Type the period-close URL directly.
    expected: |
      The close action does not render.
  - n: 3
    action: |
      If an API is exposed, attempt the close-period call.
    expected: |
      The request is rejected.
expected_overall: |
  Sales cannot close a period.
pass_criteria: |
  Period not closed AND UI denies access AND direct URL blocked AND
  API rejects the request.
est_minutes: 4
```
