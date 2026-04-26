## ACCT-RPT-003 — Account detail (general ledger by account)

```yaml
id: ACCT-RPT-003
title: Account-detail report lists every transaction posted to a chosen account
goal: |
  Verify that for a chosen account and date range, the
  account-detail report lists every transaction posting to that
  account with date, source (invoice / bill / payment / manual
  adjustment), reference, amount, and a running balance — and the
  ending running balance matches the account balance shown on the
  balance sheet.
optional_module: builtin-accounting
roles:
  - Shop Owner
preconditions:
  - At least five posted transactions affect the chosen account
    (e.g., cash) within the chosen date range.
prerequisite_cases:
  - ACCT-RPT-002
steps:
  - n: 1
    action: |
      Open the account-detail report. Choose "Cash" and the current
      period.
    expected: |
      Each cash-affecting transaction is listed with date, source,
      reference, amount, and running balance.
  - n: 2
    action: |
      Confirm that the count of rows equals the count of cash-affecting
      transactions you know to be posted in the period.
    expected: |
      Counts match.
  - n: 3
    action: |
      Compare the ending running balance to the cash balance shown on
      the balance sheet for the same as-of date.
    expected: |
      The two balances match exactly.
expected_overall: |
  Account-detail report enumerates every posting and its running balance
  ties to the balance sheet.
pass_criteria: |
  All posted cash transactions listed AND ending running balance equals
  balance-sheet cash balance.
est_minutes: 7
```
