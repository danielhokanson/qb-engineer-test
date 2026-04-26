## PERM-PROCUREMENT-ModifyTaxCodes-001 — Procurement cannot modify tax codes

```yaml
id: PERM-PROCUREMENT-ModifyTaxCodes-001
title: Procurement is denied modifying tax codes
goal: |
  Verify a Procurement user cannot modify tax codes. Procurement
  applies tax on inbound invoices but cannot redefine rates.
roles:
  - Procurement
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one tax code is configured.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Open the tax-code configuration if
      visible.
    expected: |
      Tax code admin is not reachable, or visible read-only.
  - n: 2
    action: |
      Attempt to PATCH a tax-code rate via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Procurement cannot modify tax codes.
pass_criteria: |
  Tax codes unchanged AND endpoint rejected.
est_minutes: 3
```
