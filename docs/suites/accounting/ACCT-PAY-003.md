## ACCT-PAY-003 — Owner draw recorded against owner's equity

```yaml
id: ACCT-PAY-003
title: Recording an owner draw decreases cash and reduces owner's equity
goal: |
  Verify that the user can record an owner's draw — money the owner
  takes out of the business that is not wages — and that cash
  decreases while owner's equity decreases by the same amount,
  with no impact on payroll, expense, or withholding accounts.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
preconditions:
  - The chart of accounts includes an owner's-equity (or owner-draw)
    account.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Note the cash balance, the owner's-equity balance, and the
      period payroll expense.
    expected: |
      All three values visible. Record them.
  - n: 2
    action: |
      Record an owner draw of $1,500.00.
    expected: |
      The draw is accepted. The user is offered owner-equity (or
      owner-draw) as the destination, in plain language — not "debit
      account", not "journal entry".
  - n: 3
    action: |
      Re-check the three figures.
    expected: |
      Cash decreased by $1,500.00. Owner's equity decreased by
      $1,500.00. Payroll expense unchanged.
expected_overall: |
  Owner draw is correctly modeled as equity withdrawal, not as wages
  or expense.
pass_criteria: |
  Cash down by $1,500.00 AND owner equity down by $1,500.00 AND no
  payroll or expense movement.
why_this_matters: |
  Booking owner draws as wages or expenses overstates costs and
  understates equity — and creates phantom payroll-tax liability the
  shop does not actually owe.
est_minutes: 5
```
