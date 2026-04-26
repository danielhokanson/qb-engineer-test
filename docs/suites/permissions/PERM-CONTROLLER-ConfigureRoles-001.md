## PERM-CONTROLLER-ConfigureRoles-001 — Controller cannot configure roles

```yaml
id: PERM-CONTROLLER-ConfigureRoles-001
title: Controller is denied modifying role permissions
goal: |
  Verify a Controller cannot change role permission sets. Identity
  / authorization configuration belongs to IT Admin / Administrator;
  a Controller who can also rewrite the permission model can
  manufacture financial authority for themselves.
roles:
  - Controller
preconditions:
  - A Controller user exists with no other roles attached.
  - At least one editable role exists.
steps:
  - n: 1
    action: |
      Sign in as Controller. Look for any role-configuration area.
    expected: |
      Role config is not visible or not enabled.
  - n: 2
    action: |
      Attempt the role-modify endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Controller cannot modify role permissions.
pass_criteria: |
  Role permissions unchanged AND endpoint rejected.
why_this_matters: |
  Authorization configuration must be segregated from financial
  operations. A Controller who can also configure roles can grant
  themselves any financial capability that exists in the system.
est_minutes: 4
```
