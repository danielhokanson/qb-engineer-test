## ACCT-SETUP-004 — Set the primary tax jurisdiction

```yaml
id: ACCT-SETUP-004
title: Configure the shop's home tax jurisdiction
goal: |
  Verify that the shop owner can set a primary tax jurisdiction
  (state / province / region and the corresponding default sales
  tax rate) and that new customer invoices default to that rate
  unless the customer is exempt or the destination overrides it.
optional_module: builtin-accounting
roles:
  - Shop Owner
  - Administrator
preconditions:
  - The chart of accounts has been initialized (ACCT-SETUP-001).
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Open the tax setup area.
    expected: |
      A field for primary jurisdiction and a default rate are visible
      and editable.
  - n: 2
    action: |
      Enter the home jurisdiction and a default rate (for example,
      "Ohio, 7.25%") and save.
    expected: |
      The entry is accepted; the jurisdiction and rate are recorded.
  - n: 3
    action: |
      Create a new customer invoice for a non-exempt customer with
      no destination override.
    expected: |
      The invoice's tax line picks up the home jurisdiction's rate
      automatically and labels it (e.g., "Ohio sales tax 7.25%").
expected_overall: |
  Primary jurisdiction is set once and drives invoice tax defaults.
pass_criteria: |
  Default rate applied to new invoice with correct label AND amount.
why_this_matters: |
  Shop owners should not have to type the tax rate on every invoice.
  A default that matches the home jurisdiction is the lowest-effort
  correct behavior.
est_minutes: 5
```
