## PERM-SALES-ReleaseWO-001 — Sales cannot release a work order

```yaml
id: PERM-SALES-ReleaseWO-001
title: Sales / Account Manager is denied releasing a work order
goal: |
  Verify a Sales user cannot release work orders. They sell against
  capacity but the production schedule belongs to Production.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - At least one planned (un-released) work order exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Look for any WO release surface.
    expected: |
      No WO release surface is reachable for this role.
  - n: 2
    action: |
      Type the WO release URL directly into the address bar.
    expected: |
      The release action does not render. Permission denial or redirect.
  - n: 3
    action: |
      If an API is exposed, attempt the release-WO call.
    expected: |
      The request is rejected.
expected_overall: |
  Sales cannot release a WO.
pass_criteria: |
  No WO released AND UI denies access AND direct URL blocked AND API
  rejects the request.
est_minutes: 4
```
