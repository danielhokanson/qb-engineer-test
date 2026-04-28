## PERM-ITADMIN-ModifyTenant-001 — IT Admin cannot modify tenant identity

```yaml
id: PERM-ITADMIN-ModifyTenant-001
title: IT Admin is denied modifying tenant identity / company settings
goal: |
  Verify an IT Admin — who manages users and roles — cannot change
  tenant identity (legal name, address, fiscal year, primary
  currency). Those settings belong to the Administrator who originally
  configured the tenant during P0.
roles:
  - IT Admin
capabilities:
  - CAP-IDEN-TENANT-CONFIG
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An IT Admin user exists with no other roles attached.
  - Tenant identity is configured.
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Look for the company / tenant settings
      area.
    expected: |
      The company-settings area is either not visible, or visible
      read-only with no edit affordances on tenant identity fields.
  - n: 2
    action: |
      Type the tenant settings URL directly.
    expected: |
      The settings form does not render in editable mode. Permission
      denial or read-only view.
  - n: 3
    action: |
      If an API is exposed, attempt to PATCH a tenant identity field.
    expected: |
      The request is rejected.
expected_overall: |
  IT Admin cannot modify tenant identity.
pass_criteria: |
  Tenant identity unchanged AND UI denies edits AND direct URL
  blocked AND API rejects the request.
notes: |
  This is a "powerful but bounded" boundary case. IT Admin and
  Administrator are easy to conflate; this case asserts the line
  between them.
est_minutes: 4
```
