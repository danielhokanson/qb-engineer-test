## PERM-PROCUREMENT-DeleteCustomer-001 — Procurement cannot delete a customer

```yaml
id: PERM-PROCUREMENT-DeleteCustomer-001
title: Procurement is denied deleting a customer record
goal: |
  Verify a Procurement user cannot delete customer records.
roles:
  - Procurement
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Procurement user exists with no other roles attached.
  - At least one customer record exists.
steps:
  - n: 1
    action: |
      Sign in as Procurement. Open a customer record if visible.
    expected: |
      No delete action is available.
  - n: 2
    action: |
      Attempt the delete endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Procurement cannot delete a customer record.
pass_criteria: |
  Customer record unchanged AND endpoint rejected.
est_minutes: 3
```
