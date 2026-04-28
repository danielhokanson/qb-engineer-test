## PERM-FLOOR-ApprovePO-001 — Floor Operator cannot approve a PO

```yaml
id: PERM-FLOOR-ApprovePO-001
title: Floor Operator is denied approving a purchase order
goal: |
  Verify a Floor Operator cannot approve POs.
roles:
  - Floor Operator
capabilities:
  - CAP-P2P-APPROVALS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - A draft PO awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any PO surface in
      navigation.
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
  Floor Operator cannot approve a PO.
pass_criteria: |
  No approval recorded AND PO unchanged AND API rejects the request.
est_minutes: 3
```
