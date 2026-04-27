## ACCT-AP-002 — Paying a vendor bill clears it from AP

```yaml
id: ACCT-AP-002
title: Recording payment of a vendor bill clears AP and reduces cash
goal: |
  Verify that recording a payment in full against an open vendor
  bill marks it paid, decreases the vendor's owed balance by the
  payment amount, and decreases cash by the same amount.
optional_module: builtin-accounting
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AP Clerk
preconditions:
  - At least one open vendor bill with a known total exists
    (use ACCT-AP-001's $300.00 bill).
prerequisite_cases:
  - ACCT-AP-001
steps:
  - n: 1
    action: |
      Note the vendor owed balance and the cash balance.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Open the unpaid bill and record a cash payment for the full
      bill total ($300.00).
    expected: |
      The payment is accepted. The bill's status changes to "paid".
  - n: 3
    action: |
      Re-check the vendor balance and the cash balance.
    expected: |
      Vendor owed decreased by exactly $300.00. Cash balance decreased
      by exactly $300.00.
expected_overall: |
  Payment clears the bill from AP and reduces cash by the payment
  amount.
pass_criteria: |
  Bill marked paid AND vendor owed decreased by $300.00 AND cash
  decreased by $300.00.
est_minutes: 4
```
