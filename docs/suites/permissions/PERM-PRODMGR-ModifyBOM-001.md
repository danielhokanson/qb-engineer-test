## PERM-PRODMGR-ModifyBOM-001 — Production Manager cannot modify a BOM

```yaml
id: PERM-PRODMGR-ModifyBOM-001
title: Production Manager is denied modifying a released BOM
goal: |
  Verify a Production Manager — who runs the production cycle that
  consumes BOMs — cannot modify them. BOM authority belongs to
  Engineering; production-floor edits would bypass change control.
roles:
  - Production Manager
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Production Manager user exists with no other roles attached.
  - A finished part has a released BOM.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Open the BOM. Examine the edit
      affordances.
    expected: |
      The BOM is read-only for this user. Edit / save controls are
      disabled, hidden, or replaced with view-only.
  - n: 2
    action: |
      Attempt the BOM modify endpoint via direct URL.
    expected: |
      The action is rejected with an authorization error.
  - n: 3
    action: |
      If an API is exposed, attempt the modify-BOM call.
    expected: |
      The request is rejected. The BOM is unchanged.
expected_overall: |
  Production Manager cannot modify a BOM.
pass_criteria: |
  BOM unchanged AND no new revision created AND API rejects the
  request.
why_this_matters: |
  Production sometimes wants to "just fix the BOM" when material
  reality differs from the engineering record. That bypass — even
  with good intent — destroys the engineering change-control trail.
est_minutes: 4
```
