## PERM-PROCUREMENT-ModifyBOM-001 — Procurement cannot modify a BOM

```yaml
id: PERM-PROCUREMENT-ModifyBOM-001
title: Procurement is denied modifying a released BOM
goal: |
  Verify a Procurement user cannot modify BOMs. They source the
  components a BOM enumerates but the BOM itself is engineering-owned.
roles:
  - Procurement
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Procurement user exists with no other roles attached.
  - A finished part has a released BOM.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Open a BOM. Examine edit affordances.
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
  Procurement cannot modify a BOM.
pass_criteria: |
  BOM unchanged AND no new revision created AND attempt rejected.
est_minutes: 3
```
