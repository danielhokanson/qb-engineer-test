## PERM-WAREHOUSE-ModifyBOM-001 — Warehouse cannot modify a BOM

```yaml
id: PERM-WAREHOUSE-ModifyBOM-001
title: Warehouse / Logistics is denied modifying a released BOM
goal: |
  Verify a Warehouse user cannot modify BOMs.
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Warehouse user exists with no other roles attached.
  - A finished part has a released BOM.
steps:
  - n: 1
    action: |
      Sign in as Warehouse. Open a BOM (read-only access for picking
      visibility is acceptable).
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
  Warehouse cannot modify a BOM.
pass_criteria: |
  BOM unchanged AND no new revision created AND attempt rejected.
est_minutes: 3
```
