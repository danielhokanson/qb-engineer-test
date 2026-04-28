## ACCT-CLOSE-002 — Attempted post into a closed month is rejected

```yaml
id: ACCT-CLOSE-002
title: Posting a transaction dated in a closed month is rejected with a clear message
goal: |
  Verify that when the user attempts to record an invoice, bill,
  payment, or manual adjustment with a date in a previously closed
  month, the application rejects the attempt with a plain-language
  message explaining that the month is closed and the post was not
  recorded.
optional_module: builtin-accounting-full-gl
# Reconciled in Phase 2 — module tag split per L1.
roles:
  - Shop Owner
  - AR Clerk
  - AP Clerk
capabilities:
  - CAP-ACCT-PERIOD
  - CAP-ACCT-FULLGL
preconditions:
  - At least one closed month exists (use ACCT-CLOSE-001).
prerequisite_cases:
  - ACCT-CLOSE-001
steps:
  - n: 1
    action: |
      Try to record a new vendor bill with a date in the closed
      month.
    expected: |
      The application blocks submission. A plain-language message
      explains the month is closed and suggests using a current-month
      date or asking an admin to re-open the period.
  - n: 2
    action: |
      Try the same with a customer invoice and with a manual
      adjustment.
    expected: |
      Each attempt is rejected with the same clarity. No partial
      posts occur.
  - n: 3
    action: |
      Confirm the affected balances are unchanged from before the
      attempts.
    expected: |
      Cash, AR, AP, and any expense/income totals all unchanged.
expected_overall: |
  Closed-month rejection is consistent across all transaction types
  and produces no side effects.
pass_criteria: |
  All three attempts blocked AND error message is plain-language AND
  no balances moved.
est_minutes: 6
```
