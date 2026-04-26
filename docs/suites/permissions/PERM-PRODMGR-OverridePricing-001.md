## PERM-PRODMGR-OverridePricing-001 — Production Manager cannot override pricing

```yaml
id: PERM-PRODMGR-OverridePricing-001
title: Production Manager is denied overriding pricing
goal: |
  Verify a Production Manager cannot override quote / order pricing.
roles:
  - Production Manager
preconditions:
  - A Production Manager user exists with no other roles attached.
  - At least one open draft quote exists.
steps:
  - n: 1
    action: |
      Sign in as Production Manager. Look for any quote / sales-order
      pricing area.
    expected: |
      The pricing surface is not editable for this role.
  - n: 2
    action: |
      Try the quote URL directly and attempt to override a price.
    expected: |
      The override is rejected.
  - n: 3
    action: |
      If an API is exposed, attempt the price-override call.
    expected: |
      The request is rejected.
expected_overall: |
  Production Manager cannot override pricing.
pass_criteria: |
  No override saved AND no override recorded AND attempts rejected.
est_minutes: 4
```
