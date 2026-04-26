## PERM-HR-ClosePeriod-001 — HR cannot close a fiscal period

```yaml
id: PERM-HR-ClosePeriod-001
title: HR is denied closing a fiscal period
goal: |
  Verify an HR user cannot close fiscal periods. HR runs payroll but
  does not own the financial calendar.
roles:
  - HR
preconditions:
  - An HR user exists with no other roles attached.
  - At least one open fiscal period exists.
steps:
  - n: 1
    action: |
      Sign in as HR. Look for any period-close action.
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
  HR cannot close a period.
pass_criteria: |
  Period not closed AND UI denies access AND direct URL blocked AND
  API rejects the request.
est_minutes: 4
```
