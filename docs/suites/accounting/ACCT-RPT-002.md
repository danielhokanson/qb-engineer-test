## ACCT-RPT-002 — Balance sheet as-of date balances

```yaml
id: ACCT-RPT-002
title: Balance sheet as-of any date has assets equal to liabilities plus equity
goal: |
  Verify that for any chosen as-of date, the balance sheet's total
  assets equals the sum of total liabilities and total equity to
  the cent — the fundamental accounting equation must hold.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
preconditions:
  - Some activity (invoices, bills, payments, pay runs) has been
    posted across at least two periods.
prerequisite_cases:
  - ACCT-RPT-001
steps:
  - n: 1
    action: |
      Run the balance sheet as of today.
    expected: |
      The report displays assets, liabilities, and equity sections
      with subtotals and a grand total for each.
  - n: 2
    action: |
      Confirm total assets equals total liabilities plus total
      equity exactly.
    expected: |
      Assets = liabilities + equity, no rounding off, to the cent.
  - n: 3
    action: |
      Run the balance sheet as of an earlier date (e.g., end of
      last month).
    expected: |
      The earlier date's report also balances. Activity dated after
      the as-of date is excluded.
expected_overall: |
  Balance sheet balances at every chosen date and excludes
  later-dated activity.
pass_criteria: |
  Today's balance sheet balances AND a prior-date balance sheet
  balances AND post-as-of activity is excluded.
why_this_matters: |
  A balance sheet that does not balance is useless — it indicates
  the GL is out of sync with itself.
est_minutes: 6
```
