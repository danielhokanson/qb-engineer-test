## PERM-ADMIN-ConfigureRoles-001 — Administrator can modify role permissions

```yaml
id: PERM-ADMIN-ConfigureRoles-001
title: Administrator is allowed to modify role permissions
goal: |
  Verify the Administrator (the founding tenant user) can also
  configure role permissions, supporting initial setup before an IT
  Admin user is created and as escalation backup later.
roles:
  - Administrator
preconditions:
  - The Administrator user exists.
  - At least one editable, non-system role exists.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Open role configuration. Toggle one
      capability on a custom role.
    expected: |
      Change saves.
  - n: 2
    action: |
      Open the role-config audit log.
    expected: |
      Change is attributed to the Administrator with timestamp, the
      role modified, and prior / new permissions.
expected_overall: |
  Administrator modifies role permissions; change is fully auditable.
pass_criteria: |
  Role permissions updated AND audit log captures actor, timestamp,
  role, and before / after permission set.
est_minutes: 5
```
