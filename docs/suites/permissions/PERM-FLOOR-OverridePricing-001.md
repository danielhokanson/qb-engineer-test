## PERM-FLOOR-OverridePricing-001 — Floor Operator cannot override pricing

```yaml
id: PERM-FLOOR-OverridePricing-001
title: Floor Operator is denied overriding pricing
goal: |
  Verify a Floor Operator cannot reach quote / order pricing
  modification at all — they should not see customer-facing prices
  in their workflow.
roles:
  - Floor Operator
capabilities:
  - CAP-O2C-QUOTE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists.
  - At least one open draft quote exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any quotes or sales-order
      pricing area in the navigation.
    expected: |
      No quote / SO pricing area is reachable from the navigation for
      this role.
  - n: 2
    action: |
      Try the quote URL directly.
    expected: |
      The quote does not render an editable pricing surface for this
      user.
expected_overall: |
  Floor Operator cannot override pricing.
pass_criteria: |
  No pricing surface reachable AND no override recorded.
est_minutes: 3
```
