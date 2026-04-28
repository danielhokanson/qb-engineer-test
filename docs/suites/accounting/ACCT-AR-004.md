## ACCT-AR-004 — Overpayment becomes a credit on the customer's account

```yaml
id: ACCT-AR-004
title: Customer overpayment lands as a credit balance, not as extra revenue
goal: |
  Verify that when the user records a payment greater than the
  invoice total, the invoice is marked paid in full, the excess is
  recorded as a credit on the customer's account, and revenue is
  not overstated by the overpayment amount.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AR Clerk
capabilities:
  - CAP-O2C-CASH
  - CAP-O2C-INVOICE
  - CAP-O2C-CREDITMEMO
preconditions:
  - At least one open customer invoice for $500.00 exists.
prerequisite_cases:
  - ACCT-AR-001
steps:
  - n: 1
    action: |
      Note the customer's outstanding balance, the cash balance,
      and the period-to-date sales figure on the P&L.
    expected: |
      All three values visible. Record them.
  - n: 2
    action: |
      Record a $600.00 cash payment against the $500.00 invoice.
    expected: |
      The application accepts the payment. The user is prompted (in
      plain language) about how to treat the $100.00 excess — for
      example, "leave as a credit on the customer's account".
  - n: 3
    action: |
      Choose to leave the excess as a customer credit and confirm.
    expected: |
      The invoice is marked paid. The customer's account shows a
      credit balance of $100.00 (negative outstanding).
  - n: 4
    action: |
      Re-check cash and period sales.
    expected: |
      Cash increased by $600.00. Period sales increased by only
      $500.00 — the overpayment was not booked as revenue.
expected_overall: |
  Overpayment is captured as a customer credit; revenue reflects only
  the original invoice total.
pass_criteria: |
  Invoice marked paid AND customer credit of $100.00 visible AND cash
  up by $600.00 AND sales up by only $500.00.
why_this_matters: |
  Booking the overage as revenue creates a tax liability for money
  that may need to be refunded — and falsifies the period's income.
est_minutes: 6
```
