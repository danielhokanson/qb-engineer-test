## PERM-ENGINEER-ApprovePO-001 — Engineer cannot approve a PO

```yaml
id: PERM-ENGINEER-ApprovePO-001
title: Engineer / R&D is denied approving a purchase order
goal: |
  Verify an Engineer cannot approve POs even for R&D / sample-buy
  orders. Engineers may originate the demand; spend authorization
  belongs to Procurement / Controller.
roles:
  - Engineer / R&D
capabilities:
  - CAP-P2P-APPROVALS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An Engineer user exists with no other roles attached.
  - A draft PO awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Engineer. Open the draft PO if visible.
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
  Engineer cannot approve a PO.
pass_criteria: |
  No approval recorded AND PO unchanged AND API rejects the request.
est_minutes: 4
```
