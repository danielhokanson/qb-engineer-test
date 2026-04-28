## AUDIT-PRICE-OVR-001 — Price override on a quote / order is auditable

```yaml
id: AUDIT-PRICE-OVR-001
title: Quote or order price override is logged with before and after
goal: |
  Verify a Sales user's price override on a quote line shows in the
  audit log with prior price, new price, actor, and timestamp.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-O2C-QUOTE
  - CAP-CROSS-ACTIVITY-LOG
preconditions:
  - A Sales user with override permission exists.
  - At least one part with a default price exists.
prerequisite_cases:
  - PERM-SALES-OverridePricing-001
steps:
  - n: 1
    action: |
      As Sales, create a draft quote line. Override the unit price.
      Save.
    expected: |
      Override accepted.
  - n: 2
    action: |
      Open the quote / line audit log.
    expected: |
      Override is recorded with prior price, new price, actor,
      timestamp.
expected_overall: |
  Pricing overrides surface for management review.
pass_criteria: |
  Override entry present AND captures all four fields.
est_minutes: 4
```
