## PERM-PRODMGR-ModifyTenant-001 — Production Manager cannot modify tenant settings

```yaml
id: PERM-PRODMGR-ModifyTenant-001
title: Production Manager is denied modifying tenant settings
goal: |
  Verify a Production Manager cannot change tenant-level settings.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists with no other roles attached.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for any company / tenant
      settings area.
    expected: |
      The settings area is not visible or not enabled.
  - n: 2
    action: |
      Type the tenant settings URL directly.
    expected: |
      The settings form does not render.
  - n: 3
    action: |
      If an API is exposed, attempt to PATCH a tenant setting.
    expected: |
      The request is rejected.
expected_overall: |
  Production Manager cannot modify tenant settings.
pass_criteria: |
  Settings unchanged AND no path led to the form AND API rejects the
  request.
est_minutes: 3
```
