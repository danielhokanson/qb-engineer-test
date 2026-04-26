## PERM-PRODMGR-ConfigureRoles-001 — Production Manager cannot configure roles

```yaml
id: PERM-PRODMGR-ConfigureRoles-001
title: Production Manager is denied modifying role permissions
goal: |
  Verify a Production Manager cannot configure role permissions.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one editable role exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for any role-configuration
      area.
    expected: |
      Role config is not visible.
  - n: 2
    action: |
      Attempt the role-modify endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Production Manager cannot modify role permissions.
pass_criteria: |
  Role permissions unchanged AND endpoint rejected.
est_minutes: 3
```
