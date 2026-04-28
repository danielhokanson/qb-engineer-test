## PERM-FLOOR-ModifyBOM-001 — Floor Operator cannot modify a BOM

```yaml
id: PERM-FLOOR-ModifyBOM-001
title: Floor Operator is denied modifying a released BOM
goal: |
  Verify a Floor Operator cannot modify BOMs.
roles:
  - Floor Operator
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - A finished part has a released BOM.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Navigate to a BOM (a Floor Operator
      may need to view BOM contents to know what to consume).
    expected: |
      The BOM is read-only or not editable. No save / edit controls
      are enabled.
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
  Floor Operator cannot modify a BOM.
pass_criteria: |
  BOM unchanged AND no new revision created AND attempt rejected.
est_minutes: 3
```
