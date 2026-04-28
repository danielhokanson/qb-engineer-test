## PERM-SALES-ApprovePO-001 — Sales cannot approve a PO

```yaml
id: PERM-SALES-ApprovePO-001
title: Sales / Account Manager is denied approving a purchase order
goal: |
  Verify a Sales user cannot approve POs. Sales-side authority does
  not extend to vendor spend.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-P2P-APPROVALS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - A draft PO awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Open the draft PO if visible.
    expected: |
      The Approve action is hidden or disabled.
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
  Sales cannot approve a PO.
pass_criteria: |
  No approval recorded AND PO unchanged AND API rejects the request.
est_minutes: 4
```
