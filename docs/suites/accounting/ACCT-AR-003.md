## ACCT-AR-003 — Partial payment leaves the remaining balance open

```yaml
id: ACCT-AR-003
title: Partial payment reduces the invoice but leaves the remainder due
goal: |
  Verify that when the user records a payment less than the invoice
  total, the invoice stays open with a remaining balance equal to
  the difference, and that AR and cash both reflect the partial
  amount correctly.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AR Clerk
capabilities:
  - CAP-O2C-CASH
  - CAP-O2C-INVOICE
preconditions:
  - At least one open customer invoice with a known total exists
    (use a $500.00 invoice).
prerequisite_cases:
  - ACCT-AR-001
steps:
  - n: 1
    action: |
      Note the customer's outstanding balance and the cash balance.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Record a $200.00 cash payment against the $500.00 invoice.
    expected: |
      The payment is accepted. The invoice remains open with a
      remaining balance of $300.00. Status reads "partially paid"
      or equivalent plain-language label.
  - n: 3
    action: |
      Re-check the customer balance and the cash balance.
    expected: |
      Customer outstanding decreased by exactly $200.00. Cash
      balance increased by exactly $200.00.
expected_overall: |
  Partial payment reduces but does not close the invoice; balances
  reflect only the amount actually paid.
pass_criteria: |
  Invoice still open with $300.00 remaining AND customer outstanding
  reduced by $200.00 AND cash increased by $200.00.
est_minutes: 4
```
