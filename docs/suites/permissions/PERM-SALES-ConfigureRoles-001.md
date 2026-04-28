## PERM-SALES-ConfigureRoles-001 — Sales cannot configure roles

```yaml
id: PERM-SALES-ConfigureRoles-001
title: Sales / Account Manager is denied modifying role permissions
goal: |
  Verify a Sales user cannot configure role permissions.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-IDEN-ROLES
preconditions:
  - A Sales user exists with no other roles attached.
  - At least one editable role exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Look for any role-configuration area.
    expected: |
      Role config is not visible.
  - n: 2
    action: |
      Attempt the role-modify endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Sales cannot modify role permissions.
pass_criteria: |
  Role permissions unchanged AND endpoint rejected.
est_minutes: 3
```
