## P5-CLOSE-005 — Year-end close and roll

```yaml
id: P5-CLOSE-005
title: Close the fiscal year and roll income-statement balances to retained earnings
goal: |
  Verify year-end close: all periods closed, year-end roll posts
  closing entries that zero income-statement accounts and post net
  income to retained earnings, and the new fiscal year opens with
  balance-sheet carryforward only.
roles:
  - Controller
flows:
  - period-close
preconditions:
  - All periods of the fiscal year are closed.
  - Net income for the year is computed (P&L).
prerequisite_cases:
  - P5-CLOSE-004
steps:
  - n: 1
    action: |
      Find the year-end close action. Trigger the year-end roll.
    expected: |
      Application generates closing entries: revenue and expense
      accounts zero out, net amount posts to Retained Earnings.
  - n: 2
    action: |
      Confirm and post.
    expected: |
      Closing entries post. New fiscal year is open.
  - n: 3
    action: |
      Run the new year's opening trial balance.
    expected: |
      Asset, liability, and equity balances carry forward. Revenue
      and expense accounts open at zero.
  - n: 4
    action: |
      Try to post a transaction dated in the closed prior year.
    expected: |
      Blocked unless the user has explicit re-open authority (per
      P5-CLOSE-004 pattern).
expected_overall: |
  Year closes, P&L resets, balance sheet carries forward.
pass_criteria: |
  Closing entries post AND new year opens with zeroed P&L AND
  carried-forward BS AND prior year is locked.
est_minutes: 10
```
