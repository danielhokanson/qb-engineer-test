## PERM-PROCUREMENT-ConfigureRoles-001 — Procurement cannot configure roles

```yaml
id: PERM-PROCUREMENT-ConfigureRoles-001
title: Procurement is denied modifying role permissions
goal: |
  Verify a Procurement user cannot configure role permissions.
roles:
  - Procurement
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one editable role exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Look for any role-configuration area.
    expected: |
      Role config is not visible.
  - n: 2
    action: |
      Attempt the role-modify endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Procurement cannot modify role permissions.
pass_criteria: |
  Role permissions unchanged AND endpoint rejected.
est_minutes: 3
```
