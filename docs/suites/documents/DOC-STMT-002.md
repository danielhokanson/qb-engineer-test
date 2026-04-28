## DOC-STMT-002 — Statement content matches AR ledger

```yaml
id: DOC-STMT-002
title: Customer statement content reconciles to AR ledger
goal: |
  Verify the customer statement for a date range shows accurate
  opening balance, every invoice / payment / credit / adjustment in
  the period with correct dates and amounts, running balance per
  line, closing balance, and that closing balance ties to the AR
  aging for that customer as of the statement end date.
roles:
  - Controller
capabilities:
  - CAP-CROSS-DOCS
  - CAP-O2C-COLLECTIONS
preconditions:
  - A customer with multiple invoices, at least one payment, and at
    least one credit memo within the date range exists.
prerequisite_cases:
  - DOC-STMT-001
steps:
  - n: 1
    action: |
      Generate the statement for the customer for a defined date
      range covering all activity above.
    expected: |
      Statement lists opening balance, every transaction in the
      period (invoice, payment, credit, adjustment) with date, type,
      reference number, amount, and running balance per line.
  - n: 2
    action: |
      Compute opening balance + sum of period transactions.
    expected: |
      Result equals the closing balance shown on the statement.
  - n: 3
    action: |
      Compare the closing balance to AR aging for the customer as of
      the statement end date.
    expected: |
      Statement closing balance equals AR aging total for the customer
      as of that date.
expected_overall: |
  Customer statement is a true representation of AR activity for the
  period.
pass_criteria: |
  Every transaction present AND running balance correct AND closing
  balance ties to AR aging.
est_minutes: 8
```
