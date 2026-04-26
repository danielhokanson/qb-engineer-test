## PERM-PRODMGR-ApprovePO-001 — Production Manager cannot approve a PO

```yaml
id: PERM-PRODMGR-ApprovePO-001
title: Production Manager is denied approving a purchase order
goal: |
  Verify a Production Manager — who often originates the demand
  behind a PO — cannot approve the PO themselves. Authorization to
  spend belongs to Procurement / Controller; segregating request
  from approval is the whole point.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists with no other roles attached.
  - A draft PO awaiting approval exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Open the draft PO (read-only
      access for visibility into incoming materials is acceptable).
    expected: |
      The Approve action is hidden, disabled, or replaced with a
      "request approval" handoff.
  - n: 2
    action: |
      Attempt the approve endpoint via direct URL.
    expected: |
      The action is rejected with an authorization error.
  - n: 3
    action: |
      If an API is exposed, attempt the approve-PO call.
    expected: |
      The request is rejected.
expected_overall: |
  Production Manager cannot approve a PO.
pass_criteria: |
  No approval recorded AND PO state unchanged AND API rejects the
  request.
why_this_matters: |
  Letting the requester approve their own PO breaks the most basic
  spend control in any organization. This case is a high-priority
  check whenever a "manager" role gains broad UI access.
est_minutes: 4
```
