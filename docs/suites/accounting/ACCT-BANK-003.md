## ACCT-BANK-003 — Cleared transactions update the cash register view

```yaml
id: ACCT-BANK-003
title: After reconciliation, cleared transactions display as cleared in the register
goal: |
  Verify that once a transaction has been marked cleared in a
  reconciliation, the cash register (or bank account ledger) shows
  it as cleared with a clear visual indicator, and the cleared
  balance is calculable separately from the book balance.
optional_module: builtin-accounting
roles:
  - Shop Owner
preconditions:
  - A completed bank reconciliation exists from ACCT-BANK-002 with
    several cleared transactions.
prerequisite_cases:
  - ACCT-BANK-002
steps:
  - n: 1
    action: |
      Open the cash register / bank account view.
    expected: |
      Each transaction shows a status indicator that distinguishes
      cleared from outstanding entries (e.g., a checkmark, "C" tag,
      or plain-language "cleared" label).
  - n: 2
    action: |
      Find the cleared balance and the book balance figures.
    expected: |
      Both balances are displayed. The cleared balance reflects only
      reconciled transactions; the book balance reflects everything
      posted.
  - n: 3
    action: |
      Sort or filter the register to view only outstanding (uncleared)
      items.
    expected: |
      Only uncleared transactions are listed. Cleared items are
      hidden when filtered out.
expected_overall: |
  Cleared status is clearly displayed and useful for finding what is
  still outstanding.
pass_criteria: |
  Cleared status visible per transaction AND cleared balance and book
  balance both displayed AND filtering works.
est_minutes: 5
```
