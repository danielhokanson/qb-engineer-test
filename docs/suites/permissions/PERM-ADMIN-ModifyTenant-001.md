## PERM-ADMIN-ModifyTenant-001 — Administrator can modify tenant settings

```yaml
id: PERM-ADMIN-ModifyTenant-001
title: Administrator is allowed to modify tenant settings
goal: |
  Verify an Administrator can change a tenant-level setting (e.g., a
  display preference, NOT a settings change with severe downstream
  effects) and the change persists with audit attribution.
roles:
  - Administrator
capabilities:
  - CAP-IDEN-TENANT-CONFIG
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - The Administrator user exists.
  - Tenant identity is configured.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Open company settings. Change a
      reversible field, e.g., add a secondary phone number.
    expected: |
      Change saves.
  - n: 2
    action: |
      Open the settings audit log.
    expected: |
      Change is attributed to the Administrator with a timestamp.
expected_overall: |
  Administrator modifies tenant; change is auditable.
pass_criteria: |
  Setting changed AND audit log captures user / timestamp.
est_minutes: 4
```
