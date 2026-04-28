## PERM-SALES-OverridePricing-001 — Sales can override price (within margin guardrails)

```yaml
id: PERM-SALES-OverridePricing-001
title: Sales / Account Manager is allowed to override unit price on a quote line
goal: |
  Verify a Sales user can override the default price on a quote line
  and that the override is captured for management visibility.
roles:
  - Sales / Account Manager
capabilities:
  - CAP-O2C-QUOTE
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Sales user exists.
  - At least one customer with default pricing exists.
  - At least one finished part with a default price exists.
steps:
  - n: 1
    action: |
      Sign in as Sales. Create a draft quote for the customer with a
      line for the part. Note the default price.
    expected: |
      Default unit price populates from the customer's price list.
  - n: 2
    action: |
      Override the unit price downward by 10%. Save.
    expected: |
      Override is accepted. The quote line shows the overridden price
      with a visible indicator that it's an override.
  - n: 3
    action: |
      Open the quote audit log or the line's history.
    expected: |
      The override is recorded with the user, timestamp, prior price,
      and new price.
expected_overall: |
  Sales overrides a price; the override is captured for review.
pass_criteria: |
  Override accepted AND visibly flagged AND captured in audit.
est_minutes: 5
```
