## ACCT-SETUP-005 — Default payment terms

```yaml
id: ACCT-SETUP-005
title: Set the default payment terms used on new invoices and bills
goal: |
  Verify that a default set of payment terms (for example, "Due on
  receipt", "Net 15", "Net 30") can be configured, that one is
  marked as the default, and that new invoices and vendor bills
  pick it up automatically.
optional_module: builtin-accounting
roles:
  - Shop Owner
  - Administrator
preconditions:
  - The chart of accounts has been initialized (ACCT-SETUP-001).
prerequisite_cases:
  - ACCT-SETUP-001
steps:
  - n: 1
    action: |
      Open the payment terms setup area.
    expected: |
      A list of payment terms options is visible. Each shows its
      name and the number of days until due.
  - n: 2
    action: |
      Mark "Net 30" as the default payment term and save.
    expected: |
      "Net 30" is flagged as the default. Other terms remain available
      for selection per transaction.
  - n: 3
    action: |
      Create a new customer invoice without overriding the term.
    expected: |
      The invoice's term reads "Net 30" and the due date is calculated
      as 30 days from the invoice date.
  - n: 4
    action: |
      Create a new vendor bill without overriding the term.
    expected: |
      The bill's term also defaults to "Net 30" with a 30-day-out
      due date.
expected_overall: |
  Default payment term is configurable and applies to both AR and AP
  transactions.
pass_criteria: |
  Default term set AND new invoice + new bill both inherit it AND due
  dates calculated correctly.
est_minutes: 4
```
