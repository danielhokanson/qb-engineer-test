## DOC-STMT-001 — Customer statement generation

```yaml
id: DOC-STMT-001
title: Generate a customer statement showing open invoices and credits
goal: |
  Verify a customer statement can be generated for a date range
  showing all open invoices, payments, and credits with running
  balance, and emailed to the customer.
roles:
  - Controller
preconditions:
  - At least one customer with multiple invoices and at least one
    payment exists.
prerequisite_cases:
  - P4-CASH
steps:
  - n: 1
    action: |
      Open the statement area. Select customer ACME and a date range
      covering recent activity.
    expected: |
      Statement shows opening balance, transactions in range, closing
      balance, with each invoice / payment / credit line.
  - n: 2
    action: |
      Email the statement to the customer's AR contact.
    expected: |
      Email sends. Statement is logged on the customer record.
expected_overall: |
  Customer statement is correct and deliverable.
pass_criteria: |
  Statement balance matches AR aging AND email sent AND log recorded.
est_minutes: 6
```
