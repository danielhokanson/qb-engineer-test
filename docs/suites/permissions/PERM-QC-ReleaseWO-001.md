## PERM-QC-ReleaseWO-001 — QC Inspector cannot release a work order

```yaml
id: PERM-QC-ReleaseWO-001
title: QC Inspector is denied releasing a work order
goal: |
  Verify a QC Inspector cannot release work orders. They sign off on
  inspection gates within a WO but do not release WOs to the floor.
roles:
  - QC Inspector
capabilities:
  - CAP-MFG-WO-RELEASE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A QC Inspector user exists with no other roles attached.
  - At least one planned (un-released) work order exists.
steps:
  - n: 1
    action: |
      Sign in as QC Inspector. Look for any WO release surface.
    expected: |
      No WO release surface is reachable.
  - n: 2
    action: |
      Type the WO release URL directly.
    expected: |
      The release action does not render.
  - n: 3
    action: |
      If an API is exposed, attempt the release-WO call.
    expected: |
      The request is rejected.
expected_overall: |
  QC Inspector cannot release a WO.
pass_criteria: |
  No WO released AND UI denies access AND direct URL blocked AND API
  rejects the request.
est_minutes: 4
```
