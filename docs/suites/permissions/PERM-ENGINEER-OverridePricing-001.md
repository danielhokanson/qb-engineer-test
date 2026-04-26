## PERM-ENGINEER-OverridePricing-001 — Engineer cannot override pricing

```yaml
id: PERM-ENGINEER-OverridePricing-001
title: Engineer / R&D is denied overriding pricing
goal: |
  Verify an Engineer / R&D user cannot override quote / order
  pricing. They define the product; Sales prices it.
roles:
  - Engineer / R&D
preconditions:
  - An Engineer user exists with no other roles attached.
  - At least one open draft quote exists.
steps:
  - n: 1
    action: |
      Sign in as Engineer. Look for any quote / sales-order pricing
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
  Engineer cannot override pricing.
pass_criteria: |
  No override saved AND attempts rejected.
est_minutes: 3
```
