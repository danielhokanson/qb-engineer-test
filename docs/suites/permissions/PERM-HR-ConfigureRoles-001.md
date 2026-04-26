## PERM-HR-ConfigureRoles-001 — HR cannot configure roles

```yaml
id: PERM-HR-ConfigureRoles-001
title: HR is denied modifying role permissions
goal: |
  Verify an HR user cannot configure role permissions. HR creates
  *employees* and may *assign* roles to system users, but defining
  what each role can do belongs to IT Admin / Administrator.
roles:
  - HR
preconditions:
  - An HR user exists with no other roles attached.
  - At least one editable role exists.
steps:
  - n: 1
    action: |
      Sign in as HR. Look for any role-configuration area.
    expected: |
      Role config is not visible or not enabled.
  - n: 2
    action: |
      Attempt the role-modify endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  HR cannot modify role permissions.
pass_criteria: |
  Role permissions unchanged AND endpoint rejected.
notes: |
  Assigning a role to a user is distinct from defining what a role
  can do. The first may be HR or IT depending on tenant choice; the
  second is always IT / Admin. This case asserts the second.
est_minutes: 4
```
