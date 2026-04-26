## ACCT-JE-001 — Manual adjustment posts when both sides balance

```yaml
id: ACCT-JE-001
title: Manual adjustment with equal additions and subtractions posts cleanly
goal: |
  Verify that when the user enters a manual adjustment (the
  underlying journal entry, but presented as "manual adjustment"
  in the UI) with at least one account amount added and one
  subtracted, posting succeeds only when the additions equal the
  subtractions to the cent.
optional_module: builtin-accounting
roles:
  - Shop Owner
preconditions:
  - The accounting module is set up with a chart of accounts.
  - The user has permission to record manual adjustments.
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Open the manual-adjustment screen and enter two lines that
      balance — for example, $50.00 added to "Office supplies"
      expense and $50.00 subtracted from "Cash". Add a memo
      explaining the reason.
    expected: |
      The form shows the additions and subtractions totals; both
      read $50.00. A running "out of balance" indicator reads zero.
  - n: 2
    action: |
      Save and post the adjustment.
    expected: |
      The adjustment posts. A confirmation appears with the entry
      reference number.
  - n: 3
    action: |
      Re-check the affected account balances.
    expected: |
      Office supplies expense increased by $50.00. Cash decreased by
      $50.00. No other balances moved.
expected_overall: |
  A balanced adjustment posts and updates exactly the affected accounts.
pass_criteria: |
  Adjustment posted AND office-supplies expense up by $50.00 AND cash
  down by $50.00 AND nothing else changed.
est_minutes: 6
```
