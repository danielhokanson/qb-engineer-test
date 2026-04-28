## PERM-QC-ModifyBOM-001 — QC Inspector cannot modify a BOM

```yaml
id: PERM-QC-ModifyBOM-001
title: QC Inspector is denied modifying a released BOM
goal: |
  Verify a QC Inspector cannot modify BOMs. They reference BOMs
  during inspection but corrections must flow through Engineering's
  change-control process.
roles:
  - QC Inspector
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A QC Inspector user exists with no other roles attached.
  - A finished part has a released BOM.
steps:
  - n: 1
    action: |
      Sign in as QC. Open a BOM.
    expected: |
      The BOM is read-only.
  - n: 2
    action: |
      Attempt the BOM modify endpoint via direct URL.
    expected: |
      The action is rejected.
  - n: 3
    action: |
      If an API is exposed, attempt the modify-BOM call.
    expected: |
      The request is rejected.
expected_overall: |
  QC Inspector cannot modify a BOM.
pass_criteria: |
  BOM unchanged AND no new revision created AND attempt rejected.
est_minutes: 3
```
