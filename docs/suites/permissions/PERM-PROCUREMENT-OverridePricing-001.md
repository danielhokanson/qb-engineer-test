## PERM-PROCUREMENT-OverridePricing-001 — Procurement cannot override customer pricing

```yaml
id: PERM-PROCUREMENT-OverridePricing-001
title: Procurement is denied overriding customer-facing pricing
goal: |
  Verify a Procurement user cannot override prices on quotes or
  sales orders. Procurement negotiates *vendor* prices; customer
  pricing belongs to Sales.
roles:
  - Procurement
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one open draft quote exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Look for any quote / sales-order
      pricing area.
    expected: |
      The pricing surface is not editable for this role; quotes are
      either not visible or visible read-only.
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
  Procurement cannot override customer pricing.
pass_criteria: |
  No override saved AND no override recorded AND attempts rejected.
est_minutes: 4
```
