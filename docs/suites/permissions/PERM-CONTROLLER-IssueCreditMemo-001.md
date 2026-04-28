## PERM-CONTROLLER-IssueCreditMemo-001 — Controller can issue a credit memo

```yaml
id: PERM-CONTROLLER-IssueCreditMemo-001
title: Controller is allowed to issue a customer credit memo
goal: |
  Verify a Controller can issue a credit memo against a posted
  invoice (or stand-alone), generate the offsetting GL entries, and
  capture the action with reason and amount in the audit log.
roles:
  - Controller
capabilities:
  - CAP-O2C-CREDITMEMO
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Controller user exists.
  - At least one customer with an open AR balance exists.
  - The fiscal period for the credit memo's effective date is open.
steps:
  - n: 1
    action: |
      Sign in as Controller. Open the customer's AR. Issue a $100
      credit memo against an open invoice with reason "concession".
    expected: |
      Credit memo posts. AR balance is reduced by $100. Offsetting GL
      entries (debit revenue / contra-revenue, credit AR) are recorded
      on today's date.
  - n: 2
    action: |
      Open the credit-memo audit log.
    expected: |
      Action is attributed to the Controller with timestamp, amount,
      reason, target invoice, and the resulting GL document.
expected_overall: |
  Controller issues a credit memo; GL impact and audit are intact.
pass_criteria: |
  Credit memo posted AND GL entries created AND audit captures
  actor, timestamp, amount, reason, and linked invoice.
est_minutes: 6
```
