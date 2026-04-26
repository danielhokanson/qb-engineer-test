## PERM-HR-ModifyTaxCodes-001 — HR cannot modify tax codes

```yaml
id: PERM-HR-ModifyTaxCodes-001
title: HR is denied modifying tax codes
goal: |
  Verify an HR user cannot modify tax codes — even payroll-related
  tax tables, which belong to Controller / payroll-tax governance,
  not HR.
roles:
  - HR
preconditions:
  - An HR user exists with no other roles attached.
  - At least one tax code is configured.
steps:
  - n: 1
    action: |
      Sign in as HR. Look for the tax-code configuration area.
    expected: |
      Tax code admin is not reachable.
  - n: 2
    action: |
      Attempt to PATCH a tax-code rate via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  HR cannot modify tax codes.
pass_criteria: |
  Tax codes unchanged AND endpoint rejected.
est_minutes: 3
```
