## ACCT-BANK-004 — Outstanding-items list visible after reconciliation

```yaml
id: ACCT-BANK-004
title: After reconciliation, the user can list checks and deposits not yet cleared
goal: |
  Verify that the user can view a list of outstanding items —
  checks written but not yet cashed, deposits made but not yet
  posted by the bank — with totals matching the difference between
  the book balance and the last reconciled cleared balance.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
capabilities:
  - CAP-ACCT-FULLGL
preconditions:
  - A completed reconciliation exists with at least one outstanding
    check and one outstanding deposit.
prerequisite_cases:
  - ACCT-BANK-002
steps:
  - n: 1
    action: |
      Open the outstanding-items report or view.
    expected: |
      Outstanding checks and outstanding deposits are listed
      separately, each with date, payee or source, and amount.
  - n: 2
    action: |
      Add the outstanding-deposits total and subtract the
      outstanding-checks total from the last reconciled cleared
      balance.
    expected: |
      The result equals the current book balance.
expected_overall: |
  Outstanding items are listed and reconcile the book balance to the
  last cleared balance.
pass_criteria: |
  Outstanding list visible AND totals math out (cleared + outstanding
  deposits − outstanding checks = book balance).
why_this_matters: |
  When a check disappears for weeks before the bank cashes it, the
  owner needs to find it without redoing the whole reconciliation.
est_minutes: 6
```
