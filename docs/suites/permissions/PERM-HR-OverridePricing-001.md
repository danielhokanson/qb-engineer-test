## PERM-HR-OverridePricing-001 — HR cannot override pricing

```yaml
id: PERM-HR-OverridePricing-001
title: HR is denied overriding pricing
goal: |
  Verify an HR user cannot override quote / order pricing.
roles:
  - HR
preconditions:
  - An HR user exists with no other roles attached.
  - At least one open draft quote exists.
steps:
  - n: 1
    action: |
      Sign in as HR. Look for any quote / sales-order pricing area.
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
  HR cannot override pricing.
pass_criteria: |
  No override saved AND attempts rejected.
est_minutes: 3
```
