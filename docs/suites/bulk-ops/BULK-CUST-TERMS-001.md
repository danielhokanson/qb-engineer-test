## BULK-CUST-TERMS-001 — Mass-update customer payment terms

```yaml
id: BULK-CUST-TERMS-001
title: Bulk-update payment terms across a filtered customer set
goal: |
  Verify a credit manager can mass-update payment terms on a set
  of customers (e.g., shifting a credit-risk segment from Net 30
  to Net 15), that the change applies forward-only without altering
  open invoices, and each change is audit-logged per customer.
roles:
  - Credit Manager
  - Controller
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-BULK-OPS
preconditions:
  - At least 6 customers exist on Net 30 terms.
  - At least 1 of them has an open invoice already issued on Net 30.
steps:
  - n: 1
    action: |
      Filter customer list to "terms = Net 30." Select 4 of them.
      Choose mass-update terms. Set new terms = Net 15.
    expected: |
      Stage preview shows the 4 affected rows with prior and new
      terms.
  - n: 2
    action: |
      Confirm.
    expected: |
      Summary reports 4 customers updated. Each customer's master
      record shows Net 15 going forward.
  - n: 3
    action: |
      Open the existing open invoice for the affected customer.
    expected: |
      Open invoice still reflects its original Net 30 terms — the
      bulk change applied forward-only and did not retro-edit posted
      AR.
expected_overall: |
  Terms change applies cleanly and respects open transactions.
pass_criteria: |
  All 4 customers updated AND open invoice unchanged AND audit per
  customer.
est_minutes: 7
```
