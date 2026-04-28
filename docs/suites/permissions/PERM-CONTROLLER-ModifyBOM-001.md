## PERM-CONTROLLER-ModifyBOM-001 — Controller cannot modify a BOM

```yaml
id: PERM-CONTROLLER-ModifyBOM-001
title: Controller is denied modifying a BOM
goal: |
  Verify the Controller role — which has broad financial authority
  but no engineering authority — cannot change a BOM. Engineering
  changes belong to Engineering.
roles:
  - Controller
capabilities:
  - CAP-MD-BOM
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Controller user exists.
  - A finished part has a released BOM.
steps:
  - n: 1
    action: |
      Sign in as Controller. Open the BOM. Examine the edit affordances.
    expected: |
      The BOM is read-only for this user. Edit / save controls are
      disabled, hidden, or replaced with view-only.
  - n: 2
    action: |
      Attempt the BOM modify endpoint via direct URL.
    expected: |
      The action is rejected. The BOM is unchanged.
expected_overall: |
  Controller cannot modify a BOM.
pass_criteria: |
  BOM is unchanged AND no new revision created.
notes: |
  This case probes a "powerful but bounded" role. The Controller having
  every power except this one is the kind of nuance worth verifying.
est_minutes: 4
```
