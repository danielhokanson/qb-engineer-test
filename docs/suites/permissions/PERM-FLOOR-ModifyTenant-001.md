## PERM-FLOOR-ModifyTenant-001 — Floor Operator cannot modify tenant settings

```yaml
id: PERM-FLOOR-ModifyTenant-001
title: Floor Operator is denied modifying tenant settings
goal: |
  Verify a Floor Operator cannot reach or change tenant-level
  settings.
roles:
  - Floor Operator
capabilities:
  - CAP-IDEN-TENANT-CONFIG
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Search the navigation for any
      "company settings" or "settings" area.
    expected: |
      The settings area is not visible or not enabled.
  - n: 2
    action: |
      Type the tenant settings URL directly into the address bar.
    expected: |
      The settings form does not render. A permission denial appears
      or the user is redirected.
expected_overall: |
  Floor Operator cannot modify tenant settings.
pass_criteria: |
  Settings unchanged AND no path led to the form.
est_minutes: 4
```
