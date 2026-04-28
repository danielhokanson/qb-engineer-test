## PERM-HR-ApprovePO-001 — HR cannot approve a PO

```yaml
id: PERM-HR-ApprovePO-001
title: HR is denied approving a purchase order
goal: |
  Verify an HR user cannot approve POs.
roles:
  - HR
capabilities:
  - CAP-P2P-APPROVALS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An HR user exists with no other roles attached.
  - A draft PO awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as HR. Look for any PO approval surface.
    expected: |
      No PO approval surface is reachable.
  - n: 2
    action: |
      Attempt the approve endpoint via direct URL.
    expected: |
      The action is rejected.
  - n: 3
    action: |
      If an API is exposed, attempt the approve-PO call.
    expected: |
      The request is rejected.
expected_overall: |
  HR cannot approve a PO.
pass_criteria: |
  No approval recorded AND PO unchanged AND API rejects the request.
est_minutes: 3
```
