## PERM-SALES-ModifyTaxCodes-001 — Sales cannot modify tax codes

```yaml
id: PERM-SALES-ModifyTaxCodes-001
title: Sales / Account Manager is denied modifying tax codes
goal: |
  Verify a Sales user cannot modify tax codes. Sales applies tax to
  customer documents but cannot redefine the rates themselves.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-MD-TAXCODES
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists with no other roles attached.
  - At least one tax code is configured.
steps:
  - n: 1
    action: |
      Sign in as Sales. Open the tax-code configuration area.
    expected: |
      Tax code admin is not reachable, or visible read-only.
  - n: 2
    action: |
      Attempt to PATCH a tax-code rate via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Sales cannot modify tax codes.
pass_criteria: |
  Tax codes unchanged AND endpoint rejected.
est_minutes: 3
```
