## PERM-ITADMIN-ModifyTaxCodes-001 — IT Admin cannot modify tax codes

```yaml
id: PERM-ITADMIN-ModifyTaxCodes-001
title: IT Admin is denied modifying tax codes
goal: |
  Verify an IT Admin cannot edit tax-code rates or GL mappings.
roles:
  - IT Admin
capabilities:
  - CAP-MD-TAXCODES
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - An IT Admin user exists with no other roles attached.
  - At least one tax code is configured.
steps:
  - n: 1
    action: |
      Sign in as IT Admin. Open the tax-code configuration if visible.
    expected: |
      Tax code edit affordances are disabled or not present.
  - n: 2
    action: |
      Attempt to PATCH a tax-code rate via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  IT Admin cannot modify tax codes.
pass_criteria: |
  Tax codes unchanged AND endpoint rejected.
est_minutes: 3
```
