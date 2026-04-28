## PERM-ADMIN-ModifyTaxCodes-001 — Administrator cannot modify tax codes

```yaml
id: PERM-ADMIN-ModifyTaxCodes-001
title: Administrator is denied modifying tax codes
goal: |
  Verify the Administrator cannot edit tax-code rates or GL mappings.
  Tax setup is a financial-control function that belongs to the
  Controller; the Administrator owns tenant identity, not finance.
roles:
  - Administrator
capabilities:
  - CAP-MD-TAXCODES
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - The Administrator user exists with no other roles attached.
  - At least one tax code is configured.
steps:
  - n: 1
    action: |
      Sign in as Administrator. Open the tax-code configuration.
    expected: |
      The tax-code list is read-only or not visible. Edit affordances
      on individual tax codes are disabled.
  - n: 2
    action: |
      Attempt to PATCH a tax-code rate via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Administrator cannot modify tax codes.
pass_criteria: |
  Tax codes unchanged AND endpoint rejected.
est_minutes: 4
```
