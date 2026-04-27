## ACCT-BANK-002 — Bank reconciliation tick-and-tie

```yaml
id: ACCT-BANK-002
title: Reconciling a bank statement matches book entries to bank entries cleanly
goal: |
  Verify that the user can enter a bank statement's ending balance
  and date, mark each book entry as cleared or not, and reach a
  zero-difference reconciliation when the cleared book activity
  matches the statement.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
preconditions:
  - At least three posted cash transactions exist within a defined
    statement period (mix of deposits and bill payments).
prerequisite_cases:
  - ACCT-BANK-001
  - ACCT-AP-002
steps:
  - n: 1
    action: |
      Open the bank reconciliation screen and enter the statement
      ending balance and date.
    expected: |
      A list of unreconciled cash transactions in the period is
      shown. A running difference (book minus statement) is visible.
  - n: 2
    action: |
      Mark each transaction that appears on the statement as cleared.
    expected: |
      Each tick adjusts the running difference. The user can see in
      plain language how close they are to "balanced".
  - n: 3
    action: |
      Confirm the running difference reads zero, then finish the
      reconciliation.
    expected: |
      The reconciliation completes successfully. A reconciled-period
      record is created.
expected_overall: |
  A balanced reconciliation completes and the period's cleared
  activity is locked from edits.
pass_criteria: |
  Difference reaches zero AND reconciliation completes AND each cleared
  transaction is flagged as such.
est_minutes: 10
```
