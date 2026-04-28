## PERM-FLOOR-ModifyTaxCodes-001 — Floor Operator cannot modify tax codes

```yaml
id: PERM-FLOOR-ModifyTaxCodes-001
title: Floor Operator is denied modifying tax codes
goal: |
  Verify a Floor Operator cannot modify tax codes.
roles:
  - Floor Operator
capabilities:
  - CAP-MD-TAXCODES
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - At least one tax code is configured.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for the tax-code configuration
      area.
    expected: |
      Tax code admin is not reachable.
  - n: 2
    action: |
      Attempt to PATCH a tax-code rate via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Floor Operator cannot modify tax codes.
pass_criteria: |
  Tax codes unchanged AND endpoint rejected.
est_minutes: 3
```
