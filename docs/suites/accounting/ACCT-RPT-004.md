## ACCT-RPT-004 — AR aging matches open invoices

```yaml
id: ACCT-RPT-004
title: AR aging totals to the same amount as the sum of all open invoices
goal: |
  Verify that the AR aging report's grand total — across all aging
  buckets (current / 1-30 / 31-60 / 61-90 / 90+) — equals the sum
  of every open (unpaid or partially paid) invoice in the system,
  and equals the AR balance on the balance sheet.
optional_module: builtin-accounting
roles:
  - Shop Owner
  - AR Clerk
preconditions:
  - At least four open invoices exist with varying ages.
prerequisite_cases:
  - ACCT-AR-001
  - ACCT-AR-003
steps:
  - n: 1
    action: |
      Run the AR aging report as of today.
    expected: |
      The report groups open invoices by age bucket. Each bucket
      shows a subtotal. A grand total is shown.
  - n: 2
    action: |
      Open the list of all open invoices. Sum their remaining
      balances manually.
    expected: |
      Manual sum equals the aging report's grand total.
  - n: 3
    action: |
      Compare to the AR balance on the balance sheet.
    expected: |
      Balance-sheet AR equals the aging total exactly.
expected_overall: |
  AR aging total ties to the open-invoice list and to the balance
  sheet.
pass_criteria: |
  Aging total = open-invoice manual sum = balance-sheet AR, all to
  the cent.
est_minutes: 6
```
