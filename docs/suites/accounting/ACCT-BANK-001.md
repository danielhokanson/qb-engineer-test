## ACCT-BANK-001 — Recording a deposit increases the cash balance

```yaml
id: ACCT-BANK-001
title: Recording a deposit increases cash by the deposit total
goal: |
  Verify that when the user records a bank deposit — combining one
  or more incoming payments — the cash (bank account) balance
  increases by the total of the deposited items, and each included
  item is marked as deposited.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AR Clerk
preconditions:
  - At least two received customer payments exist that have not yet
    been deposited (e.g., $200.00 and $300.00).
prerequisite_cases:
  - ACCT-AR-002
steps:
  - n: 1
    action: |
      Note the bank account balance and the "undeposited funds"
      total.
    expected: |
      Both values visible. Record them.
  - n: 2
    action: |
      Open the deposit screen. Select the two undeposited payments
      ($200.00 and $300.00) and record a single deposit of $500.00.
    expected: |
      The deposit is accepted. Each included payment is marked as
      "deposited".
  - n: 3
    action: |
      Re-check the figures.
    expected: |
      Bank balance increased by exactly $500.00. Undeposited funds
      decreased by exactly $500.00.
expected_overall: |
  A deposit moves money from the undeposited-funds holding account
  into the bank account.
pass_criteria: |
  Bank balance up by $500.00 AND undeposited funds down by $500.00
  AND both payments flagged as deposited.
est_minutes: 5
```
