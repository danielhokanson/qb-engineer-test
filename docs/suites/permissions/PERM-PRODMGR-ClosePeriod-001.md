## PERM-PRODMGR-ClosePeriod-001 — Production Manager cannot close a fiscal period

```yaml
id: PERM-PRODMGR-ClosePeriod-001
title: Production Manager is denied closing a fiscal period
goal: |
  Verify a Production Manager cannot close fiscal periods. They have
  authority over manufacturing data but no financial-calendar control.
roles:
  - Production Manager
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one open fiscal period exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for any period-close action.
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
  Production Manager cannot close a period.
pass_criteria: |
  Period not closed AND UI denies access AND direct URL blocked AND
  API rejects the request.
est_minutes: 4
```
