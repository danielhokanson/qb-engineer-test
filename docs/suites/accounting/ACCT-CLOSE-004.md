## ACCT-CLOSE-004 — Year-end roll moves balances to retained earnings

```yaml
id: ACCT-CLOSE-004
title: Year-end roll zeroes income and expense and moves the net to retained earnings
goal: |
  Verify that when the user runs the year-end roll, all income and
  expense account balances reset to zero for the new fiscal year
  and the prior year's net profit (or loss) is moved to retained
  earnings — with total equity unchanged across the roll.
optional_module: builtin-accounting
roles:
  - Shop Owner
preconditions:
  - All months in the closing fiscal year are closed.
  - A non-zero net profit exists for that year.
prerequisite_cases:
  - ACCT-CLOSE-001
steps:
  - n: 1
    action: |
      Note the year-to-date P&L's net profit, the retained-earnings
      balance, and total equity on the balance sheet.
    expected: |
      All three values visible. Record them.
  - n: 2
    action: |
      Run the year-end roll for the closing year. Confirm.
    expected: |
      The roll completes. A confirmation lists what was moved.
  - n: 3
    action: |
      Run a P&L for the new year (which has no posted activity yet).
    expected: |
      All income and expense accounts read zero.
  - n: 4
    action: |
      Run a balance sheet as of the new year's first day.
    expected: |
      Retained earnings increased by the prior year's net profit.
      Total equity equals the pre-roll total equity to the cent.
expected_overall: |
  Year-end roll resets P&L accounts, moves net to retained earnings,
  and preserves total equity.
pass_criteria: |
  Income and expense accounts at zero for the new year AND retained
  earnings up by prior-year net profit AND total equity unchanged
  across the roll.
why_this_matters: |
  A year-end roll that drops or duplicates net profit corrupts equity
  permanently. This is the single most consequential close of the year.
est_minutes: 8
```
