## ACCT-AR-005 — Voiding an invoice reverses cleanly

```yaml
id: ACCT-AR-005
title: Voiding an unpaid invoice reverses AR and revenue without leaving residue
goal: |
  Verify that voiding a posted but unpaid invoice removes its impact
  from accounts receivable and from revenue, leaves the original
  invoice visible (marked void) for audit, and does not create
  duplicate or orphaned entries.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AR Clerk
preconditions:
  - At least one posted, unpaid invoice exists.
prerequisite_cases:
  - ACCT-AR-001
steps:
  - n: 1
    action: |
      Note the customer's outstanding balance and the period sales
      figure on the P&L.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Open the unpaid invoice and choose "Void".
    expected: |
      The application asks for confirmation in plain language.
      Confirming changes the invoice status to "void". The invoice
      remains in the customer's invoice history with the void label.
  - n: 3
    action: |
      Re-check the customer balance and period sales.
    expected: |
      Customer outstanding returned to its pre-invoice value. Period
      sales decreased by the invoice's pre-tax total.
expected_overall: |
  Void reverses both AR and revenue; original record preserved as void.
pass_criteria: |
  Invoice marked void AND customer outstanding back to pre-invoice
  level AND period sales reduced by the invoice total AND original
  invoice still visible in history.
est_minutes: 5
```
