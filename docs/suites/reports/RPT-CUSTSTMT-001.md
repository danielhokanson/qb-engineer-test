## RPT-CUSTSTMT-001 — Customer statement ties to AR ledger for that customer

```yaml
id: RPT-CUSTSTMT-001
title: Customer statement reconciles invoices, payments, credit memos, and ending balance
goal: |
  Generate a customer statement for one customer for a defined
  period. Verify the statement lists every invoice, payment, and
  credit memo for that customer in the period and that the ending
  balance equals the customer's open AR.
roles:
  - Sales / Account Manager
  - Controller
preconditions:
  - At least one customer has period activity — an invoice, a
    partial payment, and (ideally) a credit memo (P4-CM-001).
prerequisite_cases:
  - P4-INV-001
  - P4-CASH-PARTIAL
  - P4-CM-001
steps:
  - n: 1
    action: |
      Generate the customer statement for one customer covering
      the period (e.g., the prior month).
    expected: |
      Statement shows opening balance, transactions in date order,
      and ending balance.
  - n: 2
    action: |
      Compare each line on the statement to the customer's AR
      ledger entries for the same dates.
    expected: |
      Every entry matches and there are no missing or extra lines.
  - n: 3
    action: |
      Verify ending balance = opening + (invoices - payments -
      credit memos applied).
    expected: |
      Match within $0.01.
  - n: 4
    action: |
      Compare the statement's ending balance to the customer's row
      on the AR aging detail (RPT-ARAGE-001).
    expected: |
      Match within $0.01.
expected_overall: |
  Statement lists complete activity and the ending balance ties
  to AR aging.
pass_criteria: |
  Every transaction in the period appears on the statement AND
  ending balance ties to AR aging within $0.01.
why_this_matters: |
  Customer statements are sent externally. A wrong statement
  triggers a customer dispute and erodes confidence in every
  invoice that follows.
est_minutes: 10
```
