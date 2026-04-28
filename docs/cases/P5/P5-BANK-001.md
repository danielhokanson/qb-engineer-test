## P5-BANK-001 — Bank reconciliation

```yaml
id: P5-BANK-001
title: Reconcile a bank account against a statement
goal: |
  Verify the bank reconciliation workflow: import or enter the
  bank statement, match each line to a system record (deposit,
  payment, JE), identify unmatched items, post adjustments where
  appropriate, and close the reconciliation with a balanced result.
roles:
  - Controller
flows:
  - period-close
capabilities:
  - CAP-ACCT-FULLGL
preconditions:
  - A cash GL account exists.
  - At least one customer payment and one vendor payment have posted
    in the period.
prerequisite_cases:
  - P3-PAY-001
  - P4-CASH
steps:
  - n: 1
    action: |
      Find the bank reconciliation area. Start a new reconciliation
      for the cash account, with a statement ending balance and date.
    expected: |
      Reconciliation form opens with system register on one side,
      statement entries on the other.
  - n: 2
    action: |
      Import or paste the bank statement (or enter manually). Match
      each statement line to a system record.
    expected: |
      Matched items clear. Unmatched items remain in their column.
  - n: 3
    action: |
      For an unmatched bank line (e.g., bank fee), post an adjusting
      JE.
    expected: |
      JE posts. The line clears the reconciliation.
  - n: 4
    action: |
      Close the reconciliation.
    expected: |
      The system confirms reconciled balance equals statement ending
      balance. The reconciliation is saved.
expected_overall: |
  Bank reconciliation closes balanced, capturing matches and
  adjustments.
pass_criteria: |
  Reconciled balance = statement balance AND adjustments posted AND
  reconciliation saved.
est_minutes: 15
```
