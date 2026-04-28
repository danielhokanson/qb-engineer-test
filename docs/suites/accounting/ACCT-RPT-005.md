## ACCT-RPT-005 — AP aging matches open bills

```yaml
id: ACCT-RPT-005
title: AP aging totals to the same amount as the sum of all open vendor bills
goal: |
  Verify that the AP aging report's grand total — across all aging
  buckets — equals the sum of every open (unpaid or partially paid)
  vendor bill, and equals the AP balance on the balance sheet.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AP Clerk
capabilities:
  - CAP-RPT-FINANCIALS
  - CAP-P2P-PO
preconditions:
  - At least three open vendor bills exist with varying ages.
prerequisite_cases:
  - ACCT-AP-001
steps:
  - n: 1
    action: |
      Run the AP aging report as of today.
    expected: |
      The report groups open bills by age bucket with subtotals and
      a grand total.
  - n: 2
    action: |
      Open the list of all open bills. Sum their remaining balances
      manually.
    expected: |
      Manual sum equals the aging report's grand total.
  - n: 3
    action: |
      Compare to the AP balance on the balance sheet.
    expected: |
      Balance-sheet AP equals the aging total exactly.
expected_overall: |
  AP aging ties to the open-bill list and to the balance sheet.
pass_criteria: |
  Aging total = open-bill manual sum = balance-sheet AP, all to the
  cent.
est_minutes: 6
```
