## PERM-CONTROLLER-ModifyTenant-001 — Controller cannot modify tenant identity

```yaml
id: PERM-CONTROLLER-ModifyTenant-001
title: Controller is denied modifying tenant identity / company settings
goal: |
  Verify a Controller cannot change tenant identity. Controllers own
  the chart of accounts and financial calendar but not the tenant's
  legal identity, time zone, or primary currency selection.
roles:
  - Controller
capabilities:
  - CAP-IDEN-TENANT-CONFIG
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Controller user exists with no other roles attached.
  - Tenant identity is configured.
steps:
  - n: 1
    action: |
      Sign in as Controller. Look for the company / tenant settings
      area.
    expected: |
      The company-settings area is either not visible, or read-only
      on tenant identity fields. Financial-calendar adjacent fields
      may remain editable separately.
  - n: 2
    action: |
      Type the tenant settings URL directly and try editing legal
      name or fiscal-year start.
    expected: |
      Edits are rejected. Settings unchanged.
  - n: 3
    action: |
      If an API is exposed, attempt to PATCH a tenant identity field.
    expected: |
      The request is rejected.
expected_overall: |
  Controller cannot modify tenant identity.
pass_criteria: |
  Tenant identity unchanged AND UI denies edits AND API rejects the
  request.
notes: |
  Controllers DO own the chart of accounts, fiscal periods, and tax
  setup — those are tested separately under their own capabilities.
  This case is specifically about tenant identity / company
  settings.
est_minutes: 4
```
