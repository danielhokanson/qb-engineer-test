## PERM-FLOOR-ConfigureRoles-001 — Floor Operator cannot configure roles

```yaml
id: PERM-FLOOR-ConfigureRoles-001
title: Floor Operator is denied modifying role permissions
goal: |
  Verify a Floor Operator cannot configure role permissions.
roles:
  - Floor Operator
capabilities:
  - CAP-IDEN-ROLES
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - At least one editable role exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any role-configuration area.
    expected: |
      Role config is not visible.
  - n: 2
    action: |
      Attempt the role-modify endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Floor Operator cannot modify role permissions.
pass_criteria: |
  Role permissions unchanged AND endpoint rejected.
est_minutes: 3
```
