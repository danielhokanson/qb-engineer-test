## PERM-PRODMGR-ModifyTaxCodes-001 — Production Manager cannot modify tax codes

```yaml
id: PERM-PRODMGR-ModifyTaxCodes-001
title: Production Manager is denied modifying tax codes
goal: |
  Verify a Production Manager cannot modify tax codes.
roles:
  - Production Manager
capabilities:
  - CAP-MD-TAXCODES
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one tax code is configured.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for the tax-code
      configuration area.
    expected: |
      Tax code admin is not reachable.
  - n: 2
    action: |
      Attempt to PATCH a tax-code rate via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Production Manager cannot modify tax codes.
pass_criteria: |
  Tax codes unchanged AND endpoint rejected.
est_minutes: 3
```
