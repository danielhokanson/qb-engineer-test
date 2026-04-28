## PERM-WAREHOUSE-OverridePricing-001 — Warehouse cannot override pricing

```yaml
id: PERM-WAREHOUSE-OverridePricing-001
title: Warehouse / Logistics is denied overriding pricing
goal: |
  Verify a Warehouse user cannot override quote / order pricing.
roles:
  - Warehouse / Logistics
capabilities:
  - CAP-O2C-QUOTE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Warehouse user exists with no other roles attached.
  - At least one open draft quote exists.
steps:
  - n: 1
    action: |
      Sign in as Warehouse. Look for any quote / sales-order pricing
      area.
    expected: |
      No editable pricing surface is reachable.
  - n: 2
    action: |
      Try the quote URL directly.
    expected: |
      The quote does not render an editable pricing surface.
  - n: 3
    action: |
      If an API is exposed, attempt the price-override call.
    expected: |
      The request is rejected.
expected_overall: |
  Warehouse cannot override pricing.
pass_criteria: |
  No override saved AND attempts rejected.
est_minutes: 3
```
