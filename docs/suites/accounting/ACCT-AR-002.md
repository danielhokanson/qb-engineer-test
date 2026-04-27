## ACCT-AR-002 — Marking an invoice paid clears it from AR

```yaml
id: ACCT-AR-002
title: Recording full payment on an invoice clears the AR balance and increases cash
goal: |
  Verify that when the user records a payment in full against an
  open invoice, the invoice is marked paid, the customer's
  outstanding balance decreases by the payment amount, and the
  shop's cash balance increases by the same amount.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AR Clerk
preconditions:
  - At least one open customer invoice with a known total exists
    (use ACCT-AR-001's $500.00 invoice).
prerequisite_cases:
  - ACCT-AR-001
steps:
  - n: 1
    action: |
      Note the customer's outstanding balance and the cash balance
      shown on the dashboard.
    expected: |
      Both values are visible. Record them.
  - n: 2
    action: |
      Open the unpaid invoice and record a cash payment for the full
      invoice total ($500.00).
    expected: |
      The payment is accepted. The invoice status changes to "paid".
  - n: 3
    action: |
      Re-check the customer balance and the shop cash balance.
    expected: |
      Customer outstanding decreased by exactly $500.00. Cash balance
      increased by exactly $500.00.
expected_overall: |
  Payment in full clears the invoice from AR and increases cash by
  the payment amount.
pass_criteria: |
  Invoice marked paid AND customer outstanding decreased by $500.00
  AND cash increased by $500.00.
est_minutes: 4
```
