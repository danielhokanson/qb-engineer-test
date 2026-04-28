## PERM-PROCUREMENT-ClosePeriod-001 — Procurement cannot close a fiscal period

```yaml
id: PERM-PROCUREMENT-ClosePeriod-001
title: Procurement is denied closing a fiscal period
goal: |
  Verify a Procurement user cannot close fiscal periods. PO authority
  is not financial-calendar authority.
roles:
  - Procurement
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one open fiscal period exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Look for any period-close action.
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
  Procurement cannot close a period.
pass_criteria: |
  Period not closed AND UI denies access AND direct URL blocked AND
  API rejects the request.
est_minutes: 4
```
