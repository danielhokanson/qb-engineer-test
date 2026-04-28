## PERM-SALES-ModifyBOM-001 — Sales cannot modify a BOM

```yaml
id: PERM-SALES-ModifyBOM-001
title: Sales / Account Manager is denied modifying a released BOM
goal: |
  Verify a Sales user cannot modify BOMs even when negotiating a
  custom-configured product for a customer. Engineering must own the
  configured-BOM revision; Sales requests it.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - A finished part has a released BOM.
steps:
  - n: 1
    action: |
      Sign in as Sales. Open a BOM (visibility for quoting purposes
      is acceptable).
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
  Sales cannot modify a BOM.
pass_criteria: |
  BOM unchanged AND no new revision created AND attempt rejected.
est_minutes: 3
```
