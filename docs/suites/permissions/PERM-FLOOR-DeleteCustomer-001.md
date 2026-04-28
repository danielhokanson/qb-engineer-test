## PERM-FLOOR-DeleteCustomer-001 — Floor Operator cannot delete a customer

```yaml
id: PERM-FLOOR-DeleteCustomer-001
title: Floor Operator is denied deleting a customer record
goal: |
  Verify a Floor Operator cannot delete customer records.
roles:
  - Floor Operator
capabilities:
  - CAP-MD-CUSTOMERS
  - CAP-CROSS-PERMS-MATRIX
preconditions:
  - A Floor Operator user exists with no other roles attached.
  - At least one customer record exists.
steps:
  - n: 1
    action: |
      Sign in as Floor Operator. Look for any customer area in
      navigation.
    expected: |
      Customer admin is not reachable.
  - n: 2
    action: |
      Attempt the delete endpoint via direct URL or API.
    expected: |
      The action is rejected.
expected_overall: |
  Floor Operator cannot delete a customer record.
pass_criteria: |
  Customer record unchanged AND endpoint rejected.
est_minutes: 3
```
