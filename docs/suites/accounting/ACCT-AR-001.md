## ACCT-AR-001 — Posting an invoice increases what the customer owes

```yaml
id: ACCT-AR-001
title: A new customer invoice increases the AR balance for that customer
goal: |
  Verify that when the user creates and posts a customer invoice,
  the customer's outstanding balance increases by the invoice total
  and the shop's total accounts receivable increases by the same
  amount.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AR Clerk
preconditions:
  - The accounting module is set up with a chart of accounts.
  - At least one active customer exists with a starting balance of zero.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note the customer's current outstanding balance and the shop's
      total AR figure on the dashboard.
    expected: |
      Both balances are visible. Record their values.
  - n: 2
    action: |
      Create a new invoice for that customer with at least one line
      item. Use a total of $500.00 (excluding any tax). Post the
      invoice.
    expected: |
      The invoice posts with status "open" or "unpaid". The total is
      $500.00.
  - n: 3
    action: |
      Re-open the customer record and the AR total on the dashboard.
    expected: |
      The customer's outstanding balance has increased by exactly
      $500.00. The shop-wide AR total has also increased by exactly
      $500.00.
expected_overall: |
  Posting the invoice raises both the customer-level and shop-level
  receivable balances by the invoice total.
pass_criteria: |
  Customer outstanding balance increased by $500.00 AND shop AR total
  increased by $500.00.
why_this_matters: |
  The owner needs to trust that "what customers owe" is accurate.
  An invoice that posts but does not roll into AR is the most common
  way books drift in small-shop systems.
est_minutes: 5
```
