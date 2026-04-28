## ACCT-AP-004 — Vendor bill for a non-inventory expense

```yaml
id: ACCT-AP-004
title: A bill for a non-inventory expense routes to the right expense account
goal: |
  Verify that the user can record a vendor bill for a non-inventory
  expense (utilities, rent, supplies), pick the expense category in
  plain language, and have the expense roll into the P&L for the
  current period.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AP Clerk
capabilities:
  - CAP-ACCT-EXPENSES
  - CAP-ACCT-BUILTIN
preconditions:
  - The chart of accounts includes at least one expense account.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note the period-to-date expense total on the P&L for the
      "Utilities" or equivalent expense category.
    expected: |
      Value visible. Record it.
  - n: 2
    action: |
      Record a vendor bill for $150.00 from the electric company,
      categorized as "Utilities" (or the equivalent plain-language
      expense category). Date it within the current open period.
    expected: |
      The bill posts. AP increases by $150.00.
  - n: 3
    action: |
      Re-check the P&L.
    expected: |
      Utilities expense for the period increased by exactly $150.00.
      No inventory or other unrelated balance moved.
expected_overall: |
  Non-inventory bill increases AP and lands in the chosen expense
  category on the P&L.
pass_criteria: |
  Bill posted AND AP up by $150.00 AND Utilities expense up by $150.00
  AND inventory unchanged.
est_minutes: 5
```
