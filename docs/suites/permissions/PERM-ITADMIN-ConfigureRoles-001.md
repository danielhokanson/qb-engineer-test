## PERM-ITADMIN-ConfigureRoles-001 — IT Admin can modify role permissions

```yaml
id: PERM-ITADMIN-ConfigureRoles-001
title: IT Admin is allowed to modify role permissions
goal: |
  Verify an IT Admin can change a role's permission set, and that
  the change is captured in the audit log with prior / new permission
  list.
roles:
  - IT Admin
capabilities:
  - CAP-IDEN-ROLES
preconditions:
  - An IT Admin user exists.
  - At least one editable, non-system role exists (e.g., a custom
    role created during P0).
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Open role configuration. Open a custom
      role and toggle one capability (add or remove a single
      permission).
    expected: |
      Change saves. The new permission set is now in effect for users
      assigned to that role.
  - n: 2
    action: |
      Open the role-config audit log.
    expected: |
      Change is attributed to the IT Admin with timestamp, the role
      modified, and the prior / new permission list (or diff).
expected_overall: |
  IT Admin modifies role permissions; change is fully auditable.
pass_criteria: |
  Role permissions updated AND audit log captures actor, timestamp,
  role, and before / after permission set.
est_minutes: 6
```
