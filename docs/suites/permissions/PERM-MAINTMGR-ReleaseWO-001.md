## PERM-MAINTMGR-ReleaseWO-001 — Maintenance Manager cannot release a production work order

```yaml
id: PERM-MAINTMGR-ReleaseWO-001
title: Maintenance Manager is denied releasing a production work order
goal: |
  Verify a Maintenance Manager — who releases maintenance work orders
  for assets — cannot release production work orders. The two
  surfaces share UI patterns; their permissions must not bleed.
roles:
  - Maintenance Manager
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Maintenance Manager user exists with no other roles attached.
  - At least one planned (un-released) production work order exists.
steps:
  - n: 1
    action: |
      Sign in as Maintenance Manager. Look for any production WO
      release surface (separate from maintenance WOs).
    expected: |
      Either the production WO release surface is not reachable, or
      it is read-only with no release action enabled.
  - n: 2
    action: |
      If a production-WO release URL is reachable, attempt it.
    expected: |
      The action is rejected with an authorization error.
  - n: 3
    action: |
      If an API is exposed, attempt the production-WO release call.
    expected: |
      The request is rejected.
expected_overall: |
  Maintenance Manager cannot release a production WO.
pass_criteria: |
  No production WO released AND release action not enabled or
  rejected AND API rejects the request.
notes: |
  Maintenance and production work-order workflows often share code
  paths; this case verifies that the role split is honored on the
  production side specifically.
est_minutes: 4
```
